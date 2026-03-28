export type NPCRole = 'friend' | 'lover' | 'rival' | 'mentor' | 'family' | 'acquaintance'

export interface NPC {
  id: string
  avatarId: string
  name: string
  age: number
  role: NPCRole
  occupation: string
  personalityVec: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  emotionState: NPCEmotionState
  meetingStory: string
  lastMessage: string | null
  lastSeenAt: Date | null
  photoSeed: number
  createdAt: Date
}

export interface NPCEmotionState {
  trust: number       // -100 to 100
  affection: number   // -100 to 100
  jealousy: number    // 0 to 100
  dependence: number  // 0 to 100
  respect: number     // -100 to 100
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'excited'
  updatedAt: Date
}

export type NPCEmotionDelta = {
  trust?: number
  affection?: number
  jealousy?: number
  dependence?: number
  respect?: number
}

// 関係変化の閾値
export const RELATIONSHIP_THRESHOLDS = {
  friendToLover: { affection: 80, trust: 70, dependence: 50 },
  friendToRival: { affection: -30, jealousy: 70 },
  loverBreakup:  { affection: -20, trust: -40 },
} as const
