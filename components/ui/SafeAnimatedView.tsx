import React from 'react'
import { View, type ViewStyle } from 'react-native'
import { isWeb } from '../../lib/platform'

interface Props {
  style?: ViewStyle | ViewStyle[]
  children: React.ReactNode
}

/**
 * On web, Reanimated's `entering` animations cause elements to stay
 * visibility:hidden in static/SSR output. This component renders a
 * plain View on web and Animated.View with entering on native.
 */
export function SafeAnimatedView({ style, children }: Props) {
  if (isWeb) {
    return <View style={style}>{children}</View>
  }

  // Dynamic import to avoid bundling Reanimated on web
  const Animated = require('react-native-reanimated').default
  const { FadeIn } = require('react-native-reanimated')

  return (
    <Animated.View entering={FadeIn.duration(600)} style={style}>
      {children}
    </Animated.View>
  )
}
