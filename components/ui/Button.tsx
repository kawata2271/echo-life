import React from 'react'
import { Pressable, StyleSheet, ViewStyle } from 'react-native'
import { hapticSelection } from '../../lib/platform'
import { Typography } from './Typography'
import { TOKENS } from '../../constants/tokens'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props {
  title: string
  variant?: Variant
  onPress: () => void
  disabled?: boolean
  style?: ViewStyle
}

export function Button({ title, variant = 'primary', onPress, disabled, style }: Props) {
  const handlePress = () => {
    hapticSelection()
    onPress()
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      role="button"
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        { cursor: 'pointer' as any },
        style,
      ]}
    >
      <Typography
        variant="bodyMed"
        color={variant === 'primary' ? TOKENS.color.bgPrimary : variant === 'secondary' ? TOKENS.color.textPrimary : TOKENS.color.textMuted}
      >
        {title}
      </Typography>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: TOKENS.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
})

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: TOKENS.color.amber,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: TOKENS.color.amber,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: TOKENS.color.border,
  },
}
