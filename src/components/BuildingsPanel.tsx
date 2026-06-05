import type { Building, GameAction } from '../types/game'

interface Props {
  buildings: Building[]
  gold: number
  onAction: (action: GameAction) => void
}

export function BuildingsPanel({ buildings, gold, onAction }: Props) {
  return (
    <div className="buildings-grid">
      {buildings.map((b) => (
        <div key={b.id} className={`building-card ${b.built ? 'building-card--built' : ''}`}>
          <h3>{b.name}</h3>
          <p>{b.description}</p>
          {b.built ? (
            <span className="badge badge--built">Built · Lv {b.level}</span>
          ) : (
            <button
              type="button"
              className="btn btn--small btn--primary"
              disabled={gold < b.cost}
              onClick={() => onAction({ type: 'BUILD', buildingId: b.id })}
            >
              Build ({b.cost}g)
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
