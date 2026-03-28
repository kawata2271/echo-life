import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Typography } from './Typography'
import { TOKENS } from '../../constants/tokens'

const REACTIONS = ['❤️', '😢', '😂', '😮', '🔥'] as const
type ReactionEmoji = typeof REACTIONS[number]

interface Props {
  selected: ReactionEmoji[]
  onToggle: (emoji: ReactionEmoji) => void
}

export function EmotionReaction({ selected, onToggle }: Props) {
  const handlePress = (emoji: ReactionEmoji) => {
    Haptics.selectionAsync()
    onToggle(emoji)
  }

  return (
    <View style={styles.container}>
      {REACTIONS.map((emoji) => {
        const isSelected = selected.includes(emoji)
        return (
          <Pressable
            key={emoji}
            onPress={() => handlePress(emoji)}
            style={[styles.button, isSelected && styles.selected]}
          >
            <Typography style={styles.emoji}>{emoji}</Typography>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: TOKENS.spacing.sm,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: `${TOKENS.color.amber}33`,
  },
  emoji: {
    fontSize: 20,
  },
})
