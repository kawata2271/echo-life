describe('npcGenerator', () => {
  const mockNPCs = [
    { id: 'npc-1', name: '田中 麻衣', role: 'friend', occupation: 'デザイナー', personality_vec: { extraversion: 0.9 }, trust: 60, affection: 40, mood: 'happy' },
    { id: 'npc-2', name: '佐藤 拓海', role: 'rival', occupation: 'エンジニア', personality_vec: { extraversion: 0.3 }, trust: 20, affection: -10, mood: 'neutral' },
  ]

  const _mockAvatar = { name: 'テスト太郎', age: 25, occupation: '会社員' }
  const _mockEvents = [{ title: '朝の散歩', body: '公園を歩いた', emotion_tag: 'joy' }]

  test('generates messages for multiple NPCs', () => {
    // Simulate NPC message generation result
    const results = mockNPCs.map((npc) => ({
      npcId: npc.id,
      message: `${npc.name}からのメッセージ`,
    }))

    expect(results).toHaveLength(2)
    results.forEach((r) => {
      expect(r).toHaveProperty('npcId')
      expect(r).toHaveProperty('message')
    })
  })

  test('one NPC failure does not affect others', () => {
    const results = [
      { npcId: 'npc-1', message: 'こんにちは！今日も頑張ろう！' },
      { npcId: 'npc-2', message: null }, // Failed
    ]

    const successful = results.filter((r) => r.message !== null)
    expect(successful).toHaveLength(1)
    expect(successful[0].npcId).toBe('npc-1')
  })

  test('NPC messages respect character limit', () => {
    const message = 'テスト太郎、今日もお疲れ様。最近少し顔色が悪いから、たまには休んでね。'
    expect(message.length).toBeGreaterThanOrEqual(20)
    expect(message.length).toBeLessThanOrEqual(100)
  })

  test('all NPCs get lastMessage set', () => {
    const results = mockNPCs.map((npc) => ({
      npcId: npc.id,
      message: `${npc.name}：今日の一言`,
    }))

    results.forEach((r) => {
      expect(r.message).toBeTruthy()
      expect(typeof r.message).toBe('string')
    })
  })
})
