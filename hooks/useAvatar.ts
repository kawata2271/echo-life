import { useAvatarStore } from '../stores/avatarStore'
import { happinessToTendency } from '../lib/emotions'

export function useAvatar() {
  const avatar = useAvatarStore((s) => s.avatar)
  const applyDelta = useAvatarStore((s) => s.applyDelta)
  const incrementAge = useAvatarStore((s) => s.incrementAge)

  const tendency = avatar ? happinessToTendency(avatar.status.happiness) : null

  return {
    avatar,
    tendency,
    applyDelta,
    incrementAge,
  }
}
