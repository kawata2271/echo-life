import React, { useState } from 'react'
import { View, FlatList, Pressable, Modal, ScrollView, StyleSheet } from 'react-native'
import { Typography } from '../../../components/ui/Typography'
import { Button } from '../../../components/ui/Button'
import { TOKENS } from '../../../constants/tokens'
import { useStoryStore } from '../../../stores/storyStore'
import { formatEventDate } from '../../../lib/dateUtils'
import { emotionToEmoji } from '../../../lib/emotions'
import type { StoryEvent } from '../../../types/events'

export default function ArchiveScreen() {
  const archivedEvents = useStoryStore((s) => s.archivedEvents)
  const [selectedEvent, setSelectedEvent] = useState<StoryEvent | null>(null)

  const sorted = [...archivedEvents].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  )

  return (
    <View style={styles.container}>
      <Typography variant="heading" style={styles.title}>人生アーカイブ</Typography>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => setSelectedEvent(item)}>
            <View style={styles.itemHeader}>
              <Typography variant="mono" color={TOKENS.color.textMuted}>
                {formatEventDate(new Date(item.eventDate))}
              </Typography>
              <Typography style={styles.emoji}>{emotionToEmoji(item.emotionTag)}</Typography>
            </View>
            <Typography variant="bodyMed">{item.title}</Typography>
            <Typography variant="jp" color={TOKENS.color.textSecondary} numberOfLines={2}>
              {item.body.slice(0, 50)}...
            </Typography>
          </Pressable>
        )}
        ListEmptyComponent={
          <Typography variant="jp" color={TOKENS.color.textMuted} style={styles.empty}>
            まだ記録がありません
          </Typography>
        }
      />

      <Modal visible={!!selectedEvent} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedEvent && (
                <>
                  <Typography variant="heading">{selectedEvent.title}</Typography>
                  <Typography variant="mono" color={TOKENS.color.textMuted} style={styles.modalDate}>
                    {formatEventDate(new Date(selectedEvent.eventDate))}
                  </Typography>
                  <Typography variant="jp" style={styles.modalBody}>
                    {selectedEvent.body}
                  </Typography>
                </>
              )}
            </ScrollView>
            <Button title="閉じる" variant="ghost" onPress={() => setSelectedEvent(null)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOKENS.color.bgPrimary,
    paddingTop: 60,
  },
  title: {
    paddingHorizontal: TOKENS.spacing.lg,
    marginBottom: TOKENS.spacing.md,
  },
  list: {
    padding: TOKENS.spacing.lg,
  },
  item: {
    padding: TOKENS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.color.borderSubtle,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: TOKENS.spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: TOKENS.color.bgElevated,
    borderTopLeftRadius: TOKENS.radius.lg,
    borderTopRightRadius: TOKENS.radius.lg,
    padding: TOKENS.spacing.xl,
    maxHeight: '80%',
  },
  modalDate: {
    marginTop: TOKENS.spacing.sm,
    marginBottom: TOKENS.spacing.lg,
  },
  modalBody: {
    marginBottom: TOKENS.spacing.xl,
  },
})
