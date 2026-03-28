import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '../lib/storage'
import type { StoryEvent, EventReaction, EmotionTag } from '../types/events'
import { STATIC_STORIES } from '../data/staticStories'
import { useAvatarStore } from './avatarStore'

interface StoryState {
  todayEvents: StoryEvent[]
  currentIndex: number
  archivedEvents: StoryEvent[]
  lastFetchDate: string | null

  fetchTodayEvents: (avatarId: string) => void
  markEventRead: (eventId: string) => void
  makeChoice: (eventId: string, choiceId: string) => void
  addReaction: (eventId: string, emoji: EventReaction['emoji']) => void
  advanceCard: () => void
  getEmotionHistory: (days: number) => { date: string; happiness: number }[]
  reset: () => void
}

export const useStoryStore = create<StoryState>()(
  persist(
    immer((set, get) => ({
      todayEvents: [],
      currentIndex: 0,
      archivedEvents: [],
      lastFetchDate: null,

      fetchTodayEvents: (avatarId: string) => {
        const today = new Date().toISOString().slice(0, 10)
        if (get().lastFetchDate === today) return

        const avatar = useAvatarStore.getState().avatar
        const happiness = avatar?.status.happiness ?? 50
        const dayOfWeek = new Date().getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

        // Build weighted pool from static stories
        const positiveEmotions: EmotionTag[] = ['joy', 'hope', 'contentment']
        const negativeEmotions: EmotionTag[] = ['sadness', 'melancholy', 'nostalgia']

        const weighted = STATIC_STORIES.map((story) => {
          let weight = 1

          // Mood-based weighting
          if (happiness > 65 && positiveEmotions.includes(story.emotionTag)) {
            weight += 2
          } else if (happiness < 35 && negativeEmotions.includes(story.emotionTag)) {
            weight += 2
          }

          // Weekend bonus for choice events
          if (isWeekend && story.type === 'choice') {
            weight *= 2
          }

          return { story, weight }
        })

        // Weighted random selection of 3-5 stories
        const count = 3 + Math.floor(Math.random() * 3) // 3, 4, or 5
        const selected: typeof STATIC_STORIES = []
        const pool = [...weighted]

        for (let i = 0; i < count && pool.length > 0; i++) {
          const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0)
          let rand = Math.random() * totalWeight
          let idx = 0

          for (idx = 0; idx < pool.length; idx++) {
            rand -= pool[idx].weight
            if (rand <= 0) break
          }

          selected.push(pool[idx].story)
          pool.splice(idx, 1)
        }

        // Convert static stories to StoryEvent objects
        const now = new Date()
        const events: StoryEvent[] = selected.map((story) => ({
          id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          avatarId,
          eventDate: now,
          type: story.type,
          title: story.title,
          body: story.body,
          emotionTag: story.emotionTag,
          audioTheme: story.audioTheme,
          statusDelta: story.statusDelta,
          imageUrl: null,
          npcIds: [],
          choices: story.choices ?? null,
          selectedChoice: null,
          reactions: [],
          isRead: false,
          embedding: null,
          createdAt: now,
        }))

        set((s) => {
          s.todayEvents = events as any
          s.currentIndex = 0
          s.lastFetchDate = today
        })
      },

      markEventRead: (eventId: string) => set((s) => {
        const event = s.todayEvents.find((e) => e.id === eventId)
        if (event && !event.isRead) {
          event.isRead = true
          s.archivedEvents.push({ ...event } as any)
        }
      }),

      makeChoice: (eventId: string, choiceId: string) => {
        const state = get()
        const event = state.todayEvents.find((e) => e.id === eventId)
        if (!event || !event.choices) return

        const choice = event.choices.find((c) => c.id === choiceId)
        if (!choice) return

        // Apply the choice's status delta via avatarStore
        useAvatarStore.getState().applyDelta(choice.delta)

        set((s) => {
          const ev = s.todayEvents.find((e) => e.id === eventId)
          if (ev) {
            ev.selectedChoice = choiceId
          }
        })
      },

      addReaction: (eventId: string, emoji: EventReaction['emoji']) => set((s) => {
        const event = s.todayEvents.find((e) => e.id === eventId)
          ?? s.archivedEvents.find((e) => e.id === eventId)
        if (event) {
          event.reactions.push({
            emoji,
            playerId: 'self',
            createdAt: new Date(),
          })
        }
      }),

      advanceCard: () => set((s) => {
        const current = s.todayEvents[s.currentIndex]
        if (current && !current.isRead) {
          current.isRead = true
          s.archivedEvents.push({ ...current } as any)
        }
        s.currentIndex += 1
      }),

      reset: () => set((s) => {
        s.todayEvents = []
        s.currentIndex = 0
        s.archivedEvents = []
        s.lastFetchDate = null
      }),

      getEmotionHistory: (days: number) => {
        const state = get()
        const now = new Date()
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

        const byDate = new Map<string, number[]>()

        for (const event of state.archivedEvents) {
          const eventDate = new Date(event.eventDate)
          if (eventDate < cutoff) continue

          const dateKey = eventDate.toISOString().slice(0, 10)
          const happinessDelta = event.statusDelta.happiness ?? 0

          if (!byDate.has(dateKey)) {
            byDate.set(dateKey, [])
          }
          byDate.get(dateKey)!.push(happinessDelta)
        }

        return Array.from(byDate.entries())
          .map(([date, deltas]) => ({
            date,
            happiness: deltas.reduce((sum, d) => sum + d, 0) / deltas.length,
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
      },
    })),
    {
      name: 'echo-story',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
