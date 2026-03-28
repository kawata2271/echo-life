import { isSameDay as fnsIsSameDay } from 'date-fns'

export function getSeason(date: Date): '春' | '夏' | '秋' | '冬' {
  const month = date.getMonth() + 1
  if (month >= 3 && month <= 5) return '春'
  if (month >= 6 && month <= 8) return '夏'
  if (month >= 9 && month <= 11) return '秋'
  return '冬'
}

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']

export function getDayOfWeek(date: Date): string {
  return DAY_NAMES[date.getDay()]
}

export function formatEventDate(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${m}月${d}日`
}

export function isSameDay(a: Date, b: Date): boolean {
  return fnsIsSameDay(a, b)
}
