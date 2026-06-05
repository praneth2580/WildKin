import { useCallback, useEffect, useReducer } from 'react'
import { TICK_MS } from '../data/constants'
import type { GameAction } from '../types/game'
import { gameReducer } from '../lib/gameState'
import { loadGame, saveGame } from '../lib/storage'

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGame)
  const act = useCallback((action: GameAction) => {
    dispatch(action)
  }, [])

  useEffect(() => {
    saveGame(state)
  }, [state])

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return { state, act, reset }
}

export type GameContext = ReturnType<typeof useGame>
