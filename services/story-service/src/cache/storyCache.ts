import { Redis } from 'ioredis'
import pino from 'pino'

const logger = pino({ name: 'story-cache' })

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')
const PREFIX = 'story:'
const TTL = 86400

export const storyCache = {
  async get(avatarId: string): Promise<unknown[] | null> {
    try {
      const raw = await redis.get(PREFIX + avatarId)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (err) {
      logger.error({ err }, 'Cache get error')
      return null
    }
  },

  async set(avatarId: string, events: unknown[]): Promise<void> {
    try {
      await redis.setex(PREFIX + avatarId, TTL, JSON.stringify(events))
    } catch (err) {
      logger.error({ err }, 'Cache set error')
    }
  },

  async exists(avatarId: string): Promise<boolean> {
    try {
      return (await redis.exists(PREFIX + avatarId)) === 1
    } catch {
      return false
    }
  },

  async delete(avatarId: string): Promise<void> {
    try {
      await redis.del(PREFIX + avatarId)
    } catch (err) {
      logger.error({ err }, 'Cache delete error')
    }
  },
}
