# ECHO LIFE — Design System

## カラートークン

### 背景
| Token | Hex | 用途 |
|-------|-----|------|
| bgPrimary | `#0f0d0b` | メイン背景 |
| bgCard | `#1a1510` | カード背景 |
| bgElevated | `#231e18` | 浮き上がったUI |
| bgPanel | `#161210` | タブバー等 |

### テキスト
| Token | Hex | 用途 |
|-------|-----|------|
| textPrimary | `#f0e8d8` | メインテキスト |
| textSecondary | `#a89880` | サブテキスト |
| textMuted | `#6a5a4a` | 無効/補助テキスト |

### アクセント
| Token | Hex | 用途 |
|-------|-----|------|
| amber | `#d4820a` | プライマリアクセント |
| terra | `#b84a2c` | 警告/愛情 |
| sage | `#5a7a5e` | 健康/ポジティブ |
| sepia | `#c9aa85` | 資産 |

### 感情カラー
| Emotion | Hex |
|---------|-----|
| joy | `#f0c040` |
| sadness | `#4080c0` |
| anger | `#c04040` |
| surprise | `#c080c0` |
| fear | `#806040` |
| nostalgia | `#c09060` |
| hope | `#40c080` |
| melancholy | `#6080a0` |
| contentment | `#80a060` |

## タイポグラフィ

| Variant | Font | Size | 用途 |
|---------|------|------|------|
| display | CormorantGaramond Light Italic | 72px | タイトルロゴ |
| heading | CormorantGaramond SemiBold | 24px | 見出し |
| body | NotoSansJP Light | 15px | 本文（日本語） |
| bodyMed | NotoSansJP Regular | 15px | 強調本文 |
| mono | DM Mono Regular | 12px | 日付・数値 |

## コンポーネント一覧

### Button
- `primary`: amber背景、dark文字
- `secondary`: 透明背景、amber枠、primary文字
- `ghost`: 透明背景、border枠、muted文字

### StoryCard
- グラデーション背景
- 上部2pxの感情カラーライン
- 革装丁風 borderRadius: 4

### ChoiceCard
- StoryCard拡張
- 下部に選択肢ボタン（縦並び）

### StatusMeter
- 5ステータスバー（アニメーション付き）

### EmotionGraph
- Skia Canvas描画
- Catmull-Rom補間曲線
