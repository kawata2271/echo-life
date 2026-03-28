import { z } from 'zod'

export const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string().max(30),
  hint: z.string().max(60),
  delta: z.object({
    health: z.number().min(-10).max(10).optional(),
    wealth: z.number().min(-10).max(10).optional(),
    love: z.number().min(-10).max(10).optional(),
    reputation: z.number().min(-10).max(10).optional(),
    happiness: z.number().min(-10).max(10).optional(),
  }),
})

export const StoryEventAISchema = z.object({
  type: z.enum(['daily', 'choice', 'emotional', 'turning_point', 'flashback']),
  title: z.string().min(1).max(15),
  body: z.string().min(100).max(400),
  emotionTag: z.enum(['joy', 'sadness', 'anger', 'surprise', 'fear', 'nostalgia', 'hope', 'melancholy', 'contentment']),
  audioTheme: z.enum(['morning', 'afternoon', 'evening', 'night', 'rain', 'celebration', 'melancholy', 'tense']),
  statusDelta: z.object({
    health: z.number().optional(),
    wealth: z.number().optional(),
    love: z.number().optional(),
    reputation: z.number().optional(),
    happiness: z.number().optional(),
  }),
  choices: z.array(ChoiceSchema).nullable(),
})

export const AIResponseSchema = z.object({
  events: z.array(StoryEventAISchema).min(2).max(5),
})
