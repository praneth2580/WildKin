import type { GameAction, Monster } from '../types/game'
import { MonsterCard } from './MonsterCard'

interface Props {
  monsters: Monster[]
  parentAId: string | null
  parentBId: string | null
  hasBreedingDen: boolean
  atCapacity: boolean
  onAction: (action: GameAction) => void
}

export function BreedingPanel({
  monsters,
  parentAId,
  parentBId,
  hasBreedingDen,
  atCapacity,
  onAction,
}: Props) {
  const breeders = monsters.filter((m) => m.canBreed)

  if (!hasBreedingDen) {
    return (
      <div className="panel-empty">
        <p>Build a Breeding Den to combine adult monsters and create new bloodlines.</p>
      </div>
    )
  }

  const parentA = monsters.find((m) => m.id === parentAId)
  const parentB = monsters.find((m) => m.id === parentBId)
  const canBreed = parentA && parentB && parentA.id !== parentB.id && !atCapacity

  return (
    <div className="breeding-panel">
      <div className="breeding-slots">
        <div className="breeding-slot">
          <h3>Parent A</h3>
          {parentA ? (
            <MonsterCard monster={parentA} onClick={() => onAction({ type: 'SET_BREEDING_PARENT', slot: 'A', monsterId: null })} />
          ) : (
            <div className="breeding-slot__empty">Select a parent</div>
          )}
        </div>
        <div className="breeding-connector">+</div>
        <div className="breeding-slot">
          <h3>Parent B</h3>
          {parentB ? (
            <MonsterCard monster={parentB} onClick={() => onAction({ type: 'SET_BREEDING_PARENT', slot: 'B', monsterId: null })} />
          ) : (
            <div className="breeding-slot__empty">Select a parent</div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="btn btn--primary btn--breed"
        disabled={!canBreed}
        onClick={() => onAction({ type: 'BREED' })}
      >
        Breed (creates egg)
      </button>

      <div className="breeding-candidates">
        <h3>Eligible Adults</h3>
        {breeders.length === 0 ? (
          <p className="hint">Only healthy adult monsters can breed.</p>
        ) : (
          <div className="monster-grid">
            {breeders.map((m) => (
              <MonsterCard
                key={m.id}
                monster={m}
                selected={m.id === parentAId || m.id === parentBId}
                onClick={() => {
                  if (!parentAId) {
                    onAction({ type: 'SET_BREEDING_PARENT', slot: 'A', monsterId: m.id })
                  } else if (!parentBId && m.id !== parentAId) {
                    onAction({ type: 'SET_BREEDING_PARENT', slot: 'B', monsterId: m.id })
                  } else if (m.id === parentAId) {
                    onAction({ type: 'SET_BREEDING_PARENT', slot: 'A', monsterId: null })
                  } else if (m.id === parentBId) {
                    onAction({ type: 'SET_BREEDING_PARENT', slot: 'B', monsterId: null })
                  } else {
                    onAction({ type: 'SET_BREEDING_PARENT', slot: 'B', monsterId: m.id })
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
