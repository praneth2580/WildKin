import { BRANCH_LABELS } from '../data/constants'
import type { Bloodline, BranchType, Sanctuary } from '../types/game'

interface Props {
  bloodlines: Bloodline[]
  sanctuary: Sanctuary
}

export function HeritagePanel({ bloodlines, sanctuary }: Props) {
  const sorted = [...bloodlines].sort((a, b) => b.heritageValue - a.heritageValue)

  return (
    <div className="heritage-panel">
      <div className="heritage-summary">
        <div className="heritage-stat">
          <span className="heritage-stat__value">{sanctuary.totalHatched}</span>
          <span className="heritage-stat__label">Hatched</span>
        </div>
        <div className="heritage-stat">
          <span className="heritage-stat__value">{sanctuary.totalBred}</span>
          <span className="heritage-stat__label">Bred</span>
        </div>
        <div className="heritage-stat">
          <span className="heritage-stat__value">{sanctuary.totalReleased}</span>
          <span className="heritage-stat__label">Released</span>
        </div>
        <div className="heritage-stat">
          <span className="heritage-stat__value">{sanctuary.heritagePoints}</span>
          <span className="heritage-stat__label">Heritage Pts</span>
        </div>
      </div>

      <h3>Bloodlines</h3>
      {sorted.length === 0 ? (
        <p className="hint">Hatch your first monster to begin a bloodline.</p>
      ) : (
        <div className="bloodline-list">
          {sorted.map((bl) => (
            <div key={bl.id} className="bloodline-card">
              <div className="bloodline-card__header">
                <h4>{bl.name}</h4>
                <span className="badge">Gen {bl.generation}</span>
              </div>
              <div className="bloodline-card__stats">
                <span>{bl.descendants} descendants</span>
                <span>{bl.mutations} mutations</span>
                <span>{bl.heritageValue} heritage</span>
                <span>{bl.victories} victories</span>
              </div>
              <div className="bloodline-card__branches">
                {(Object.keys(bl.branchCounts) as BranchType[])
                  .filter((k) => bl.branchCounts[k] > 0)
                  .map((k) => (
                    <span key={k} className="branch-count-chip">
                      {BRANCH_LABELS[k]}: {bl.branchCounts[k]}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
