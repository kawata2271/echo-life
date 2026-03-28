import { Platform } from 'react-native'

export const isWeb = Platform.OS === 'web'
export const isNative = Platform.OS === 'ios' || Platform.OS === 'android'

export async function hapticLight(): Promise<void> {
  if (isWeb) return
  const { impactAsync, ImpactFeedbackStyle } = await import('expo-haptics')
  impactAsync(ImpactFeedbackStyle.Light)
}

export async function hapticMedium(): Promise<void> {
  if (isWeb) return
  const { impactAsync, ImpactFeedbackStyle } = await import('expo-haptics')
  impactAsync(ImpactFeedbackStyle.Medium)
}

export async function hapticSelection(): Promise<void> {
  if (isWeb) return
  const { selectionAsync } = await import('expo-haptics')
  selectionAsync()
}
