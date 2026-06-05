import { BRANCH_DESCRIPTIONS, FOOD_LABELS } from '../data/constants'
import type { Caretaker, FoodType, GameAction, Monster, TreatType } from '../types/game'
import { dnaSummary } from '../lib/genetics'
import { BranchBadge } from './BranchBadge'
import { MonsterSprite } from './MonsterSprite'
import { TrustBar } from './TrustBar'

interface Props {
  monster: Monster
  caretakers: Caretaker[]
  bloodlineName: string
  onAction: (action: GameAction) => void
  hasRehabCenter: boolean
  rehabFull: boolean
}

const FOODS: FoodType[] = ['proteinFeed', 'growthFruit', 'crystalHerbs']
const TREATS: TreatType[] = ['spicyBerry', 'moonFruit', 'crystalCandy']

export function MonsterDetail({
  monster,
  caretakers,
  bloodlineName,
  onAction,
  hasRehabCenter,
  rehabFull,
}: Props) {
  const caretaker = caretakers.find((c) => c.id === monster.caretakerId)

  return (
    <div className="monster-detail">
      <div className="monster-detail__hero">
        <MonsterSprite dna={monster.dna} size={120} stage={monster.stage} />
        <div>
          <h2>{monster.name}</h2>
          <p className="monster-detail__line">{bloodlineName} · Gen {monster.generation}</p>
          <p className="monster-detail__dna">{dnaSummary(monster.dna)}</p>
          <div className="monster-detail__badges">
            <BranchBadge branch={monster.branchType} />
            {monster.isMutated && monster.branchType !== 'mutation' && (
              <span className="badge badge--mutation">Mutated traits</span>
            )}
          </div>
          <p className="monster-detail__branch-desc">{BRANCH_DESCRIPTIONS[monster.branchType]}</p>
        </div>
      </div>

      <div className="monster-detail__stats">
        <div className="detail-row">
          <span>Branch</span>
          <BranchBadge branch={monster.branchType} />
        </div>
        <div className="detail-row">
          <span>Stage</span>
          <strong className="capitalize">{monster.stage}</strong>
        </div>
        <div className="detail-row">
          <span>Trust</span>
          <TrustBar trust={monster.trust} behavior={monster.behavior} />
        </div>
        <div className="detail-row">
          <span>Preferred Food</span>
          <strong>{FOOD_LABELS[monster.preferredFood]}</strong>
        </div>
        <div className="detail-row">
          <span>Caretaker</span>
          <strong>{caretaker?.name ?? 'Unassigned'}</strong>
        </div>
        {monster.inRehab && (
          <p className="notice notice--info">In rehabilitation — recovery in progress…</p>
        )}
      </div>

      <div className="dna-grid">
        {(Object.entries(monster.dna) as [string, string][]).map(([key, value]) => (
          <div key={key} className="dna-cell">
            <span className="dna-cell__key">{key}</span>
            <span className="dna-cell__val">{value}</span>
          </div>
        ))}
      </div>

      {monster.behavior !== 'rampant' && !monster.inRehab && (
        <div className="action-group">
          <h3>Feed</h3>
          <div className="btn-row">
            {FOODS.map((food) => (
              <button
                key={food}
                type="button"
                className={`btn btn--small ${monster.preferredFood === food ? 'btn--preferred' : ''}`}
                onClick={() => onAction({ type: 'FEED', monsterId: monster.id, food })}
              >
                {FOOD_LABELS[food]}
              </button>
            ))}
          </div>
        </div>
      )}

      {monster.behavior !== 'rampant' && !monster.inRehab && (
        <div className="action-group">
          <h3>Treats</h3>
          <div className="btn-row">
            {TREATS.map((treat) => (
              <button
                key={treat}
                type="button"
                className="btn btn--small btn--treat"
                onClick={() => onAction({ type: 'GIVE_TREAT', monsterId: monster.id, treat })}
              >
                {treat.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="action-group">
        <h3>Assign Caretaker</h3>
        <div className="btn-row">
          {caretakers.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`btn btn--small ${monster.caretakerId === c.id ? 'btn--active' : ''}`}
              onClick={() =>
                onAction({
                  type: 'ASSIGN_CARETAKER',
                  monsterId: monster.id,
                  caretakerId: monster.caretakerId === c.id ? null : c.id,
                })
              }
            >
              {c.name} ({c.role})
            </button>
          ))}
        </div>
      </div>

      {monster.behavior === 'rampant' && (
        <div className="action-group action-group--critical">
          <h3>Critical — Rampant</h3>
          <p>Normal care no longer works. Choose a permanent action.</p>
          <div className="btn-row">
            {hasRehabCenter && !rehabFull && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onAction({ type: 'REHABILITATE', monsterId: monster.id })}
              >
                Rehabilitate (25g)
              </button>
            )}
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onAction({ type: 'PUT_DOWN', monsterId: monster.id })}
            >
              Put Down
            </button>
          </div>
        </div>
      )}

      {monster.behavior !== 'rampant' && monster.stage !== 'infant' && (
        <button
          type="button"
          className="btn btn--ghost btn--release"
          onClick={() => onAction({ type: 'RELEASE', monsterId: monster.id })}
        >
          Release to Wild (+Heritage)
        </button>
      )}
    </div>
  )
}
