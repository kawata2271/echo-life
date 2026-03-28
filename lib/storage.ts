import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'echo-life-storage' })

export function getString(key: string): string | null {
  try {
    return storage.getString(key) ?? null
  } catch (e) {
    console.warn(`[Storage] getString error for key "${key}":`, e)
    return null
  }
}

export function setString(key: string, value: string): void {
  try {
    storage.set(key, value)
  } catch (e) {
    console.warn(`[Storage] setString error for key "${key}":`, e)
  }
}

export function getObject<T>(key: string, fallback: T): T {
  try {
    const raw = storage.getString(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (e) {
    console.warn(`[Storage] getObject error for key "${key}":`, e)
    return fallback
  }
}

export function setObject<T>(key: string, value: T): void {
  try {
    storage.set(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`[Storage] setObject error for key "${key}":`, e)
  }
}

export function remove(key: string): void {
  try {
    storage.delete(key)
  } catch (e) {
    console.warn(`[Storage] remove error for key "${key}":`, e)
  }
}

export function clear(): void {
  try {
    storage.clearAll()
  } catch (e) {
    console.warn(`[Storage] clear error:`, e)
  }
}
