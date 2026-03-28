import { Tabs } from 'expo-router'
import { TOKENS } from '../../constants/tokens'

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: TOKENS.color.bgPanel,
          borderTopColor: TOKENS.color.borderSubtle,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: TOKENS.color.amber,
        tabBarInactiveTintColor: TOKENS.color.textMuted,
      }}
    >
      <Tabs.Screen
        name="feed/index"
        options={{ title: '物語', tabBarLabel: '物語' }}
      />
      <Tabs.Screen
        name="avatar/index"
        options={{ title: '分身', tabBarLabel: '分身' }}
      />
      <Tabs.Screen
        name="archive/index"
        options={{ title: 'アーカイブ', tabBarLabel: '記録' }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{ title: '設定', tabBarLabel: '設定' }}
      />
    </Tabs>
  )
}
