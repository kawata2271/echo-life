import React, { useState } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { StoryCard } from './StoryCard'
import { ChoiceCard } from './ChoiceCard'
import { EmptyDeck } from './EmptyDeck'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'
import type { StoryEvent, EventReaction } from '../../types/events'

interface Props {
  events: StoryEvent[]
  currentIndex: number
  onSwipe: () => void
  onChoiceSelect: (eventId: string, choiceId: string) => void
  onReaction: (eventId: string, emoji: EventReaction['emoji']) => void
}

export function CardStack({ events, currentIndex, onSwipe, onChoiceSelect, onReaction }: Props) {
  const visibleEvents = events.slice(currentIndex, currentIndex + 3)

  if (visibleEvents.length === 0) {
    return <EmptyDeck />
  }

  const topEvent = visibleEvents[0]

  return (
    <View style={styles.container}>
      {/* Show only the top card on web */}
      <View style={styles.cardWrapper}>
        {topEvent.choices ? (
          <ChoiceCard
            event={topEvent}
            onChoiceSelect={(choiceId) => {
              onChoiceSelect(topEvent.id, choiceId)
              setTimeout(onSwipe, 600)
            }}
          />
        ) : (
          <StoryCard
            event={topEvent}
            onReaction={(emoji) => onReaction(topEvent.id, emoji)}
          />
        )}
      </View>

      {/* Swipe button for web (no gesture support) */}
      {!topEvent.choices && (
        <Pressable
          onPress={onSwipe}
          role="button"
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
        >
          <Typography variant="bodyMed" color={TOKENS.color.textPrimary}>
            次へ →
          </Typography>
        </Pressable>
      )}

      {/* Card counter */}
      <Typography variant="mono" color={TOKENS.color.textMuted} style={styles.counter}>
        {currentIndex + 1} / {events.length}
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    marginBottom: 16,
  },
  nextButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: TOKENS.color.border,
    borderRadius: TOKENS.radius.sm,
    cursor: 'pointer' as any,
  },
  nextButtonPressed: {
    opacity: 0.7,
  },
  counter: {
    marginTop: 12,
  },
})
