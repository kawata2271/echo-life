import type { StoryContext } from '../rag/contextBuilder.js'

export function buildDailyStoryPrompt(ctx: StoryContext): { system: string; user: string } {
  const { avatar, recentEvents, similarEvents, npcs, weather, season, dayOfWeek } = ctx

  const system = `あなたは10年間この人物を観察してきた直木賞作家です。
川上未映子と重松清を融合したスタイルで書いてください。
ルール:
- 直接的な感情表現（「嬉しかった」「悲しかった」）を避け、行動・情景・会話で感情を描写する
- 各イベントは150〜350文字の日本語
- タイトルは15文字以内
- JSON形式のみ出力。前後の説明文は不要
- 必ず2〜5本のイベントを生成し、最低1本はchoice型にする
- choice型は2択で、各選択肢は30文字以内、hintは60文字以内
- statusDeltaの各値は-5〜+5の範囲`

  const recentSummary = recentEvents
    .slice(0, 7)
    .map((e, i) => `${i + 1}. [${e.event_date}] ${e.title} — ${e.body.slice(0, 60)}`)
    .join('\n')

  const npcSummary = npcs
    .map((n) => `- ${n.name}(${n.role}): trust=${n.trust}, affection=${n.affection}, mood=${n.mood}`)
    .join('\n')

  const similarTitles = similarEvents
    .map((e) => e.title)
    .join('、')

  const user = `## 分身情報
名前: ${avatar.name}
年齢: ${avatar.age}歳
居住地: ${avatar.current_city}
職業: ${avatar.occupation}
夢: ${avatar.dream}
人生テーマ: ${avatar.life_theme}

## 今日
日付: ${new Date().toISOString().slice(0, 10)}
曜日: ${dayOfWeek}
季節: ${season}
天気: ${weather.description}

## 現在ステータス
健康: ${avatar.health}/100
資産: ${avatar.wealth}/100
愛情: ${avatar.love}/100
評判: ${avatar.reputation}/100
幸福度: ${avatar.happiness}/100

## 直近のイベント
${recentSummary || 'なし（初日）'}

## 人間関係
${npcSummary || 'なし'}

## 類似する過去のイベント（繰り返しを避けてください）
${similarTitles || 'なし'}

## 生成ルール
- 朝の場面から始めること
- 最後は夜の場面、または気づき・余韻で終わること
- 必ず1本以上はchoice型にすること
- 天気（${weather.description}）を自然に溶け込ませること
- 過去のイベントとの連続性を意識すること

## 出力形式
以下のJSON形式のみ出力してください:
{
  "events": [
    {
      "type": "daily" | "choice" | "emotional" | "turning_point" | "flashback",
      "title": "15文字以内",
      "body": "150〜350文字",
      "emotionTag": "joy" | "sadness" | "anger" | "surprise" | "fear" | "nostalgia" | "hope" | "melancholy" | "contentment",
      "audioTheme": "morning" | "afternoon" | "evening" | "night" | "rain" | "celebration" | "melancholy" | "tense",
      "statusDelta": { "health": 0, "wealth": 0, "love": 0, "reputation": 0, "happiness": 0 },
      "choices": null | [{ "id": "c1", "text": "30文字以内", "hint": "60文字以内", "delta": {...} }]
    }
  ]
}`

  return { system, user }
}
