import { MMKV } from 'react-native-mmkv'

const mmkv = new MMKV({ id: 'echo-life' })

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = mmkv.getString(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch { return null }
  },
  set<T>(key: string, value: T): void {
    try { mmkv.set(key, JSON.stringify(value)) } catch (_e) { /* noop */ }
  },
  remove(key: string): void {
    try { mmkv.delete(key) } catch (_e) { /* noop */ }
  },
  clear(): void {
    try { mmkv.clearAll() } catch (_e) { /* noop */ }
  },
}

export const zustandStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.delete(key),
}
