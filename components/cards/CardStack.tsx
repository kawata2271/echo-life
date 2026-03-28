import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { hapticLight } from '../../lib/platform'
import { StoryCard } from './StoryCard'
import { ChoiceCard } from './ChoiceCard'
import { EmptyDeck } from './EmptyDeck'
import type { StoryEvent, EventReaction } from '../../types/events'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SWIPE_THRESHOLD = 120
const VELOCITY_THRESHOLD = 800

interface Props {
  events: StoryEvent[]
  currentIndex: number
  onSwipe: () => void
  onChoiceSelect: (eventId: string, choiceId: string) => void
  onReaction: (eventId: string, emoji: EventReaction['emoji']) => void
}

export function CardStack({ events, currentIndex, onSwipe, onChoiceSelect, onReaction }: Props) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const visibleEvents = events.slice(currentIndex, currentIndex + 3)

  if (visibleEvents.length === 0) {
    return <EmptyDeck />
  }

  const handleSwipeComplete = () => {
    hapticLight()
    onSwipe()
    translateX.value = 0
    translateY.value = 0
  }

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX
      translateY.value = e.translationY * 0.3
    })
    .onEnd((e) => {
      const shouldSwipe =
        Math.abs(e.translationX) > SWIPE_THRESHOLD ||
        Math.abs(e.velocityX) > VELOCITY_THRESHOLD

      if (shouldSwipe) {
        const direction = e.translationX > 0 ? 1 : -1
        translateX.value = withSpring(
          direction * SCREEN_WIDTH * 1.5,
          { velocity: e.velocityX, damping: 20, stiffness: 100 },
          () => runOnJS(handleSwipeComplete)()
        )
        translateY.value = withSpring(0)
      } else {
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
      }
    })

  const topCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-15, 0, 15],
      Extrapolation.CLAMP
    )
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    }
  })

  const secondCardStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1)
    const scale = interpolate(progress, [0, 1], [0.95, 1], Extrapolation.CLAMP)
    const opacity = interpolate(progress, [0, 1], [0.6, 1], Extrapolation.CLAMP)
    return { transform: [{ scale }], opacity }
  })

  const thirdCardStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1)
    const scale = interpolate(progress, [0, 1], [0.92, 0.95], Extrapolation.CLAMP)
    const opacity = interpolate(progress, [0, 1], [0.3, 0.6], Extrapolation.CLAMP)
    return { transform: [{ scale }], opacity }
  })

  const cardStyles = [topCardStyle, secondCardStyle, thirdCardStyle]

  return (
    <View style={styles.container}>
      {visibleEvents.map((event, i) => {
        const isTop = i === 0
        const cardContent = event.choices ? (
          <ChoiceCard
            event={event}
            onChoiceSelect={(choiceId) => onChoiceSelect(event.id, choiceId)}
          />
        ) : (
          <StoryCard
            event={event}
            onReaction={(emoji) => onReaction(event.id, emoji)}
          />
        )

        const animatedView = (
          <Animated.View
            key={event.id}
            style={[
              styles.cardWrapper,
              { zIndex: visibleEvents.length - i },
              cardStyles[i],
            ]}
          >
            {cardContent}
          </Animated.View>
        )

        if (isTop) {
          return (
            <GestureDetector key={event.id} gesture={gesture}>
              {animatedView}
            </GestureDetector>
          )
        }
        return animatedView
      }).reverse()}
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
    position: 'absolute',
  },
})
