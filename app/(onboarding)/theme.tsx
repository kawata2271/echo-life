import React, { useState } from 'react'
import { View, Pressable, ScrollView, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Typography } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { TOKENS } from '../../constants/tokens'
import type { LifeTheme } from '../../types'

const THEMES: { value: LifeTheme; icon: string; label: string; desc: string }[] = [
  { value: 'romance', icon: '❤️', label: '恋愛', desc: '人との繋がりを大切に' },
  { value: 'career', icon: '💼', label: 'キャリア', desc: '仕事に情熱を注ぐ' },
  { value: 'adventure', icon: '🌏', label: '冒険', desc: '新しい世界を探索する' },
  { value: 'freedom', icon: '🌊', label: '自由', desc: '自分らしく生きる' },
  { value: 'family', icon: '🏠', label: '家族', desc: '大切な人を守る' },
]

export default function ThemeScreen() {
  const params = useLocalSearchParams()
  const [selected, setSelected] = useState<LifeTheme | null>(null)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Typography variant="heading" style={styles.title}>
        人生のテーマを選ぶ
      </Typography>

      {THEMES.map((theme) => (
        <Pressable
          key={theme.value}
          onPress={() => setSelected(theme.value)}
          style={[
            styles.card,
            selected === theme.value && styles.cardSelected,
          ]}
        >
          <Typography style={styles.icon}>{theme.icon}</Typography>
          <View style={styles.cardText}>
            <Typography variant="bodyMed">{theme.label}</Typography>
            <Typography variant="jp" color={TOKENS.color.textMuted}>
              {theme.desc}
            </Typography>
          </View>
        </Pressable>
      ))}

      <View style={styles.bottom}>
        <Button
          title="次へ"
          disabled={!selected}
          onPress={() => router.push({
            pathname: '/(onboarding)/first-story',
            params: { ...params, lifeTheme: selected! },
          })}
        />
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
    padding: TOKENS.spacing.xl,
    paddingTop: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: TOKENS.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: TOKENS.spacing.lg,
    borderRadius: TOKENS.radius.sm,
    borderWidth: 1,
    borderColor: TOKENS.color.border,
    marginBottom: TOKENS.spacing.md,
    gap: TOKENS.spacing.md,
  },
  cardSelected: {
    borderColor: TOKENS.color.amber,
    backgroundColor: `${TOKENS.color.amber}1A`,
  },
  icon: {
    fontSize: 32,
  },
  cardText: {
    flex: 1,
  },
  bottom: {
    alignItems: 'center',
    marginTop: TOKENS.spacing.xl,
    paddingBottom: 40,
  },
})
