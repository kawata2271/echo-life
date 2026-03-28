import { createClient } from '@supabase/supabase-js'
import pino from 'pino'
import { embedText } from './embeddings.js'
import { getCurrentWeather, type WeatherInfo } from '../external/weatherApi.js'

const logger = pino({ name: 'context-builder' })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface StoryContext {
  avatar: any
  recentEvents: any[]
  similarEvents: any[]
  npcs: any[]
  weather: WeatherInfo
  season: string
  dayOfWeek: string
  playerTimezone: string
}

function getSeason(): string {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return '春'
  if (month >= 6 && month <= 8) return '夏'
  if (month >= 9 && month <= 11) return '秋'
  return '冬'
}

const DAY_NAMES = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']

export async function buildStoryContext(avatarId: string): Promise<StoryContext> {
  // Parallel fetch
  const [avatarRes, eventsRes, npcsRes] = await Promise.all([
    supabase.from('avatars').select('*').eq('id', avatarId).single(),
    supabase
      .from('story_events')
      .select('*')
      .eq('avatar_id', avatarId)
      .order('event_date', { ascending: false })
      .limit(14),
    supabase.from('npcs').select('*').eq('avatar_id', avatarId),
  ])

  if (avatarRes.error) throw new Error(`Avatar fetch failed: ${avatarRes.error.message}`)

  const avatar = avatarRes.data
  const recentEvents = eventsRes.data ?? []
  const npcs = npcsRes.data ?? []

  // Weather
  const weather = await getCurrentWeather(avatar.current_city)

  // RAG: embed recent event titles for similarity search
  let similarEvents: any[] = []
  try {
    const queryText = recentEvents
      .slice(0, 3)
      .map((e: any) => e.title)
      .join(' ')

    if (queryText.trim()) {
      const queryVector = await embedText(queryText)
      if (queryVector) {
        const { data } = await supabase.rpc('match_story_events', {
          p_avatar_id: avatarId,
          p_query_embedding: queryVector,
          p_match_threshold: 0.7,
          p_match_count: 5,
        })
        similarEvents = data ?? []
      }
    }
  } catch (err) {
    logger.warn({ err }, 'RAG similarity search failed, continuing without it')
  }

  return {
    avatar,
    recentEvents,
    similarEvents,
    npcs,
    weather,
    season: getSeason(),
    dayOfWeek: DAY_NAMES[new Date().getDay()],
    playerTimezone: 'Asia/Tokyo',
  }
}
