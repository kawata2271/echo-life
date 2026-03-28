import { emotionToEmoji, emotionToColor, happinessToTendency, calculateHappinessTrend } from '../lib/emotions'
import { TOKENS } from '../constants/tokens'
import type { EmotionTag, StoryEvent } from '../types/events'

describe('emotionToEmoji', () => {
  const cases: [EmotionTag, string][] = [
    ['joy', '☀️'],
    ['sadness', '🌧'],
    ['anger', '⚡'],
    ['surprise', '✨'],
    ['fear', '🌑'],
    ['nostalgia', '🍂'],
    ['hope', '🌱'],
    ['melancholy', '🌫'],
    ['contentment', '🕯'],
  ]

  test.each(cases)('returns %s for %s', (tag, expected) => {
    expect(emotionToEmoji(tag)).toBe(expected)
  })
})

describe('emotionToColor', () => {
  const cases: [EmotionTag, string][] = [
    ['joy', TOKENS.color.emotion.joy],
    ['sadness', TOKENS.color.emotion.sadness],
    ['anger', TOKENS.color.emotion.anger],
    ['surprise', TOKENS.color.emotion.surprise],
    ['fear', TOKENS.color.emotion.fear],
    ['nostalgia', TOKENS.color.emotion.nostalgia],
    ['hope', TOKENS.color.emotion.hope],
    ['melancholy', TOKENS.color.emotion.melancholy],
    ['contentment', TOKENS.color.emotion.contentment],
  ]

  test.each(cases)('returns correct color for %s', (tag, expected) => {
    expect(emotionToColor(tag)).toBe(expected)
  })
})

describe('happinessToTendency', () => {
  test('returns とても良い for 80+', () => {
    expect(happinessToTendency(80)).toBe('とても良い')
    expect(happinessToTendency(100)).toBe('とても良い')
  })

  test('returns まあまあ for 60-79', () => {
    expect(happinessToTendency(60)).toBe('まあまあ')
  })

  test('returns やや辛い for 40-59', () => {
    expect(happinessToTendency(40)).toBe('やや辛い')
  })

  test('returns 辛い for below 40', () => {
    expect(happinessToTendency(20)).toBe('辛い')
    expect(happinessToTendency(0)).toBe('辛い')
  })
})

describe('calculateHappinessTrend', () => {
  const makeEvent = (happiness: number, daysAgo: number): StoryEvent => ({
    id: `e-${daysAgo}`,
    avatarId: 'a1',
    eventDate: new Date(Date.now() - daysAgo * 86400000),
    type: 'daily',
    title: 'test',
    body: 'test body',
    emotionTag: 'joy',
    audioTheme: 'morning',
    statusDelta: { happiness },
    imageUrl: null,
    npcIds: [],
    choices: null,
    selectedChoice: null,
    reactions: [],
    isRead: true,
    embedding: null,
    createdAt: new Date(),
  })

  test('returns flat for fewer than 2 events', () => {
    expect(calculateHappinessTrend([])).toBe('flat')
    expect(calculateHappinessTrend([makeEvent(5, 1)])).toBe('flat')
  })

  test('returns up when happiness increases', () => {
    const events = [
      makeEvent(-3, 4),
      makeEvent(-2, 3),
      makeEvent(3, 2),
      makeEvent(5, 1),
    ]
    expect(calculateHappinessTrend(events)).toBe('up')
  })

  test('returns down when happiness decreases', () => {
    const events = [
      makeEvent(5, 4),
      makeEvent(3, 3),
      makeEvent(-3, 2),
      makeEvent(-5, 1),
    ]
    expect(calculateHappinessTrend(events)).toBe('down')
  })

  test('returns flat when happiness is stable', () => {
    const events = [
      makeEvent(1, 4),
      makeEvent(0, 3),
      makeEvent(1, 2),
      makeEvent(0, 1),
    ]
    expect(calculateHappinessTrend(events)).toBe('flat')
  })
})
