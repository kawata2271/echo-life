import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { TOKENS } from '../../constants/tokens'

interface Props {
  children: React.ReactNode
  style?: ViewStyle
  delay?: number
}

export function AnimatedCard({ children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: TOKENS.color.bgCard,
    borderRadius: TOKENS.radius.sm,
    borderWidth: 1,
    borderColor: TOKENS.color.border,
    ...TOKENS.shadow.card,
  },
})
