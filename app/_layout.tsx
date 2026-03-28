import { useEffect } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0d0b' },
          animation: Platform.OS === 'web' ? 'none' : 'fade',
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
