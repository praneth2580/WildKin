import { SAVE_KEY } from '../data/constants'
import type { GameState } from '../types/game'
import { createNewGame } from './gameState'
import { migrateGameState } from './migrate'

export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return createNewGame()
    const parsed = JSON.parse(raw) as GameState
    return migrateGameState(parsed)
  } catch {
    return createNewGame()
  }
}

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state))
}
