import { z } from 'zod'
import type { StatusDelta } from './index'

export type EventType =
  | 'daily'
  | 'choice'
  | 'emotional'
  | 'turning_point'
  | 'flashback'
  | 'npc_message'
  | 'anniversary'

export type EmotionTag =
  | 'joy' | 'sadness' | 'anger'
  | 'surprise' | 'fear' | 'nostalgia'
  | 'hope' | 'melancholy' | 'contentment'

export type AudioTheme =
  | 'morning' | 'afternoon' | 'evening' | 'night'
  | 'rain' | 'celebration' | 'melancholy' | 'tense'

export interface Choice {
  id: string
  text: string      // 30文字以内
  hint: string      // 選んだ場合の雰囲気
  delta: StatusDelta
}

export interface StoryEvent {
  id: string
  avatarId: string
  eventDate: Date
  type: EventType
  title: string     // 15文字以内
  body: string      // 150-350文字
  emotionTag: EmotionTag
  audioTheme: AudioTheme
  statusDelta: StatusDelta
  imageUrl: string | null
  npcIds: string[]
  choices: Choice[] | null
  selectedChoice: string | null
  reactions: EventReaction[]
  isRead: boolean
  embedding: number[] | null
  createdAt: Date
}

export interface EventReaction {
  emoji: '❤️' | '😢' | '😂' | '😮' | '🔥'
  playerId: string
  createdAt: Date
}

// Zod スキーマ（AI出力バリデーション用 - Phase 2で使う）
export const ChoiceSchema = z.object({
  id:   z.string(),
  text: z.string().max(30),
  hint: z.string().max(60),
  delta: z.object({
    health:     z.number().min(-10).max(10).optional(),
    wealth:     z.number().min(-10).max(10).optional(),
    love:       z.number().min(-10).max(10).optional(),
    reputation: z.number().min(-10).max(10).optional(),
    happiness:  z.number().min(-10).max(10).optional(),
  }),
})

export const StoryEventAISchema = z.object({
  type:        z.enum(['daily','choice','emotional','turning_point','flashback']),
  title:       z.string().min(1).max(15),
  body:        z.string().min(100).max(400),
  emotionTag:  z.enum(['joy','sadness','anger','surprise','fear','nostalgia','hope','melancholy','contentment']),
  audioTheme:  z.enum(['morning','afternoon','evening','night','rain','celebration','melancholy','tense']),
  statusDelta: z.object({
    health:     z.number().optional(),
    wealth:     z.number().optional(),
    love:       z.number().optional(),
    reputation: z.number().optional(),
    happiness:  z.number().optional(),
  }),
  choices: z.array(ChoiceSchema).nullable(),
})

export const AIResponseSchema = z.object({
  events: z.array(StoryEventAISchema).min(2).max(5),
})
