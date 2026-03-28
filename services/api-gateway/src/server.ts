import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import pino from 'pino'
import { appRouter } from './trpc/router.js'
import { verifyToken } from './auth/jwt.js'
import { supabaseAdmin } from './db/supabase.js'
import type { Context } from './trpc/trpc.js'

const logger = pino({ name: 'api-gateway' })
const PORT = parseInt(process.env.PORT ?? '3001', 10)

async function main() {
  const server = Fastify({ logger: true })

  await server.register(cors, {
    origin: process.env.NODE_ENV === 'production' ? 'https://echolife.app' : '*',
  })

  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  server.get('/health', async () => ({
    status: 'ok',
    version: '2.0.0',
    uptime: process.uptime(),
  }))

  // tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: async ({ req }: { req: { headers: Record<string, string | string[] | undefined> } }): Promise<Context> => {
        const authHeader = req.headers.authorization
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
          return { user: null, player: null }
        }

        const token = authHeader.slice(7)
        const payload = verifyToken(token)
        if (!payload) {
          return { user: null, player: null }
        }

        const { data: player } = await supabaseAdmin
          .from('players')
          .select('subscription')
          .eq('id', payload.id)
          .single()

        return {
          user: { id: payload.id },
          player: player ? { subscription: player.subscription } : null,
        }
      },
    },
  })

  server.setNotFoundHandler((_req, reply) => {
    reply.status(404).send({ error: 'Not Found' })
  })

  server.setErrorHandler((error, _req, reply) => {
    const err = error as Error & { statusCode?: number }
    logger.error({ err }, 'Request error')
    reply.status(err.statusCode ?? 500).send({
      error: (err.statusCode ?? 500) >= 500 ? 'Internal Server Error' : err.message,
    })
  })

  await server.listen({ port: PORT, host: '0.0.0.0' })
  logger.info(`API Gateway running on port ${PORT}`)
}

main().catch((err) => {
  logger.error(err, 'Failed to start server')
  process.exit(1)
})
