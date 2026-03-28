import React, { useState } from 'react'
import { View, Pressable, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'
import { emotionToEmoji, emotionToColor } from '../../lib/emotions'
import { formatEventDate } from '../../lib/dateUtils'
import type { StoryEvent, Choice } from '../../types/events'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.9

interface Props {
  event: StoryEvent
  onChoiceSelect: (choiceId: string) => void
}

export function ChoiceCard({ event, onChoiceSelect }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const accentColor = emotionToColor(event.emotionTag)
  const emoji = emotionToEmoji(event.emotionTag)

  const handleChoice = (choice: Choice) => {
    if (selectedId) return
    setSelectedId(choice.id)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setTimeout(() => {
      onChoiceSelect(choice.id)
    }, 500)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.accentLine, { backgroundColor: accentColor }]} />
      <LinearGradient colors={['#1a1510', '#1e1a14']} style={styles.gradient}>
        <Typography variant="heading" style={styles.title}>
          {event.title}
        </Typography>
        <Typography variant="jp" style={styles.body}>
          {event.body}
        </Typography>
        {event.choices && (
          <View style={styles.choices}>
            {event.choices.map((choice) => (
              <Pressable
                key={choice.id}
                onPress={() => handleChoice(choice)}
                style={[
                  styles.choiceButton,
                  selectedId === choice.id && styles.choiceSelected,
                ]}
              >
                <Typography
                  variant="jpMed"
                  color={selectedId === choice.id ? TOKENS.color.amber : TOKENS.color.textPrimary}
                >
                  {choice.text}
                </Typography>
                <Typography variant="mono" color={TOKENS.color.textMuted} style={styles.hint}>
                  {choice.hint}
                </Typography>
              </Pressable>
            ))}
          </View>
        )}
        <View style={styles.footer}>
          <Typography style={styles.emoji}>{emoji}</Typography>
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
  },
  title: {
    marginBottom: TOKENS.spacing.md,
  },
  body: {
    marginBottom: TOKENS.spacing.lg,
  },
  choices: {
    gap: TOKENS.spacing.sm,
    marginBottom: TOKENS.spacing.lg,
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: TOKENS.color.border,
    borderRadius: TOKENS.radius.sm,
    padding: 12,
  },
  choiceSelected: {
    borderColor: TOKENS.color.amber,
    backgroundColor: `${TOKENS.color.amber}1A`,
  },
  hint: {
    marginTop: 4,
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
