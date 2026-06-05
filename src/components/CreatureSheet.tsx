import type { Caretaker, GameAction, Monster } from '../types/game'
import { MonsterDetail } from './MonsterDetail'

interface Props {
  monster: Monster
  bloodlineName: string
  caretakers: Caretaker[]
  hasRehabCenter: boolean
  rehabFull: boolean
  onAction: (action: GameAction) => void
  onClose: () => void
}

export function CreatureSheet({
  monster,
  bloodlineName,
  caretakers,
  hasRehabCenter,
  rehabFull,
  onAction,
  onClose,
}: Props) {
  return (
    <div className="creature-sheet-overlay" onClick={onClose} role="presentation">
      <div
        className="creature-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${monster.name} details`}
      >
        <div className="creature-sheet__ornament creature-sheet__ornament--top" />
        <button type="button" className="creature-sheet__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <MonsterDetail
          monster={monster}
          caretakers={caretakers}
          bloodlineName={bloodlineName}
          onAction={onAction}
          hasRehabCenter={hasRehabCenter}
          rehabFull={rehabFull}
        />
        <div className="creature-sheet__ornament creature-sheet__ornament--bottom" />
      </div>
    </div>
  )
}
