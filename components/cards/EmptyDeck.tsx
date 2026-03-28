import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'

export function EmptyDeck() {
  return (
    <View style={styles.container}>
      <Typography variant="heading" style={styles.title}>
        今日の物語は以上です
      </Typography>
      <Typography variant="jp" color={TOKENS.color.textMuted} style={styles.subtitle}>
        また明日、新しい物語が届きます
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: TOKENS.spacing.xl,
  },
  title: {
    marginBottom: TOKENS.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
})
