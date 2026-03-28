import React from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Typography } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { TOKENS } from '../../constants/tokens'
import { isWeb } from '../../lib/platform'

let Animated: any = View
let FadeIn: any = null

if (!isWeb) {
  try {
    const Reanimated = require('react-native-reanimated')
    Animated = Reanimated.default
    FadeIn = Reanimated.FadeIn
  } catch {
    // fallback to View
  }
}

export default function WelcomeScreen() {
  const CenterWrapper = isWeb ? View : Animated.View
  const BottomWrapper = isWeb ? View : Animated.View

  const centerProps = isWeb ? {} : { entering: FadeIn?.duration(1200) }
  const bottomProps = isWeb ? {} : { entering: FadeIn?.delay(800).duration(800) }

  return (
    <View style={styles.container}>
      <CenterWrapper {...centerProps} style={styles.center}>
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
      </CenterWrapper>
      <BottomWrapper {...bottomProps} style={styles.bottom}>
        <Button title="始める" onPress={() => router.push('/(onboarding)/profile')} />
      </BottomWrapper>
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
