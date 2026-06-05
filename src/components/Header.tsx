import type { Sanctuary } from '../types/game'

interface Props {
  sanctuary: Sanctuary
  population: number
  onExplore: () => void
  onReset: () => void
}

export function Header({ sanctuary, population, onExplore, onReset }: Props) {
  return (
    <header className="header">
      <div className="header__brand">
        <h1>WildKin</h1>
        <span className="header__subtitle">Monster Sanctuary</span>
      </div>
      <div className="header__stats">
        <div className="stat-pill">
          <span className="stat-pill__label">Day</span>
          <span className="stat-pill__value">{sanctuary.day}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill__label">Pop</span>
          <span className="stat-pill__value">
            {population}/{sanctuary.capacity}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill__label">Gold</span>
          <span className="stat-pill__value">{sanctuary.gold}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill__label">Rep</span>
          <span className="stat-pill__value">{sanctuary.reputation}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill__label">Heritage</span>
          <span className="stat-pill__value">{sanctuary.heritagePoints}</span>
        </div>
      </div>
      <div className="header__actions">
        <button type="button" className="btn btn--secondary" onClick={onExplore}>
          Explore (10g)
        </button>
        <button type="button" className="btn btn--ghost" onClick={onReset} title="New game">
          Reset
        </button>
      </div>
    </header>
  )
}
