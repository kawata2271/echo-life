# ECHO LIFE — Phase 1 実装計画

## 概要

AIが毎日「もう一つの人生」のストーリーを生成するライフシミュレーションアプリ。
Phase 1はAIなし・ローカルデータのみで完結するプロトタイプ。

## アーキテクチャ

```
┌─────────────────────────────────────────────┐
│                   App Layer                  │
│  ┌──────────────┐  ┌─────────────────────┐  │
│  │  Onboarding  │  │    Main Tabs        │  │
│  │  (5 screens) │  │  Feed│Avatar│Archive │  │
│  └──────┬───────┘  └──────────┬──────────┘  │
│         │                     │              │
│  ┌──────┴─────────────────────┴──────────┐  │
│  │           Custom Hooks                 │  │
│  │  useStories │ useAvatar │ useNPCs      │  │
│  └──────────────────┬────────────────────┘  │
│                     │                        │
│  ┌──────────────────┴────────────────────┐  │
│  │         Zustand Stores                 │  │
│  │  playerStore│avatarStore│storyStore    │  │
│  │                  │npcStore             │  │
│  └──────────────────┬────────────────────┘  │
│                     │                        │
│  ┌──────────────────┴────────────────────┐  │
│  │         Persistence (MMKV)             │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## コンポーネント依存関係

```
CardStack
├── StoryCard
│   ├── Typography
│   ├── EmotionReaction
│   └── AnimatedCard
├── ChoiceCard (extends StoryCard)
│   └── Button
└── EmptyDeck
    └── Typography

AvatarScreen
├── AvatarFace
├── StatusMeter
├── EmotionGraph (Skia)
└── NPCListItem
```

## データフロー

```
staticStories.ts ──► storyStore.fetchTodayEvents()
                         │
                         ▼
                    CardStack (today's events)
                         │
                    ┌────┴────┐
                    ▼         ▼
              StoryCard   ChoiceCard
                 │            │
                 ▼            ▼
           markEventRead  makeChoice()
                 │            │
                 ▼            ▼
            Archive      avatarStore.applyDelta()
                              │
                              ▼
                         StatusMeter / EmotionGraph
```

## 実装順序

1. プロジェクト初期化 & 依存関係インストール
2. 型定義 (types/)
3. デザイントークン (constants/)
4. ストレージ・ユーティリティ (lib/)
5. ストア (stores/)
6. 静的データ (data/)
7. UIコンポーネント (components/)
8. 画面実装 (app/)
9. テスト (__tests__/)
10. ドキュメント (docs/)

## 技術スタック

- **Framework**: Expo (React Native) + TypeScript
- **Navigation**: expo-router (file-based)
- **State**: Zustand + immer
- **Persistence**: react-native-mmkv
- **Animation**: react-native-reanimated 3
- **Graphics**: @shopify/react-native-skia
- **Haptics**: expo-haptics
