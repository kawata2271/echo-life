import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'
import type { AvatarStatus } from '../../types'

const STATUS_CONFIG: { key: keyof AvatarStatus; label: string; color: string }[] = [
  { key: 'happiness', label: '幸福度', color: TOKENS.color.amber },
  { key: 'health', label: '健康', color: TOKENS.color.sage },
  { key: 'love', label: '愛情', color: TOKENS.color.terra },
  { key: 'wealth', label: '資産', color: TOKENS.color.sepia },
  { key: 'reputation', label: '評判', color: '#8080c0' },
]

interface Props {
  status: AvatarStatus
}

function StatusBar({ label, value, color }: { label: string; value: number; color: string }) {
  const width = useSharedValue(0)

  useEffect(() => {
    width.value = withSpring(value, { damping: 15, stiffness: 90 })
  }, [value])

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }))

  return (
    <View style={styles.row}>
      <Typography variant="mono" style={styles.label}>{label}</Typography>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, { backgroundColor: color }, animatedStyle]} />
      </View>
      <Typography variant="mono" style={styles.value}>{value}</Typography>
    </View>
  )
}

export function StatusMeter({ status }: Props) {
  return (
    <View style={styles.container}>
      {STATUS_CONFIG.map((cfg) => (
        <StatusBar
          key={cfg.key}
          label={cfg.label}
          value={status[cfg.key]}
          color={cfg.color}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: TOKENS.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TOKENS.spacing.sm,
  },
  label: {
    width: 50,
    fontSize: 11,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: TOKENS.color.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    width: 28,
    textAlign: 'right',
    fontSize: 11,
  },
})
