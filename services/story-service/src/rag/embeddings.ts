import OpenAI from 'openai'
import pino from 'pino'

const logger = pino({ name: 'embeddings' })
const client = new OpenAI()

export async function embedText(text: string): Promise<number[] | null> {
  if (!text || text.trim().length === 0) {
    return new Array(1536).fill(0)
  }

  try {
    const res = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000),
    })
    return res.data[0].embedding
  } catch (err) {
    logger.error({ err }, 'Failed to generate embedding')
    return null
  }
}

export async function embedBatch(texts: string[]): Promise<(number[] | null)[]> {
  if (texts.length === 0) return []

  try {
    const validTexts = texts.map((t) => (t && t.trim().length > 0 ? t.slice(0, 8000) : ' '))
    const res = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: validTexts,
    })
    return res.data.map((d) => d.embedding)
  } catch (err) {
    logger.error({ err }, 'Failed to generate batch embeddings')
    return texts.map(() => null)
  }
}
