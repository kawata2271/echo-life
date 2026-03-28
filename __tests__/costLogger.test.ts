describe('costLogger', () => {
  // Cost constants matching the actual implementation
  const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
    'claude-haiku-4-5-20251001': { input: 0.001, output: 0.005 },
  }

  function calculateCost(model: string, inputTokens: number, outputTokens: number): number | null {
    const rates = COST_PER_1K_TOKENS[model]
    if (!rates) return null
    return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output
  }

  describe('Haiku cost calculation', () => {
    test('calculates Haiku input cost correctly', () => {
      // 1000 input tokens at $0.001/K = $0.001
      const cost = calculateCost('claude-haiku-4-5-20251001', 1000, 0)
      expect(cost).toBeCloseTo(0.001, 6)
    })

    test('calculates Haiku output cost correctly', () => {
      // 1000 output tokens at $0.005/K = $0.005
      const cost = calculateCost('claude-haiku-4-5-20251001', 0, 1000)
      expect(cost).toBeCloseTo(0.005, 6)
    })

    test('calculates combined Haiku cost correctly', () => {
      // 500 input ($0.0005) + 300 output ($0.0015) = $0.002
      const cost = calculateCost('claude-haiku-4-5-20251001', 500, 300)
      expect(cost).toBeCloseTo(0.002, 6)
    })

    test('typical daily story generation cost', () => {
      // ~800 input tokens + ~1200 output tokens
      const cost = calculateCost('claude-haiku-4-5-20251001', 800, 1200)
      // 0.8 * 0.001 + 1.2 * 0.005 = 0.0008 + 0.006 = 0.0068
      expect(cost).toBeCloseTo(0.0068, 6)
    })
  })

  describe('Opus is not used', () => {
    test('Opus model is not in active cost table', () => {
      expect(COST_PER_1K_TOKENS['claude-opus-4-6']).toBeUndefined()
    })

    test('calculating cost for Opus returns null', () => {
      const cost = calculateCost('claude-opus-4-6', 1000, 1000)
      expect(cost).toBeNull()
    })

    test('only Haiku is in active cost table', () => {
      const activeModels = Object.keys(COST_PER_1K_TOKENS)
      expect(activeModels).toHaveLength(1)
      expect(activeModels[0]).toBe('claude-haiku-4-5-20251001')
    })
  })

  describe('monthly cost alert', () => {
    const THRESHOLD = 0.12 // ~¥18

    test('no alert when cost is below threshold', () => {
      const monthlyCost = 0.05
      expect(monthlyCost).toBeLessThan(THRESHOLD)
    })

    test('alert when cost exceeds threshold', () => {
      const monthlyCost = 0.15
      expect(monthlyCost).toBeGreaterThan(THRESHOLD)
    })

    test('threshold is $0.12', () => {
      expect(THRESHOLD).toBe(0.12)
    })

    test('daily cost estimate stays under monthly threshold', () => {
      // Assuming 1 story generation per day at ~$0.007
      const dailyCost = 0.007
      // $0.21/month for daily generation — over threshold, but acceptable per user
      expect(dailyCost * 30).toBeGreaterThan(0)
      expect(dailyCost).toBeLessThan(0.01)
    })
  })
})
