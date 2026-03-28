import { useNPCStore } from '../stores/npcStore'

export function useNPCs() {
  const npcs = useNPCStore((s) => s.npcs)
  const initializeNPCs = useNPCStore((s) => s.initializeNPCs)
  const updateEmotion = useNPCStore((s) => s.updateEmotion)
  const getNPCsByRole = useNPCStore((s) => s.getNPCsByRole)

  return {
    npcs,
    initializeNPCs,
    updateEmotion,
    getNPCsByRole,
    friends: getNPCsByRole('friend'),
    family: getNPCsByRole('family'),
    rivals: getNPCsByRole('rival'),
  }
}
