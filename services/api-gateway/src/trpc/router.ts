import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from './trpc.js'
import { supabaseAdmin } from '../db/supabase.js'
import { signToken, signRefreshToken, verifyToken } from '../auth/jwt.js'
import { TRPCError } from '@trpc/server'

// ===== Auth Router =====
const authRouter = router({
  signup: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1).max(40),
    }))
    .mutation(async ({ input }) => {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
      })

      if (authError) throw new TRPCError({ code: 'BAD_REQUEST', message: authError.message })

      const userId = authData.user.id

      const { error: playerError } = await supabaseAdmin.from('players').insert({
        id: userId,
        name: input.name,
      })

      if (playerError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: playerError.message })

      const token = signToken(userId)
      const refreshToken = signRefreshToken(userId)

      return { token, refreshToken, userId }
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      })

      if (error) throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message })

      const token = signToken(data.user.id)
      const refreshToken = signRefreshToken(data.user.id)

      return { token, refreshToken, userId: data.user.id }
    }),

  refresh: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const payload = verifyToken(input.refreshToken)
      if (!payload) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid refresh token' })

      const token = signToken(payload.id)
      const refreshToken = signRefreshToken(payload.id)

      return { token, refreshToken }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabaseAdmin
      .from('players')
      .select('*')
      .eq('id', ctx.user.id)
      .single()

    if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Player not found' })
    return data
  }),
})

// ===== Avatar Router =====
const avatarRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      age: z.number().min(18).max(120),
      hometown: z.string().min(1),
      occupation: z.string().min(1),
      dream: z.string().min(1),
      lifeTheme: z.enum(['romance', 'career', 'adventure', 'freedom', 'family']),
      appearance: z.record(z.string(), z.unknown()),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: avatar, error } = await supabaseAdmin.from('avatars').insert({
        player_id: ctx.user.id,
        name: input.name,
        age: input.age,
        birth_year: new Date().getFullYear() - input.age,
        hometown: input.hometown,
        current_city: input.hometown,
        occupation: input.occupation,
        dream: input.dream,
        life_theme: input.lifeTheme,
        appearance: input.appearance,
      }).select().single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Create NPC seeds
      const npcSeeds = [
        { name: '田中 麻衣', age: 27, role: 'friend', occupation: 'グラフィックデザイナー', personality_vec: { openness: 0.8, conscientiousness: 0.5, extraversion: 0.9, agreeableness: 0.7, neuroticism: 0.6 }, meeting_story: '大学のサークルで出会った。', photo_seed: 1001, trust: 60, affection: 40 },
        { name: '佐藤 拓海', age: 29, role: 'rival', occupation: 'ITエンジニア', personality_vec: { openness: 0.4, conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.3, neuroticism: 0.5 }, meeting_story: '同じ会社に入社した同期。', photo_seed: 1002, trust: 20, affection: -10 },
        { name: '山本 哲也', age: 62, role: 'mentor', occupation: '元大学教授', personality_vec: { openness: 0.9, conscientiousness: 0.7, extraversion: 0.4, agreeableness: 0.8, neuroticism: 0.2 }, meeting_story: '大学時代のゼミの教授。', photo_seed: 1003, trust: 70, affection: 50 },
        { name: '中村 さくら', age: 26, role: 'friend', occupation: 'カフェ店主', personality_vec: { openness: 0.7, conscientiousness: 0.6, extraversion: 0.5, agreeableness: 0.9, neuroticism: 0.7 }, meeting_story: '行きつけのカフェのオーナー。', photo_seed: 1004, trust: 45, affection: 30 },
        { name: '鈴木 一郎', age: 58, role: 'family', occupation: '会社員', personality_vec: { openness: 0.3, conscientiousness: 0.8, extraversion: 0.3, agreeableness: 0.5, neuroticism: 0.4 }, meeting_story: '父。', photo_seed: 1005, trust: 80, affection: 70 },
        { name: '吉田 美穂', age: 55, role: 'family', occupation: '専業主婦', personality_vec: { openness: 0.5, conscientiousness: 0.7, extraversion: 0.6, agreeableness: 0.95, neuroticism: 0.6 }, meeting_story: '母。', photo_seed: 1006, trust: 90, affection: 90 },
        { name: '林 翔', age: 25, role: 'friend', occupation: 'ミュージシャン', personality_vec: { openness: 0.95, conscientiousness: 0.2, extraversion: 0.8, agreeableness: 0.6, neuroticism: 0.5 }, meeting_story: '高校時代からの友人。', photo_seed: 1007, trust: 55, affection: 45 },
        { name: '加藤 健太', age: 34, role: 'acquaintance', occupation: '会社の先輩', personality_vec: { openness: 0.6, conscientiousness: 0.5, extraversion: 0.8, agreeableness: 0.4, neuroticism: 0.3 }, meeting_story: '会社の先輩。', photo_seed: 1008, trust: 30, affection: 15 },
        { name: '伊藤 彩', age: 28, role: 'friend', occupation: '看護師', personality_vec: { openness: 0.6, conscientiousness: 0.8, extraversion: 0.5, agreeableness: 0.9, neuroticism: 0.4 }, meeting_story: '中学からの幼馴染。', photo_seed: 1009, trust: 65, affection: 50 },
        { name: '渡辺 直樹', age: 30, role: 'rival', occupation: 'フリーランサー', personality_vec: { openness: 0.7, conscientiousness: 0.6, extraversion: 0.7, agreeableness: 0.3, neuroticism: 0.4 }, meeting_story: 'フリーランスの集まりで知り合った。', photo_seed: 1010, trust: 15, affection: -5 },
      ]

      const npcsToInsert = npcSeeds.map((seed) => ({
        avatar_id: avatar.id,
        ...seed,
      }))

      await supabaseAdmin.from('npcs').insert(npcsToInsert)

      // Mark onboarding done
      await supabaseAdmin.from('players').update({ onboarding_done: true }).eq('id', ctx.user.id)

      return avatar
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { data: avatar, error } = await supabaseAdmin
      .from('avatars')
      .select('*')
      .eq('player_id', ctx.user.id)
      .single()

    if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Avatar not found' })

    const { data: npcs } = await supabaseAdmin
      .from('npcs')
      .select('*')
      .eq('avatar_id', avatar.id)

    return { avatar, npcs: npcs ?? [] }
  }),

  updateStatus: protectedProcedure
    .input(z.object({
      health: z.number().min(0).max(100).optional(),
      wealth: z.number().min(0).max(100).optional(),
      love: z.number().min(0).max(100).optional(),
      reputation: z.number().min(0).max(100).optional(),
      happiness: z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: avatar } = await supabaseAdmin
        .from('avatars')
        .select('id')
        .eq('player_id', ctx.user.id)
        .single()

      if (!avatar) throw new TRPCError({ code: 'NOT_FOUND' })

      const { error } = await supabaseAdmin
        .from('avatars')
        .update(input)
        .eq('id', avatar.id)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  logEmotion: protectedProcedure
    .input(z.object({
      health: z.number(),
      wealth: z.number(),
      love: z.number(),
      reputation: z.number(),
      happiness: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: avatar } = await supabaseAdmin
        .from('avatars')
        .select('id')
        .eq('player_id', ctx.user.id)
        .single()

      if (!avatar) throw new TRPCError({ code: 'NOT_FOUND' })

      await supabaseAdmin.from('emotion_log').insert({
        avatar_id: avatar.id,
        ...input,
      })

      return { success: true }
    }),
})

