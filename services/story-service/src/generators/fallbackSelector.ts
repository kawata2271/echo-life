import pino from 'pino'

const logger = pino({ name: 'fallback-selector' })

// Static story type matching Phase 1
interface StaticStory {
  type: string
  title: string
  body: string
  emotionTag: string
  audioTheme: string
  statusDelta: Record<string, number>
  choices: unknown[] | null
}

// Inline fallback stories (static stories from Phase 1 are in the mobile app)
const cachedStories: StaticStory[] | null = null

function getInlineFallback(): StaticStory[] {
  return [
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
}

interface AvatarLike {
  happiness?: number
  [key: string]: unknown
}

export function selectFallbackStories(avatar: AvatarLike | null): StaticStory[] {
  // Synchronous version using cached or inline stories
  const stories = cachedStories ?? getInlineFallback()
  const happiness = avatar?.happiness ?? 50

  const positiveEmotions = ['joy', 'hope', 'contentment']
  const negativeEmotions = ['sadness', 'melancholy', 'nostalgia']
  const isWeekend = [0, 6].includes(new Date().getDay())

  const weighted = stories.map((story) => {
    let weight = 1
    if (happiness > 65 && positiveEmotions.includes(story.emotionTag)) weight += 2
    else if (happiness < 35 && negativeEmotions.includes(story.emotionTag)) weight += 2
    if (isWeekend && story.type === 'choice') weight *= 2
    return { story, weight }
  })

  const count = 3 + Math.floor(Math.random() * 3)
  const selected: StaticStory[] = []
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

  return selected
}

