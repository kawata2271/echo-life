// Player（プレイヤー）
export interface Player {
  id: string
  name: string
  createdAt: Date
  subscription: 'free' | 'premium' | 'family'
  settings: PlayerSettings
  onboardingDone: boolean
}

export interface PlayerSettings {
  notificationsEnabled: boolean
  notificationTime: string    // 'HH:mm'
  soundEnabled: boolean
  hapticEnabled: boolean
  theme: 'dark' | 'light' | 'auto'
}

// Avatar（分身）
export interface Avatar {
  id: string
  playerId: string
  name: string
  age: number
  birthYear: number
  hometown: string
  currentCity: string
  occupation: string
  dream: string
  lifeTheme: LifeTheme
  appearance: AvatarAppearance
  status: AvatarStatus
  personality: PersonalityVector
  createdAt: Date
  updatedAt: Date
}

export interface AvatarStatus {
  health: number      // 0-100
  wealth: number      // 0-100
  love: number        // 0-100
  reputation: number  // 0-100
  happiness: number   // 0-100
}

export interface AvatarAppearance {
  skinTone: 1 | 2 | 3 | 4 | 5 | 6
  hairStyle: number   // 1-20
  hairColor: string   // hex
  eyeShape: number    // 1-12
  faceShape: number   // 1-8
  gender: 'm' | 'f' | 'nb'
}

export interface PersonalityVector {
  openness: number           // 0-1 Big Five
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export type LifeTheme = 'romance' | 'career' | 'adventure' | 'freedom' | 'family'
export type StatusDelta = Partial<AvatarStatus>

// ステータスにデルタを適用（0-100にクランプ）
export function applyStatusDelta(status: AvatarStatus, delta: StatusDelta): AvatarStatus {
  const clamp = (v: number) => Math.min(100, Math.max(0, v))
  return {
    health:     clamp((status.health     ?? 50) + (delta.health     ?? 0)),
    wealth:     clamp((status.wealth     ?? 50) + (delta.wealth     ?? 0)),
    love:       clamp((status.love       ?? 50) + (delta.love       ?? 0)),
    reputation: clamp((status.reputation ?? 50) + (delta.reputation ?? 0)),
    happiness:  clamp((status.happiness  ?? 50) + (delta.happiness  ?? 0)),
  }
}
