import React from 'react'
import { View, type ViewStyle } from 'react-native'
import { isWeb } from '../../lib/platform'

interface Props {
  colors: string[]
  style?: ViewStyle
  children?: React.ReactNode
}

let NativeLinearGradient: React.ComponentType<any> | null = null

if (!isWeb) {
  try {
    NativeLinearGradient = require('expo-linear-gradient').LinearGradient
  } catch {
    // Fallback below
  }
}

export function GradientView({ colors, style, children }: Props) {
  if (isWeb || !NativeLinearGradient) {
    // CSS linear-gradient fallback for web
    return (
      <View
        style={[
          style,
          {
            // @ts-expect-error web-only CSS property
            backgroundImage: `linear-gradient(to bottom, ${colors.join(', ')})`,
          },
        ]}
      >
        {children}
      </View>
    )
  }

  return (
    <NativeLinearGradient colors={colors} style={style}>
      {children}
    </NativeLinearGradient>
  )
}
