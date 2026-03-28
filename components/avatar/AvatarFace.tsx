import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'
import type { AvatarAppearance } from '../../types'

const SKIN_COLORS = ['#FDEBD0', '#F5CBA7', '#E0AC69', '#C68642', '#8D5524', '#5C3317']

interface Props {
  appearance: AvatarAppearance
  size?: number
}

export function AvatarFace({ appearance, size = 80 }: Props) {
  const skinColor = SKIN_COLORS[appearance.skinTone - 1] ?? SKIN_COLORS[0]

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: skinColor }]}>
      <Typography style={{ fontSize: size * 0.4 }}>
        {appearance.gender === 'f' ? '👩' : appearance.gender === 'nb' ? '🧑' : '👨'}
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TOKENS.color.border,
  },
  face: {},
})
