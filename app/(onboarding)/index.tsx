import React from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Typography } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { TOKENS } from '../../constants/tokens'

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(1200)} style={styles.center}>
        <Typography variant="display" style={styles.title}>
          ECHO LIFE
        </Typography>
        <Typography
          variant="heading"
          color={TOKENS.color.textSecondary}
          style={styles.subtitle}
        >
          もう一つの人生
        </Typography>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(800).duration(800)} style={styles.bottom}>
        <Button title="始める" onPress={() => router.push('/(onboarding)/profile')} />
      </Animated.View>
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
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: TOKENS.spacing.md,
    fontStyle: 'italic',
    fontSize: 24,
  },
  bottom: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
})
