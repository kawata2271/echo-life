import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Typography } from '../ui/Typography'
import { EmotionReaction } from '../ui/EmotionReaction'
import { TOKENS } from '../../constants/tokens'
import { emotionToEmoji, emotionToColor } from '../../lib/emotions'
import { formatEventDate } from '../../lib/dateUtils'
import type { StoryEvent, EventReaction } from '../../types/events'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.9

interface Props {
  event: StoryEvent
  onReaction?: (emoji: EventReaction['emoji']) => void
}

export function StoryCard({ event, onReaction }: Props) {
  const accentColor = emotionToColor(event.emotionTag)
  const emoji = emotionToEmoji(event.emotionTag)
  const selectedReactions = event.reactions.map((r) => r.emoji)

  return (
    <View style={styles.container}>
      <View style={[styles.accentLine, { backgroundColor: accentColor }]} />
      <LinearGradient
        colors={['#1a1510', '#1e1a14']}
        style={styles.gradient}
      >
        <Typography variant="heading" style={styles.title}>
          {event.title}
        </Typography>
        <Typography variant="jp" style={styles.body}>
          {event.body}
        </Typography>
        <View style={styles.footer}>
          <Typography style={styles.emoji}>{emoji}</Typography>
          {onReaction && (
            <EmotionReaction
              selected={selectedReactions}
              onToggle={(e) => onReaction(e as EventReaction['emoji'])}
            />
          )}
          <Typography variant="mono" color={TOKENS.color.textMuted}>
            {formatEventDate(new Date(event.eventDate))}
          </Typography>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: TOKENS.radius.sm,
    borderWidth: 1,
    borderColor: TOKENS.color.border,
    overflow: 'hidden',
    ...TOKENS.shadow.card,
  },
  accentLine: {
    height: 2,
    width: '100%',
  },
  gradient: {
    padding: TOKENS.spacing.lg,
    minHeight: 300,
  },
  title: {
    marginBottom: TOKENS.spacing.md,
  },
  body: {
    flex: 1,
    marginBottom: TOKENS.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
})
