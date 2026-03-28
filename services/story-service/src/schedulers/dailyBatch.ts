import { Queue, Worker, type Job } from 'bullmq'
import { Redis } from 'ioredis'
import cron from 'node-cron'
import { createClient } from '@supabase/supabase-js'
import pino from 'pino'
import { generateDailyStories } from '../generators/storyGenerator.js'
import { storyCache } from '../cache/storyCache.js'

const logger = pino({ name: 'daily-batch' })

const connection = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const QUEUE_NAME = 'story-generation'
const storyQueue = new Queue(QUEUE_NAME, { connection })

// Worker: process story generation jobs
const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const { avatarId, playerId, subscription } = job.data

    // Skip if already cached
    if (await storyCache.exists(avatarId)) {
      logger.info({ avatarId }, 'Already cached, skipping')
      return { status: 'skipped' }
    }

    const stories = await generateDailyStories({
      avatarId,
      playerId,
      subscription,
      daysSinceActive: 0,
    })

    return { status: 'generated', count: Array.isArray(stories) ? stories.length : 0 }
  },
  {
    connection,
    concurrency: 10,
    limiter: { max: 50, duration: 60000 },
  }
)

worker.on('completed', (job) => {
  logger.info({ jobId: job.id, data: job.returnvalue }, 'Job completed')
})

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err: err.message }, 'Job failed')
  // TODO: Sentry notification for jobs that fail 3 times
})

// Cron: 20:00 UTC (= 05:00 JST)
cron.schedule('0 20 * * *', async () => {
  logger.info('Starting daily batch story generation')
  const startTime = Date.now()

  try {
    // Fetch active avatars (updated in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: avatars, error } = await supabase
      .from('avatars')
      .select('id, player_id, players(subscription)')
      .gte('updated_at', thirtyDaysAgo)

    if (error) {
      logger.error({ error }, 'Failed to fetch active avatars')
      return
    }

    if (!avatars || avatars.length === 0) {
      logger.info('No active avatars found')
      return
    }

    // Enqueue jobs
    const jobs = avatars.map((avatar: any) => ({
      name: `story-${avatar.id}`,
      data: {
        avatarId: avatar.id,
        playerId: avatar.player_id,
        subscription: avatar.players?.subscription ?? 'free',
      },
    }))

    await storyQueue.addBulk(jobs)

    const elapsed = Date.now() - startTime
    logger.info({ count: avatars.length, elapsedMs: elapsed }, 'Daily batch enqueued')
  } catch (err) {
    logger.error({ err }, 'Daily batch failed')
  }
})

logger.info('Story worker started')
