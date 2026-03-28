import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { TOKENS } from '../../constants/tokens'

interface Props {
  children: React.ReactNode
  style?: ViewStyle
  delay?: number
}

export function AnimatedCard({ children, style, delay = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600).springify()}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
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