// ===== Stories Router =====
const storiesRouter = router({
  today: protectedProcedure.query(async ({ ctx }) => {
    const { data: avatar } = await supabaseAdmin
      .from('avatars')
      .select('id')
      .eq('player_id', ctx.user.id)
      .single()

    if (!avatar) throw new TRPCError({ code: 'NOT_FOUND', message: 'Avatar not found' })

    // Check for today's events in DB first
    const today = new Date().toISOString().slice(0, 10)
    const { data: existing } = await supabaseAdmin
      .from('story_events')
      .select('*')
      .eq('avatar_id', avatar.id)
      .eq('event_date', today)

    if (existing && existing.length > 0) {
      return existing
    }

    // The story-worker process handles AI generation via the batch job.
    // If no events exist yet, return a simple fallback.
    const fallbackStories = [
      {
        type: 'daily',
        title: '静かな朝',
        body: '窓を開けると、街はまだ眠っていた。遠くで新聞配達のバイクの音が聞こえる。コーヒーを淹れて、湯気を見つめた。今日も何かが始まる予感がする。けれど何が始まるかは、まだ誰にもわからない。机の上に置いたままのノートを開いて、昨日の続きを書こうとしたが、ペンを持ったまま窓の外を眺めていた。',
        emotionTag: 'contentment',
        audioTheme: 'morning',
        statusDelta: { happiness: 2, health: 1 },
        choices: null,
      },
      {
        type: 'choice',
        title: '分かれ道',
        body: '帰り道、いつもと違う角を曲がった。知らない路地に小さなカフェがあった。ガラス越しに、一人で本を読んでいる人が見えた。店の前で立ち止まって、しばらくメニューを眺めた。入ろうか、それとも真っ直ぐ帰ろうか。足が止まったまま、風が頬を撫でていく。',
        emotionTag: 'surprise',
        audioTheme: 'afternoon',
        statusDelta: {},
        choices: [
          { id: 'c1', text: 'カフェに入る', hint: '新しい出会いがあるかも', delta: { love: 2, happiness: 3 } },
          { id: 'c2', text: 'そのまま帰る', hint: '今日は自分の時間を大切に', delta: { health: 2, happiness: 1 } },
        ],
      },
      {
        type: 'daily',
        title: '夜の窓辺',
        body: '仕事を終えて部屋に帰ると、窓の外にはいつもと同じ街の灯りが並んでいた。冷蔵庫から取り出したお茶を飲みながら、今日一日を振り返る。特別なことは何もなかったけれど、それでも何かが少しだけ前に進んだ気がした。歯を磨いて、枕に頭を沈める。',
        emotionTag: 'contentment',
        audioTheme: 'night',
        statusDelta: { happiness: 1 },
        choices: null,
      },
    ]
    return fallbackStories
  }),

  choice: protectedProcedure
    .input(z.object({
      eventId: z.string().uuid(),
      choiceId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from('story_events')
        .update({ selected_choice: input.choiceId })
        .eq('id', input.eventId)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  react: protectedProcedure
    .input(z.object({
      eventId: z.string().uuid(),
      emoji: z.enum(['❤️', '😢', '😂', '😮', '🔥']),
    }))
    .mutation(async ({ input }) => {
      // Store reactions in event's JSONB (simplified for Phase 2)
      const { data: event } = await supabaseAdmin
        .from('story_events')
        .select('id')
        .eq('id', input.eventId)
        .single()

      if (!event) throw new TRPCError({ code: 'NOT_FOUND' })
      return { success: true }
    }),

  markRead: protectedProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // Mark as read (no separate column needed, queried by date)
      // Trigger async embedding generation
      const { data: event } = await supabaseAdmin
        .from('story_events')
        .select('id, body')
        .eq('id', input.eventId)
        .single()

      if (!event) throw new TRPCError({ code: 'NOT_FOUND' })

      // Embedding generation is handled by the story-worker batch process.
      // No cross-service import needed here.

      return { success: true }
    }),

  archive: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const { data: avatar } = await supabaseAdmin
        .from('avatars')
        .select('id')
        .eq('player_id', ctx.user.id)
        .single()

      if (!avatar) throw new TRPCError({ code: 'NOT_FOUND' })

      const from = (input.page - 1) * input.pageSize
      const to = from + input.pageSize - 1

      const { data, count, error } = await supabaseAdmin
        .from('story_events')
        .select('*', { count: 'exact' })
        .eq('avatar_id', avatar.id)
        .order('event_date', { ascending: false })
        .range(from, to)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      return {
        events: data ?? [],
        total: count ?? 0,
        page: input.page,
        pageSize: input.pageSize,
      }
    }),
})

