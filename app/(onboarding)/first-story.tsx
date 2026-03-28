import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { Typography } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { TOKENS } from '../../constants/tokens'
import { useAvatarStore } from '../../stores/avatarStore'
import { usePlayerStore } from '../../stores/playerStore'
import type { AvatarAppearance, LifeTheme } from '../../types'

export default function FirstStoryScreen() {
  const params = useLocalSearchParams<{
    name: string
    age: string
    hometown: string
    occupation: string
    dream: string
    appearance: string
    lifeTheme: string
  }>()

  const createAvatar = useAvatarStore((s) => s.createAvatar)
  const completeOnboarding = usePlayerStore((s) => s.completeOnboarding)
  const player = usePlayerStore((s) => s.player)
  const [showName, setShowName] = useState(false)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    const appearance: AvatarAppearance = params.appearance
      ? JSON.parse(params.appearance)
      : { skinTone: 1, hairStyle: 1, hairColor: '#1a1a1a', eyeShape: 1, faceShape: 1, gender: 'm' }

    createAvatar({
      name: params.name ?? '名無し',
      age: parseInt(params.age ?? '25', 10),
      hometown: params.hometown ?? '',
      occupation: params.occupation ?? '',
      dream: params.dream ?? '',
      lifeTheme: (params.lifeTheme as LifeTheme) ?? 'freedom',
      appearance,
      playerId: player?.id ?? 'unknown',
    })

    const t1 = setTimeout(() => setShowName(true), 500)
    const t2 = setTimeout(() => setShowCard(true), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleStart = () => {
    completeOnboarding()
    router.replace('/(main)/feed')
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.center}>
        <Typography variant="heading" color={TOKENS.color.textSecondary}>
          分身が誕生した
        </Typography>
      </Animated.View>

      {showName && (
        <Animated.View entering={FadeIn.duration(800)} style={styles.nameContainer}>
          <Typography variant="display" style={styles.name}>
            {params.name ?? '名無し'}
          </Typography>
        </Animated.View>
      )}

      {showCard && (
        <Animated.View entering={SlideInDown.duration(800).springify()} style={styles.bottom}>
          <Button title="はじめる" onPress={handleStart} />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.color.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: TOKENS.spacing.xl,
  },
  center: {
    alignItems: 'center',
  },
  nameContainer: {
    marginTop: TOKENS.spacing.xl,
    alignItems: 'center',
  },
  name: {
    fontSize: 48,
  },
  bottom: {
    position: 'absolute',
    bottom: 60,
  },
})
