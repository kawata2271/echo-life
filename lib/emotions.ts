import type { EmotionTag, StoryEvent } from '../types/events'
import { TOKENS } from '../constants/tokens'

const EMOJI_MAP: Record<EmotionTag, string> = {
  joy: '☀️',
  sadness: '🌧',
  anger: '⚡',
  surprise: '✨',
  fear: '🌑',
  nostalgia: '🍂',
  hope: '🌱',
  melancholy: '🌫',
  contentment: '🕯',
}

export function emotionToEmoji(tag: EmotionTag): string {
  return EMOJI_MAP[tag] ?? '📖'
}

export function emotionToColor(tag: EmotionTag): string {
  return TOKENS.color.emotion[tag] ?? TOKENS.color.textMuted
}

export function happinessToTendency(happiness: number): string {
  if (happiness >= 80) return 'とても良い'
  if (happiness >= 60) return 'まあまあ'
  if (happiness >= 40) return 'やや辛い'
  return '辛い'
}

export function calculateHappinessTrend(events: StoryEvent[]): 'up' | 'flat' | 'down' {
  if (events.length < 2) return 'flat'

  const sorted = [...events].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  )

  const half = Math.floor(sorted.length / 2)
  const firstHalf = sorted.slice(0, half)
  const secondHalf = sorted.slice(half)

  const avg = (arr: StoryEvent[]) => {
    const sum = arr.reduce((acc, e) => acc + (e.statusDelta.happiness ?? 0), 0)
    return sum / arr.length
  }

  const diff = avg(secondHalf) - avg(firstHalf)
  if (diff > 1) return 'up'
  if (diff < -1) return 'down'
  return 'flat'
}
