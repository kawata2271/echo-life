import OpenAI from 'openai'
import pLimit from 'p-limit'
import pino from 'pino'

const logger = pino({ name: 'content-filter' })
const openai = new OpenAI()
const limit = pLimit(10)

export async function contentFilter(text: string): Promise<boolean> {
  return limit(async () => {
    try {
      const res = await openai.moderations.create({ input: text })
      const result = res.results[0]

      if (result.categories.sexual || result.categories.violence || result.categories.harassment) {
        logger.warn({ text: text.slice(0, 50) }, 'Content flagged by moderation')
        return false
      }

      return true
    } catch (err) {
      logger.error({ err }, 'Moderation API error, allowing content')
      return true
    }
  })
}
