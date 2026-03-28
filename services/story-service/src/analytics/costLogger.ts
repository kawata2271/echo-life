import { createClient } from '@supabase/supabase-js'
import pino from 'pino'

const logger = pino({ name: 'cost-logger' })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Current phase: Haiku only. Opus costs kept as comments for future use.
const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5-20251001': { input: 0.001, output: 0.005 },
  // 'claude-opus-4-6':        { input: 0.005, output: 0.025 }, // Phase 5+
}

export async function logAICost(opts: {
  playerId: string
  model: string
  inputTokens: number
  outputTokens: number
  purpose: string
}): Promise<void> {
  const rates = COST_PER_1K_TOKENS[opts.model]
  if (!rates) {
    logger.warn({ model: opts.model }, 'Unknown model for cost calculation')
    return
  }

  const costUsd =
    (opts.inputTokens / 1000) * rates.input +
    (opts.outputTokens / 1000) * rates.output

  try {
    await supabase.from('ai_cost_log').insert({
      player_id: opts.playerId,
      model: opts.model,
      input_tokens: opts.inputTokens,
      output_tokens: opts.outputTokens,
      cost_usd: costUsd,
      purpose: opts.purpose,
    })

    // Update monthly cost
    try {
      await supabase.rpc('increment_monthly_cost', {
        p_player_id: opts.playerId,
        p_amount: costUsd,
      })
    } catch {
      // If RPC doesn't exist, skip silently
      logger.debug('increment_monthly_cost RPC not available, skipping')
    }

    await checkCostAlert(opts.playerId)
  } catch (err) {
    logger.error({ err, ...opts }, 'Failed to log AI cost')
  }
}

export async function checkCostAlert(playerId: string): Promise<void> {
  const THRESHOLD = 0.12 // ~¥18

  try {
    const { data } = await supabase
      .from('players')
      .select('monthly_ai_cost')
      .eq('id', playerId)
      .single()

    if (data && Number(data.monthly_ai_cost) > THRESHOLD) {
      logger.warn({ playerId, cost: data.monthly_ai_cost }, 'Monthly AI cost exceeds threshold')
    }
  } catch (err) {
    logger.error({ err }, 'Failed to check cost alert')
  }
}
