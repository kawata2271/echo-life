import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Typography } from '../../../components/ui/Typography'
import { AvatarFace } from '../../../components/avatar/AvatarFace'
import { StatusMeter } from '../../../components/avatar/StatusMeter'
import { EmotionGraph } from '../../../components/avatar/EmotionGraph'
import { NPCListItem } from '../../../components/avatar/NPCListItem'
import { TOKENS } from '../../../constants/tokens'
import { useAvatarStore } from '../../../stores/avatarStore'
import { useNPCStore } from '../../../stores/npcStore'
import { useStoryStore } from '../../../stores/storyStore'

export default function AvatarScreen() {
  const avatar = useAvatarStore((s) => s.avatar)
  const npcs = useNPCStore((s) => s.npcs)
  const getEmotionHistory = useStoryStore((s) => s.getEmotionHistory)

  if (!avatar) {
    return (
      <View style={styles.container}>
        <Typography variant="heading">分身がまだいません</Typography>
      </View>
    )
  }

  const emotionData = getEmotionHistory(7)
  const displayNPCs = npcs.slice(0, 3)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profile}>
        <AvatarFace appearance={avatar.appearance} size={100} />
        <Typography variant="heading" style={styles.name}>{avatar.name}</Typography>
        <Typography variant="mono" color={TOKENS.color.textMuted}>
          {avatar.age}歳 · {avatar.occupation}
        </Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="bodyMed" style={styles.sectionTitle}>ステータス</Typography>
        <StatusMeter status={avatar.status} />
      </View>

      <View style={styles.section}>
        <EmotionGraph data={emotionData.length > 0 ? emotionData.map((d) => d.happiness) : [50, 55, 48, 60, 52, 58, 55]} />
      </View>

      {displayNPCs.length > 0 && (
        <View style={styles.section}>
          <Typography variant="bodyMed" style={styles.sectionTitle}>人間関係</Typography>
          {displayNPCs.map((npc) => (
            <NPCListItem key={npc.id} npc={npc} />
          ))}
        </View>
      )}
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
    paddingBottom: 40,
  },
  profile: {
    alignItems: 'center',
    padding: TOKENS.spacing.xl,
  },
  name: {
    marginTop: TOKENS.spacing.md,
  },
  section: {
    padding: TOKENS.spacing.lg,
  },
  sectionTitle: {
    marginBottom: TOKENS.spacing.md,
  },
})
