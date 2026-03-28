import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { router } from 'expo-router'
// Reanimated entering/exiting removed for web compatibility
import { Typography } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { TOKENS } from '../../constants/tokens'
import { usePlayerStore } from '../../stores/playerStore'

const STEPS = [
  { title: 'あなたの名前は？', fields: ['name'] },
  { title: 'いつ生まれましたか？', fields: ['age'] },
  { title: 'どこ出身ですか？', fields: ['hometown'] },
  { title: '今の職業は？\n夢は？', fields: ['occupation', 'dream'] },
]

export default function ProfileScreen() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    age: 25,
    hometown: '',
    occupation: '',
    dream: '',
  })
  const createPlayer = usePlayerStore((s) => s.createPlayer)

  const canAdvance = () => {
    const fields = STEPS[step].fields
    return fields.every((f) => {
      if (f === 'age') return true
      return (form as any)[f]?.trim().length > 0
    })
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      createPlayer(form.name)
      router.push({
        pathname: '/(onboarding)/avatar',
        params: { ...form, age: String(form.age) },
      })
    }
  }

  return (
    <View style={styles.container}>
      <View key={step} style={styles.content}>
        <Typography variant="heading" style={styles.title}>
          {STEPS[step].title}
        </Typography>

        {step === 0 && (
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
            placeholder="名前を入力"
            placeholderTextColor={TOKENS.color.textMuted}
          />
        )}

        {step === 1 && (
          <View style={styles.ageContainer}>
            <Typography variant="display" style={styles.ageText}>
              {form.age}
            </Typography>
            <View style={styles.ageButtons}>
              <Button
                title="-"
                variant="ghost"
                onPress={() => setForm({ ...form, age: Math.max(18, form.age - 1) })}
              />
              <Button
                title="+"
                variant="ghost"
                onPress={() => setForm({ ...form, age: Math.min(60, form.age + 1) })}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <TextInput
            style={styles.input}
            value={form.hometown}
            onChangeText={(t) => setForm({ ...form, hometown: t })}
            placeholder="出身地を入力"
            placeholderTextColor={TOKENS.color.textMuted}
          />
        )}

        {step === 3 && (
          <>
            <TextInput
              style={styles.input}
              value={form.occupation}
              onChangeText={(t) => setForm({ ...form, occupation: t })}
              placeholder="職業を入力"
              placeholderTextColor={TOKENS.color.textMuted}
            />
            <TextInput
              style={[styles.input, { marginTop: TOKENS.spacing.md }]}
              value={form.dream}
              onChangeText={(t) => setForm({ ...form, dream: t })}
              placeholder="夢を入力"
              placeholderTextColor={TOKENS.color.textMuted}
            />
          </>
        )}
      </View>

      <View style={styles.bottom}>
        <Button
          title={step < STEPS.length - 1 ? '次へ' : '次へ'}
          onPress={handleNext}
          disabled={!canAdvance()}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.color.bgPrimary,
    padding: TOKENS.spacing.xl,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontStyle: 'italic',
    marginBottom: TOKENS.spacing.xl,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.color.border,
    color: TOKENS.color.textPrimary,
    fontFamily: TOKENS.font.jp,
    fontSize: 18,
    paddingVertical: TOKENS.spacing.md,
    textAlign: 'center',
  },
  ageContainer: {
    alignItems: 'center',
  },
  ageText: {
    fontSize: 64,
  },
  ageButtons: {
    flexDirection: 'row',
    gap: TOKENS.spacing.xl,
    marginTop: TOKENS.spacing.lg,
  },
  bottom: {
    alignItems: 'center',
    paddingBottom: 40,
  },
})
