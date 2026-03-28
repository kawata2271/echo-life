// Metro bundler picks .web.ts automatically for web platform
// This replaces lib/storage.ts on web, using localStorage instead of MMKV

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch { return null }
  },
  set<T>(key: string, value: T): void {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch (_e) { /* noop */ }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key) } catch (_e) { /* noop */ }
  },
  clear(): void {
    try { localStorage.clear() } catch (_e) { /* noop */ }
  },
}

export const zustandStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
}
