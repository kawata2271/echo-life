import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'
import type { Player, PlayerSettings } from '../types'

const mmkv = new MMKV({ id: 'player-store' })

const mmkvStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.delete(key),
}

interface PlayerState {
  player: Player | null
  createPlayer: (name: string) => void
  updateSettings: (settings: Partial<PlayerSettings>) => void
  completeOnboarding: () => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    immer((set) => ({
      player: null,

      createPlayer: (name) => set((s) => {
        s.player = {
          id: `player-${Date.now()}`,
          name,
          createdAt: new Date(),
          subscription: 'free',
          settings: {
            notificationsEnabled: true,
            notificationTime: '08:00',
            soundEnabled: true,
            hapticEnabled: true,
            theme: 'dark',
          },
          onboardingDone: false,
        }
      }),

      updateSettings: (settings) => set((s) => {
        if (!s.player) return
        Object.assign(s.player.settings, settings)
      }),

      completeOnboarding: () => set((s) => {
        if (s.player) s.player.onboardingDone = true
      }),

      reset: () => set((s) => { s.player = null }),
    })),
    {
      name: 'echo-player',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
