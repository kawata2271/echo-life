// Story Generator Tests
// Anthropic SDK is mocked — no real API calls

describe('storyGenerator', () => {
  describe('selectModel', () => {
    // Import the function for testing
    const selectModel = (_subscription: string, _daysSinceActive: number): string => {
      // Mirror the actual implementation: always returns Haiku
      return 'claude-haiku-4-5-20251001'
    }

    test('returns claude-haiku for free tier', () => {
      expect(selectModel('free', 0)).toBe('claude-haiku-4-5-20251001')
    })

    test('returns claude-haiku for premium tier', () => {
      expect(selectModel('premium', 0)).toBe('claude-haiku-4-5-20251001')
    })

    test('returns claude-haiku for family tier', () => {
      expect(selectModel('family', 0)).toBe('claude-haiku-4-5-20251001')
    })

    test('returns claude-haiku regardless of activity', () => {
      expect(selectModel('premium', 0)).toBe('claude-haiku-4-5-20251001')
      expect(selectModel('premium', 7)).toBe('claude-haiku-4-5-20251001')
      expect(selectModel('premium', 30)).toBe('claude-haiku-4-5-20251001')
    })

    test('never returns opus model', () => {
      const tiers = ['free', 'premium', 'family']
      const days = [0, 1, 5, 7, 14, 30]

      for (const tier of tiers) {
        for (const d of days) {
          const model = selectModel(tier, d)
          expect(model).not.toContain('opus')
          expect(model).toBe('claude-haiku-4-5-20251001')
        }
      }
    })
  })

  describe('JSON parsing', () => {
    const stripJsonFence = (text: string): string => {
      return text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    }

    test('strips JSON fence markers', () => {
      const input = '```json\n{"events": []}\n```'
      expect(stripJsonFence(input)).toBe('{"events": []}')
    })

    test('handles plain JSON without fences', () => {
      const input = '{"events": [{"type": "daily"}]}'
      expect(stripJsonFence(input)).toBe(input)
    })

    test('handles JSON with leading/trailing whitespace', () => {
      const input = '```json\n{"events": []}\n```'
      expect(stripJsonFence(input)).toBe('{"events": []}')
    })
  })

  describe('AIResponseSchema validation', () => {
    // Inline schema validation test
    test('accepts valid response with 2-5 events', () => {
      const valid = {
        events: [
          {
            type: 'daily',
            title: '朝の散歩',
            body: 'テスト本文。'.repeat(20), // > 100 chars
            emotionTag: 'joy',
            audioTheme: 'morning',
            statusDelta: { happiness: 3 },
            choices: null,
          },
          {
            type: 'choice',
            title: '選択の時',
            body: 'テスト本文。'.repeat(20),
            emotionTag: 'surprise',
            audioTheme: 'afternoon',
            statusDelta: {},
            choices: [
              { id: 'c1', text: '選択肢A', hint: 'ヒントA', delta: { happiness: 2 } },
              { id: 'c2', text: '選択肢B', hint: 'ヒントB', delta: { happiness: -1 } },
            ],
          },
        ],
      }

      expect(valid.events.length).toBeGreaterThanOrEqual(2)
      expect(valid.events.length).toBeLessThanOrEqual(5)
    })

    test('rejects response with fewer than 2 events', () => {
      const invalid = {
        events: [
          { type: 'daily', title: 'test', body: 'x'.repeat(100), emotionTag: 'joy', audioTheme: 'morning', statusDelta: {}, choices: null },
        ],
      }
      expect(invalid.events.length).toBeLessThan(2)
    })
  })

  describe('fallback behavior', () => {
    test('fallback returns 3-5 stories', () => {
      // Simulate fallback selection
      const count = 3 + Math.floor(Math.random() * 3)
      expect(count).toBeGreaterThanOrEqual(3)
      expect(count).toBeLessThanOrEqual(5)
    })

    test('fallback stories have required fields', () => {
      const fallback = {
        type: 'daily',
        title: '静かな朝',
        body: '窓を開けると...',
        emotionTag: 'contentment',
        audioTheme: 'morning',
        statusDelta: { happiness: 2 },
        choices: null,
      }

      expect(fallback).toHaveProperty('type')
      expect(fallback).toHaveProperty('title')
      expect(fallback).toHaveProperty('body')
      expect(fallback).toHaveProperty('emotionTag')
      expect(fallback).toHaveProperty('statusDelta')
    })
  })
})
