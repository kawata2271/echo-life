import { useEffect } from 'react'
import { useStoryStore } from '../stores/storyStore'
import { useAvatarStore } from '../stores/avatarStore'

export function useStories() {
  const avatar = useAvatarStore((s) => s.avatar)
  const {
    todayEvents,
    currentIndex,
    archivedEvents,
    fetchTodayEvents,
    advanceCard,
    makeChoice,
    addReaction,
    getEmotionHistory,
  } = useStoryStore()

  useEffect(() => {
    if (avatar) {
      fetchTodayEvents(avatar.id)
    }
  }, [avatar?.id])

  return {
    todayEvents,
    currentIndex,
    archivedEvents,
    currentEvent: todayEvents[currentIndex] ?? null,
    hasMoreCards: currentIndex < todayEvents.length,
    advanceCard,
    makeChoice,
    addReaction,
    getEmotionHistory,
  }
}
