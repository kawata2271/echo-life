import React from 'react'
import { View, Switch, ScrollView, Alert, StyleSheet } from 'react-native'
import { Typography } from '../../../components/ui/Typography'
import { Button } from '../../../components/ui/Button'
import { TOKENS } from '../../../constants/tokens'
import { usePlayerStore } from '../../../stores/playerStore'
import { useAvatarStore } from '../../../stores/avatarStore'
import { useStoryStore } from '../../../stores/storyStore'
import { useNPCStore } from '../../../stores/npcStore'

export default function SettingsScreen() {
  const player = usePlayerStore((s) => s.player)
  const updateSettings = usePlayerStore((s) => s.updateSettings)
  const resetPlayer = usePlayerStore((s) => s.reset)
  const resetAvatar = useAvatarStore((s) => s.reset)
  const resetStory = useStoryStore((s) => s.reset)
  const resetNpc = useNPCStore((s) => s.reset)

  const settings = player?.settings

  const handleReset = () => {
    Alert.alert(
      'アカウントリセット',
      '全てのデータが削除されます。よろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット',
          style: 'destructive',
          onPress: () => {
            resetPlayer()
            resetAvatar()
            resetStory()
            resetNpc()
          },
        },
      ]
    )
  }

  const handleExport = () => {
    Alert.alert('エクスポート', 'Phase 2で実装予定です')
  }

  if (!settings) return null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Typography variant="heading" style={styles.title}>設定</Typography>

      <View style={styles.row}>
        <Typography variant="jp">通知</Typography>
        <Switch
          value={settings.notificationsEnabled}
          onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
          trackColor={{ true: TOKENS.color.amber }}
        />
      </View>

      <View style={styles.row}>
        <Typography variant="jp">サウンド</Typography>
        <Switch
          value={settings.soundEnabled}
          onValueChange={(v) => updateSettings({ soundEnabled: v })}
          trackColor={{ true: TOKENS.color.amber }}
        />
      </View>

      <View style={styles.row}>
        <Typography variant="jp">ハプティクス</Typography>
        <Switch
          value={settings.hapticEnabled}
          onValueChange={(v) => updateSettings({ hapticEnabled: v })}
          trackColor={{ true: TOKENS.color.amber }}
        />
      </View>

      <View style={styles.actions}>
        <Button title="アーカイブをエクスポート" variant="secondary" onPress={handleExport} />
        <Button title="アカウントリセット" variant="ghost" onPress={handleReset} style={styles.resetBtn} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.color.bgPrimary,
  },
  content: {
    paddingTop: 60,
    padding: TOKENS.spacing.xl,
  },
  title: {
    marginBottom: TOKENS.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: TOKENS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.color.borderSubtle,
  },
  actions: {
    marginTop: TOKENS.spacing.xxl,
    gap: TOKENS.spacing.md,
  },
  resetBtn: {
    borderColor: TOKENS.color.terra,
  },
})
