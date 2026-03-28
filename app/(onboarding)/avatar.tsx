import React, { useState } from 'react'
import { View, ScrollView, Pressable, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Typography } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { TOKENS } from '../../constants/tokens'
import type { AvatarAppearance } from '../../types'

const SKIN_COLORS = ['#FDEBD0', '#F5CBA7', '#E0AC69', '#C68642', '#8D5524', '#5C3317']
const HAIR_COLORS = ['#1a1a1a', '#6B4226', '#D4A76A', '#8B4513', '#FFFFFF', '#808080']
const GENDERS: { value: AvatarAppearance['gender']; label: string }[] = [
  { value: 'm', label: '男性' },
  { value: 'f', label: '女性' },
  { value: 'nb', label: 'ノンバイナリー' },
]

export default function AvatarScreen() {
  const params = useLocalSearchParams<{ name: string; age: string; hometown: string; occupation: string; dream: string }>()
  const [appearance, setAppearance] = useState<AvatarAppearance>({
    skinTone: 1,
    hairStyle: 1,
    hairColor: '#1a1a1a',
    eyeShape: 1,
    faceShape: 1,
    gender: 'm',
  })

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Typography variant="heading" style={styles.title}>外見を設定</Typography>

      <Typography variant="jpMed" style={styles.label}>肌色</Typography>
      <View style={styles.row}>
        {SKIN_COLORS.map((color, i) => (
          <Pressable
            key={color}
            onPress={() => setAppearance({ ...appearance, skinTone: (i + 1) as AvatarAppearance['skinTone'] })}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              appearance.skinTone === i + 1 && styles.selected,
            ]}
          />
        ))}
      </View>

      <Typography variant="jpMed" style={styles.label}>髪型</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hairScroll}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
          <Pressable
            key={n}
            onPress={() => setAppearance({ ...appearance, hairStyle: n })}
            style={[styles.hairOption, appearance.hairStyle === n && styles.selected]}
          >
            <Typography variant="mono">{n}</Typography>
          </Pressable>
        ))}
      </ScrollView>

      <Typography variant="jpMed" style={styles.label}>髪色</Typography>
      <View style={styles.row}>
        {HAIR_COLORS.map((color) => (
          <Pressable
            key={color}
            onPress={() => setAppearance({ ...appearance, hairColor: color })}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              appearance.hairColor === color && styles.selected,
            ]}
          />
        ))}
      </View>

      <Typography variant="jpMed" style={styles.label}>性別</Typography>
      <View style={styles.row}>
        {GENDERS.map((g) => (
          <Pressable
            key={g.value}
            onPress={() => setAppearance({ ...appearance, gender: g.value })}
            style={[styles.genderOption, appearance.gender === g.value && styles.selected]}
          >
            <Typography variant="jp" color={appearance.gender === g.value ? TOKENS.color.amber : TOKENS.color.textPrimary}>
              {g.label}
            </Typography>
          </Pressable>
        ))}
      </View>

      <View style={styles.bottom}>
        <Button
          title="次へ"
          onPress={() => router.push({
            pathname: '/(onboarding)/theme',
            params: { ...params, appearance: JSON.stringify(appearance) },
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
  label: {
    marginTop: TOKENS.spacing.lg,
    marginBottom: TOKENS.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: TOKENS.spacing.md,
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: TOKENS.color.amber,
  },
  hairScroll: {
    marginBottom: TOKENS.spacing.md,
  },
  hairOption: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: TOKENS.color.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: TOKENS.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderOption: {
    paddingVertical: TOKENS.spacing.sm,
    paddingHorizontal: TOKENS.spacing.lg,
    borderRadius: TOKENS.radius.sm,
    borderWidth: 1,
    borderColor: TOKENS.color.border,
  },
  bottom: {
    alignItems: 'center',
    marginTop: TOKENS.spacing.xxl,
    paddingBottom: 40,
  },
})
