import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Typography } from '../ui/Typography'
import { TOKENS } from '../../constants/tokens'
import type { NPC } from '../../types/npc'

const ROLE_LABELS: Record<string, string> = {
  friend: '友人',
  lover: '恋人',
  rival: 'ライバル',
  mentor: '師匠',
  family: '家族',
  acquaintance: '知人',
}

interface Props {
  npc: NPC
  onPress?: () => void
}

export function NPCListItem({ npc, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.avatar}>
        <Typography style={styles.avatarText}>
          {npc.name.charAt(0)}
        </Typography>
      </View>
      <View style={styles.info}>
        <Typography variant="bodyMed">{npc.name}</Typography>
        <Typography variant="mono" color={TOKENS.color.textMuted}>
          {ROLE_LABELS[npc.role] ?? npc.role} · {npc.occupation}
        </Typography>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: TOKENS.spacing.md,
    gap: TOKENS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.color.borderSubtle,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TOKENS.color.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
})
