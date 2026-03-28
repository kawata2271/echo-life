interface NPCData {
  name: string
  role: string
  occupation: string
  personality_vec: Record<string, number>
  trust: number
  affection: number
  mood: string
}

interface AvatarData {
  name: string
  age: number
  occupation: string
}

interface RecentEvent {
  title: string
  body: string
  emotion_tag: string
}

export function buildNPCMessagePrompt(
  npc: NPCData,
  avatar: AvatarData,
  recentEvents: RecentEvent[]
): { system: string; user: string } {
  const system = `あなたは「${npc.name}」という人物です。
役割: ${npc.role}
職業: ${npc.occupation}
性格: 外向性=${npc.personality_vec.extraversion ?? 0.5}, 協調性=${npc.personality_vec.agreeableness ?? 0.5}
現在の気分: ${npc.mood}
信頼度: ${npc.trust}/100, 好感度: ${npc.affection}/100

以下のルールに従ってください:
- ${avatar.name}への今日の一言を50〜80文字で生成する
- 感情状態に合った口調で話す（信頼度が低ければ距離を置いた言い方、高ければ親しみを込めて）
- JSONは不要。メッセージ本文のみ出力する`

  const eventContext = recentEvents
    .slice(0, 3)
    .map((e) => `- ${e.title}: ${e.body.slice(0, 40)}`)
    .join('\n')

  const user = `${avatar.name}（${avatar.age}歳、${avatar.occupation}）への一言。

最近の出来事:
${eventContext || '特になし'}

メッセージを出力してください（50〜80文字）:`

  return { system, user }
}
