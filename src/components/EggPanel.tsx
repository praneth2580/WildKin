import type { Egg, GameAction } from '../types/game'
import { dnaSummary } from '../lib/genetics'
import { MonsterSprite } from './MonsterSprite'

interface Props {
  eggs: Egg[]
  hasNest: boolean
  atCapacity: boolean
  onAction: (action: GameAction) => void
}

export function EggPanel({ eggs, hasNest, atCapacity, onAction }: Props) {
  if (eggs.length === 0) {
    return (
      <div className="panel-empty">
        <p>No eggs incubating. Explore or breed to find more.</p>
      </div>
    )
  }

  return (
    <div className="egg-grid">
      {eggs.map((egg) => {
        const ready = egg.incubationProgress >= egg.incubationRequired
        const progress = Math.round((egg.incubationProgress / egg.incubationRequired) * 100)

        return (
          <div key={egg.id} className={`egg-card ${egg.isRare ? 'egg-card--rare' : ''}`}>
            <MonsterSprite dna={egg.dna} size={56} stage="egg" />
            <div className="egg-card__info">
              <span className="egg-card__title">
                {egg.isRare ? '✦ Rare Egg' : 'Egg'}
                {egg.generation > 1 && ` · Gen ${egg.generation}`}
              </span>
              <span className="egg-card__dna">{dnaSummary(egg.dna)}</span>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="egg-card__progress">{progress}% incubated</span>
            </div>
            <button
              type="button"
              className="btn btn--small btn--primary"
              disabled={!ready || !hasNest || atCapacity}
              onClick={() => onAction({ type: 'HATCH_EGG', eggId: egg.id })}
            >
              {ready ? 'Hatch' : 'Incubating…'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
