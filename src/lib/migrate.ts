import { emptyBranchCounts } from '../data/constants'
import type { BranchType, GameState, Monster } from '../types/game'

function inferMonsterBranch(m: Monster): BranchType {
  if (m.branchType) return m.branchType
  if (m.isMutated) return 'mutation'
  if (m.generation === 1) return 'founder'
  return 'mainline'
}

export function migrateGameState(state: GameState): GameState {
  return {
    ...state,
    monsters: state.monsters.map((m) => ({
      ...m,
      branchType: inferMonsterBranch(m),
    })),
    eggs: state.eggs.map((e) => ({
      ...e,
      branchType: e.branchType ?? null,
    })),
    bloodlines: state.bloodlines.map((bl) => ({
      ...bl,
      branchCounts: bl.branchCounts ?? emptyBranchCounts(),
    })),
  }
}
