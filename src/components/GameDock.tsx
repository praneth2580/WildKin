import type { TabId } from '../types/game'
import {
  IconBreeding,
  IconBuild,
  IconCaretakers,
  IconHeritage,
  IconSanctuary,
} from './GameIcons'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
}

const DOCK_ITEMS: { id: TabId; label: string; Icon: typeof IconSanctuary }[] = [
  { id: 'sanctuary', label: 'Sanctuary', Icon: IconSanctuary },
  { id: 'breeding', label: 'Breed', Icon: IconBreeding },
  { id: 'buildings', label: 'Build', Icon: IconBuild },
  { id: 'caretakers', label: 'Staff', Icon: IconCaretakers },
  { id: 'heritage', label: 'Legacy', Icon: IconHeritage },
]

export function GameDock({ active, onChange }: Props) {
  return (
    <nav className="game-dock" aria-label="Game navigation">
      {DOCK_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`dock-btn ${active === id ? 'dock-btn--active' : ''}`}
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <span className="dock-btn__icon">
            <Icon size={26} />
          </span>
          <span className="dock-btn__label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
