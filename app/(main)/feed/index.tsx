import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Typography } from '../../../components/ui/Typography'
import { CardStack } from '../../../components/cards/CardStack'
import { TOKENS } from '../../../constants/tokens'
import { useStoryStore } from '../../../stores/storyStore'
import { useAvatarStore } from '../../../stores/avatarStore'
import { formatEventDate, getDayOfWeek } from '../../../lib/dateUtils'
import type { EventReaction } from '../../../types/events'

export default function FeedScreen() {
  const avatar = useAvatarStore((s) => s.avatar)
  const { todayEvents, currentIndex, fetchTodayEvents, advanceCard, makeChoice, addReaction } = useStoryStore()

  useEffect(() => {
    if (avatar) {
      fetchTodayEvents(avatar.id)
    }
  }, [avatar?.id])

  const today = new Date()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="heading">今日の物語</Typography>
        <Typography variant="mono" color={TOKENS.color.textMuted}>
          {formatEventDate(today)} ({getDayOfWeek(today)})
        </Typography>
      </View>
      <CardStack
        events={todayEvents}
        currentIndex={currentIndex}
        onSwipe={advanceCard}
        onChoiceSelect={(eventId, choiceId) => makeChoice(eventId, choiceId)}
        onReaction={(eventId, emoji) => addReaction(eventId, emoji as EventReaction['emoji'])}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.color.bgPrimary,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: TOKENS.spacing.lg,
    marginBottom: TOKENS.spacing.md,
  },
})
