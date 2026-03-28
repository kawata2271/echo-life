interface AvatarData {
  name: string
  age: number
  occupation: string
  life_theme: string
}

interface EventData {
  event_date: string
  title: string
  body: string
  emotion_tag: string
}

export function buildWeeklySummaryPrompt(
  avatar: AvatarData,
  events: EventData[]
): { system: string; user: string } {
  const system = `あなたは人生の記録係です。この1週間の出来事を100文字で要約してください。
ルール:
- 分身の変化・成長・変化した人間関係を含める
- 詩的かつ簡潔に
- 本文のみ出力（JSONや説明文は不要）`

  const eventList = events
    .map((e) => `[${e.event_date}] ${e.title}\n${e.body}`)
    .join('\n\n')

  const user = `## 分身
${avatar.name}（${avatar.age}歳、${avatar.occupation}、テーマ: ${avatar.life_theme}）

## 今週のイベント
${eventList}

100文字で要約してください:`

  return { system, user }
}
