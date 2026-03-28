import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'
import type { NPC, NPCRole, NPCEmotionDelta } from '../types/npc'
import { RELATIONSHIP_THRESHOLDS } from '../types/npc'
import { NPC_SEEDS } from '../data/npcSeeds'

const mmkv = new MMKV({ id: 'npc-store' })

const mmkvStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.delete(key),
}

interface NPCState {
  npcs: NPC[]
  initializeNPCs: (avatarId: string) => void
  updateEmotion: (npcId: string, delta: NPCEmotionDelta) => void
  checkRelationshipChange: (npcId: string) => void
  getNPCsByRole: (role: NPCRole) => NPC[]
  reset: () => void
}

export const useNPCStore = create<NPCState>()(
  persist(
    immer((set, get) => ({
      npcs: [],

      initializeNPCs: (avatarId: string) => set((s) => {
        if (s.npcs.length > 0) return // Already initialized

        s.npcs = NPC_SEEDS.map((seed, index) => ({
          ...seed,
          id: `npc-${Date.now()}-${index}`,
          avatarId,
          createdAt: new Date(),
        })) as any
      }),

      updateEmotion: (npcId: string, delta: NPCEmotionDelta) => set((s) => {
        const npc = s.npcs.find((n) => n.id === npcId)
        if (!npc) return

        const clampSigned = (v: number) => Math.min(100, Math.max(-100, v))
        const clampUnsigned = (v: number) => Math.min(100, Math.max(0, v))

        if (delta.trust !== undefined) {
          npc.emotionState.trust = clampSigned(npc.emotionState.trust + delta.trust)
        }
        if (delta.affection !== undefined) {
          npc.emotionState.affection = clampSigned(npc.emotionState.affection + delta.affection)
        }
        if (delta.respect !== undefined) {
          npc.emotionState.respect = clampSigned(npc.emotionState.respect + delta.respect)
        }
        if (delta.jealousy !== undefined) {
          npc.emotionState.jealousy = clampUnsigned(npc.emotionState.jealousy + delta.jealousy)
        }
        if (delta.dependence !== undefined) {
          npc.emotionState.dependence = clampUnsigned(npc.emotionState.dependence + delta.dependence)
        }

        npc.emotionState.updatedAt = new Date()
      }),

      checkRelationshipChange: (npcId: string) => set((s) => {
        const npc = s.npcs.find((n) => n.id === npcId)
        if (!npc) return

        const { trust, affection, jealousy, dependence } = npc.emotionState
        const thresholds = RELATIONSHIP_THRESHOLDS

        // Friend -> Lover
        if (
          npc.role === 'friend' &&
          affection >= thresholds.friendToLover.affection &&
          trust >= thresholds.friendToLover.trust &&
          dependence >= thresholds.friendToLover.dependence
        ) {
          npc.role = 'lover'
          return
        }

        // Friend -> Rival
        if (
          npc.role === 'friend' &&
          affection <= thresholds.friendToRival.affection &&
          jealousy >= thresholds.friendToRival.jealousy
        ) {
          npc.role = 'rival'
          return
        }

        // Lover -> breakup (back to acquaintance)
        if (
          npc.role === 'lover' &&
          affection <= thresholds.loverBreakup.affection &&
          trust <= thresholds.loverBreakup.trust
        ) {
          npc.role = 'acquaintance'
          return
        }
      }),

      getNPCsByRole: (role: NPCRole) => {
        return get().npcs.filter((n) => n.role === role)
      },

      reset: () => set((s) => { s.npcs = [] }),
    })),
    {
      name: 'echo-npc',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