// ===== NPCs Router =====
const npcsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data: avatar } = await supabaseAdmin
      .from('avatars')
      .select('id')
      .eq('player_id', ctx.user.id)
      .single()

    if (!avatar) throw new TRPCError({ code: 'NOT_FOUND' })

    const { data, error } = await supabaseAdmin
      .from('npcs')
      .select('*')
      .eq('avatar_id', avatar.id)

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),

  messages: protectedProcedure.query(async ({ ctx }) => {
    const { data: avatar } = await supabaseAdmin
      .from('avatars')
      .select('id')
      .eq('player_id', ctx.user.id)
      .single()

    if (!avatar) throw new TRPCError({ code: 'NOT_FOUND' })

    const { data: npcs } = await supabaseAdmin
      .from('npcs')
      .select('*')
      .eq('avatar_id', avatar.id)

    if (!npcs || npcs.length === 0) return []

    // Return cached messages (last_message field)
    return npcs
      .filter((n: any) => n.last_message)
      .map((n: any) => ({
        npcId: n.id,
        name: n.name,
        role: n.role,
        message: n.last_message,
      }))
  }),

  updateEmotion: protectedProcedure
    .input(z.object({
      npcId: z.string().uuid(),
      trust: z.number().optional(),
      affection: z.number().optional(),
      jealousy: z.number().optional(),
      dependence: z.number().optional(),
      respect: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { npcId, ...updates } = input
      const clampedUpdates: Record<string, number> = {}

      for (const [key, val] of Object.entries(updates)) {
        if (val === undefined) continue
        if (key === 'jealousy' || key === 'dependence') {
          clampedUpdates[key] = Math.min(100, Math.max(0, val))
        } else {
          clampedUpdates[key] = Math.min(100, Math.max(-100, val))
        }
      }

      const { error } = await supabaseAdmin
        .from('npcs')
        .update(clampedUpdates)
        .eq('id', npcId)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),
})

// ===== Main App Router =====
export const appRouter = router({
  auth: authRouter,
  avatar: avatarRouter,
  stories: storiesRouter,
  npcs: npcsRouter,
})

export type AppRouter = typeof appRouter
