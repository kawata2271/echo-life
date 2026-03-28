import Anthropic from '@anthropic-ai/sdk'
import pLimit from 'p-limit'
import pino from 'pino'
import { buildNPCMessagePrompt } from '../prompts/npc.js'
import { logAICost } from '../analytics/costLogger.js'

const logger = pino({ name: 'npc-generator' })
const anthropic = new Anthropic()
const limit = pLimit(5)

interface NPCData {
  id: string
  name: string
  role: string
  occupation: string
  personality_vec: Record<string, number>
  trust: number
  affection: number
  mood: string
}

interface AvatarData {
  name: string
  age: number
  occupation: string
}

interface RecentEvent {
  title: string
  body: string
  emotion_tag: string
}

export async function generateNPCMessages(
  npcs: NPCData[],
  avatar: AvatarData,
  recentEvents: RecentEvent[],
  playerId: string
): Promise<{ npcId: string; message: string | null }[]> {
  const results = await Promise.all(
    npcs.map((npc) =>
      limit(async () => {
        try {
          const { system, user } = buildNPCMessagePrompt(npc, avatar, recentEvents)

          const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 200,
            temperature: 0.8,
            system,
            messages: [{ role: 'user', content: user }],
          })

          const message = response.content[0].type === 'text'
            ? response.content[0].text.trim()
            : null

          await logAICost({
            playerId,
            model: 'claude-haiku-4-5-20251001',
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            purpose: 'npc_message',
          })

          return { npcId: npc.id, message }
        } catch (err) {
          logger.error({ npcId: npc.id, err }, 'Failed to generate NPC message')
          return { npcId: npc.id, message: null }
        }
      })
    )
  )

  return results
}
