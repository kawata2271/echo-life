# ECHO LIFE — Data Models

## 型定義

### Player
ユーザーアカウント情報。設定・サブスクリプション・オンボーディング状態を管理。

### Avatar（分身）
プレイヤーの「もう一つの人生」の主人公。名前・年齢・職業・夢・外見・5つのステータス・Big Five性格特性を持つ。

### AvatarStatus
5軸ステータス（0-100）:
- **health**: 健康
- **wealth**: 資産
- **love**: 愛情
- **reputation**: 評判
- **happiness**: 幸福度

### StoryEvent
毎日届くストーリーカード。タイプ・感情タグ・オーディオテーマ・ステータス変動・選択肢を含む。

### NPC
分身の人間関係。5つの感情状態（trust/affection/jealousy/dependence/respect）を持ち、閾値に基づいて関係性が変化する。

## ストア設計

### playerStore
- MMKV永続化
- プレイヤー作成・設定更新・オンボーディング完了

### avatarStore
- MMKV永続化
- 分身作成・ステータスデルタ適用・年齢増加

### storyStore
- MMKV永続化
- 今日のイベント取得（幸福度ベースの選択ロジック）
- カード消化・選択・リアクション・アーカイブ

### npcStore
- MMKV永続化
- NPC初期化・感情更新・関係性変化判定
