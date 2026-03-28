import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '../lib/storage'
import type { Avatar, StatusDelta, AvatarAppearance, LifeTheme } from '../types'
import { applyStatusDelta } from '../types'

interface AvatarState {
  avatar: Avatar | null
  isLoading: boolean
  createAvatar: (data: {
    name: string
    age: number
    hometown: string
    occupation: string
    dream: string
    lifeTheme: LifeTheme
    appearance: AvatarAppearance
    playerId: string
  }) => void
  applyDelta: (delta: StatusDelta) => void
  updateCity: (city: string) => void
  updateOccupation: (occupation: string) => void
  incrementAge: () => void
  reset: () => void
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    immer((set) => ({
      avatar: null,
      isLoading: false,

      createAvatar: (data) => set((s) => {
        s.avatar = {
          id: `avatar-${Date.now()}`,
          playerId: data.playerId,
          name: data.name,
          age: data.age,
          birthYear: new Date().getFullYear() - data.age,
          hometown: data.hometown,
          currentCity: data.hometown,
          occupation: data.occupation,
          dream: data.dream,
          lifeTheme: data.lifeTheme,
          appearance: data.appearance,
          status: { health: 60, wealth: 40, love: 50, reputation: 50, happiness: 55 },
          personality: computePersonality(data.lifeTheme),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }),

      applyDelta: (delta) => set((s) => {
        if (!s.avatar) return
        s.avatar.status = applyStatusDelta(s.avatar.status, delta)
        s.avatar.updatedAt = new Date()
      }),

      updateCity: (city) => set((s) => {
        if (s.avatar) s.avatar.currentCity = city
      }),

      updateOccupation: (occ) => set((s) => {
        if (s.avatar) s.avatar.occupation = occ
      }),

      incrementAge: () => set((s) => {
        if (s.avatar) {
          s.avatar.age += 1
          const decay = s.avatar.age > 60 ? 2 : s.avatar.age > 45 ? 1 : 0
          s.avatar.status.health = Math.max(0, s.avatar.status.health - decay)
        }
      }),

      reset: () => set((s) => { s.avatar = null }),
    })),
    {
      name: 'echo-avatar',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

function computePersonality(theme: LifeTheme) {
  const map: Record<LifeTheme, [number, number, number, number, number]> = {
    romance:   [0.70, 0.50, 0.80, 0.90, 0.60],
    career:    [0.60, 0.90, 0.50, 0.50, 0.40],
    adventure: [0.95, 0.40, 0.70, 0.60, 0.30],
    freedom:   [0.90, 0.30, 0.70, 0.50, 0.50],
    family:    [0.50, 0.80, 0.60, 0.95, 0.40],
  }
  const [o, c, e, a, n] = map[theme]
  return { openness: o, conscientiousness: c, extraversion: e, agreeableness: a, neuroticism: n }
}
