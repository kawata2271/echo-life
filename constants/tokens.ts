export const TOKENS = {
  color: {
    // 背景
    bgPrimary:   '#0f0d0b',
    bgCard:      '#1a1510',
    bgElevated:  '#231e18',
    bgPanel:     '#161210',

    // テキスト
    textPrimary:   '#f0e8d8',
    textSecondary: '#a89880',
    textMuted:     '#6a5a4a',

    // アクセント
    amber:  '#d4820a',
    terra:  '#b84a2c',
    sage:   '#5a7a5e',
    sageLow: '#3a5a3e',
    sepia:  '#c9aa85',

    // ボーダー
    border:       '#2a2018',
    borderSubtle: '#1e1810',

    // 感情タグ別カラー
    emotion: {
      joy:         '#f0c040',
      sadness:     '#4080c0',
      anger:       '#c04040',
      surprise:    '#c080c0',
      fear:        '#806040',
      nostalgia:   '#c09060',
      hope:        '#40c080',
      melancholy:  '#6080a0',
      contentment: '#80a060',
    },
  },

  font: {
    display:  'CormorantGaramond_300Light_Italic',
    heading:  'CormorantGaramond_600SemiBold',
    body:     'DMSans_300Light',
    bodyMed:  'DMSans_400Regular',
    mono:     'DMMono_400Regular',
    jp:       'NotoSansJP_300Light',
    jpMed:    'NotoSansJP_400Regular',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 16,
  },

  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 12,
    },
  },
} as const
