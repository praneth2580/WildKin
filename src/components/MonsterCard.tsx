import type { Monster } from '../types/game'
import { MonsterSprite } from './MonsterSprite'
import { TrustBar } from './TrustBar'

interface Props {
  monster: Monster
  selected?: boolean
  onClick?: () => void
}

const STAGE_LABELS: Record<string, string> = {
  egg: 'Egg',
  infant: 'Infant',
  juvenile: 'Juvenile',
  adult: 'Adult',
}

const BEHAVIOR_LABELS: Record<string, string> = {
  healthy: 'Healthy',
  uncooperative: 'Uncooperative',
  hostile: 'Hostile',
  rampant: 'Rampant',
}

export function MonsterCard({ monster, selected, onClick }: Props) {
  return (
    <button
      type="button"
      className={`monster-card ${selected ? 'monster-card--selected' : ''} monster-card--${monster.behavior}`}
      onClick={onClick}
    >
      <MonsterSprite dna={monster.dna} size={64} stage={monster.stage} />
      <div className="monster-card__info">
        <span className="monster-card__name">{monster.name}</span>
        <span className="monster-card__meta">
          {STAGE_LABELS[monster.stage]} · Gen {monster.generation}
        </span>
        {monster.behavior !== 'healthy' && (
          <span className={`monster-card__behavior monster-card__behavior--${monster.behavior}`}>
            {BEHAVIOR_LABELS[monster.behavior]}
          </span>
        )}
        <TrustBar trust={monster.trust} behavior={monster.behavior} />
      </div>
    </button>
  )
}
