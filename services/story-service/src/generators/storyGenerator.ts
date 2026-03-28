import Anthropic from '@anthropic-ai/sdk'
import pRetry from 'p-retry'
import pino from 'pino'
import { buildDailyStoryPrompt } from '../prompts/daily.js'
import { buildStoryContext, type StoryContext } from '../rag/contextBuilder.js'
import { storyCache } from '../cache/storyCache.js'
import { contentFilter } from '../validators/contentFilter.js'
import { logAICost } from '../analytics/costLogger.js'
import { selectFallbackStories } from './fallbackSelector.js'
import { AIResponseSchema } from './schemas.js'

const logger = pino({ name: 'story-generator' })
const anthropic = new Anthropic()

export interface GenerateOptions {
  avatarId: string
  playerId: string
  subscription: string
  daysSinceActive: number
}

// All users use Haiku. selectModel kept for future Opus switch.
function selectModel(_subscription: string, _daysSinceActive: number): string {
  return 'claude-haiku-4-5-20251001'

  // --- Future Opus usage ---
  // if (_subscription === 'free')     return 'claude-haiku-4-5-20251001'
  // if (_daysSinceActive > 7)         return 'claude-haiku-4-5-20251001'
  // return 'claude-opus-4-6'
}

function stripJsonFence(text: string): string {
  return text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
}

export async function generateDailyStories(opts: GenerateOptions) {
  const { avatarId, playerId, subscription, daysSinceActive } = opts

  // 1. Check cache
  const cached = await storyCache.get(avatarId)
  if (cached) {
    logger.info({ avatarId }, 'Returning cached stories')
    return cached
  }

  // 2. Select model
  const model = selectModel(subscription, daysSinceActive)

  // 3. Build context
  let ctx: StoryContext
  try {
    ctx = await buildStoryContext(avatarId)
  } catch (err) {
    logger.error({ avatarId, err }, 'Failed to build story context, using fallback')
    return selectFallbackStories(null)
  }

  // 4. Build prompt
  const { system, user } = buildDailyStoryPrompt(ctx)

  // 5. Call Claude with retry
  let events: unknown[]
  try {
    const result = await pRetry(
      async () => {
        const response = await anthropic.messages.create({
          model,
          max_tokens: 1600,
          temperature: 0.85,
          system,
          messages: [{ role: 'user', content: user }],
        })

        const text = response.content[0].type === 'text' ? response.content[0].text : ''
        const json = stripJsonFence(text)
        const parsed = JSON.parse(json)

        // 6. Validate
        const validated = AIResponseSchema.parse(parsed)

        // Log cost
        await logAICost({
          playerId,
          model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          purpose: 'daily_story',
        })

        return validated.events
      },
      { retries: 2, onFailedAttempt: (err: any) => logger.warn({ err: String(err), attempt: err.attemptNumber }, 'Retry') }
    )

    events = result
  } catch (err) {
    logger.error({ avatarId, err }, 'AI generation failed after retries, using fallback')
    return selectFallbackStories(ctx.avatar)
  }

  // 7. Content filter
  const filtered = await Promise.all(
    events.map(async (event: any) => {
      const safe = await contentFilter(event.body)
      if (!safe) {
        logger.warn({ title: event.title }, 'Content filtered, replacing with fallback')
        const fallbacks = selectFallbackStories(ctx.avatar)
        return fallbacks[0] ?? event
      }
      return event
    })
  )

  // 8. Cache
  await storyCache.set(avatarId, filtered)

  return filtered
}

export { selectModel }
