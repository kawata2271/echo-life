import React from 'react'
import { Text, TextStyle, StyleSheet } from 'react-native'
import { TOKENS } from '../../constants/tokens'

type Variant = 'display' | 'heading' | 'body' | 'bodyMed' | 'mono' | 'jp' | 'jpMed'

interface Props {
  variant?: Variant
  color?: string
  style?: TextStyle
  children: React.ReactNode
  numberOfLines?: number
}

export function Typography({ variant = 'body', color, style, children, numberOfLines }: Props) {
  return (
    <Text
      style={[
        styles.base,
        variantStyles[variant],
        color ? { color } : undefined,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  base: {
    color: TOKENS.color.textPrimary,
  },
})

const variantStyles: Record<Variant, TextStyle> = {
  display: { fontFamily: TOKENS.font.display, fontSize: 72, letterSpacing: 2 },
  heading: { fontFamily: TOKENS.font.heading, fontSize: 24 },
  body: { fontFamily: TOKENS.font.jp, fontSize: 15, lineHeight: 24 },
  bodyMed: { fontFamily: TOKENS.font.jpMed, fontSize: 15, lineHeight: 24 },
  mono: { fontFamily: TOKENS.font.mono, fontSize: 12 },
  jp: { fontFamily: TOKENS.font.jp, fontSize: 15, lineHeight: 24 },
  jpMed: { fontFamily: TOKENS.font.jpMed, fontSize: 15, lineHeight: 24 },
}
