import type { Egg, GameAction } from '../types/game'
import { dnaSummary } from '../lib/genetics'
import { MonsterSprite } from './MonsterSprite'

interface Props {
  egg: Egg
  hasNest: boolean
  atCapacity: boolean
  onAction: (action: GameAction) => void
  onClose: () => void
}

export function EggSheet({ egg, hasNest, atCapacity, onAction, onClose }: Props) {
  const ready = egg.incubationProgress >= egg.incubationRequired
  const progress = Math.round((egg.incubationProgress / egg.incubationRequired) * 100)

  return (
    <div className="creature-sheet-overlay" onClick={onClose} role="presentation">
      <div
        className="creature-sheet creature-sheet--egg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Egg details"
      >
        <div className="creature-sheet__handle" aria-hidden />
        <button type="button" className="creature-sheet__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="egg-sheet">
          <MonsterSprite dna={egg.dna} size={100} stage="egg" />
          <h2>{egg.isRare ? '✦ Rare Egg' : 'Mystery Egg'}</h2>
          {egg.generation > 1 && <p className="egg-sheet__gen">Generation {egg.generation}</p>}
          <p className="egg-sheet__dna">{dnaSummary(egg.dna)}</p>
          <div className="egg-sheet__progress">
            <div className="progress-bar progress-bar--large">
              <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}% incubated</span>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--glow"
            disabled={!ready || !hasNest || atCapacity}
            onClick={() => onAction({ type: 'HATCH_EGG', eggId: egg.id })}
          >
            {ready ? '✦ Hatch Egg' : 'Still incubating…'}
          </button>
          {!hasNest && <p className="hint">Build a Nest first!</p>}
          {atCapacity && <p className="hint">Sanctuary is full.</p>}
        </div>
      </div>
    </div>
  )
}
