import { FOOD_LABELS } from '../data/constants'
import type { FoodStock, Sanctuary, TreatStock } from '../types/game'
import { IconDay, IconExplore, IconFood, IconGold, IconHeart, IconPop, IconTreat } from './GameIcons'

interface Props {
  sanctuary: Sanctuary
  population: number
  overCapacity: boolean
  onExplore: () => void
  onReset: () => void
}

export function GameHUD({ sanctuary, population, overCapacity, onExplore, onReset }: Props) {
  return (
    <header className="game-hud">
      <div className="game-hud__brand">
        <span className="game-hud__logo">WildKin</span>
      </div>

      <div className="game-hud__resources">
        <div className="hud-stat" title="Day">
          <IconDay />
          <span>{sanctuary.day}</span>
        </div>
        <div className="hud-stat hud-stat--gold" title="Gold">
          <IconGold />
          <span>{sanctuary.gold}</span>
        </div>
        <div className={`hud-stat ${overCapacity ? 'hud-stat--warn' : ''}`} title="Population">
          <IconPop />
          <span>{population}/{sanctuary.capacity}</span>
        </div>
        <div className="hud-stat" title="Reputation">
          <IconHeart />
          <span>{sanctuary.reputation}</span>
        </div>
        <div className="hud-stat hud-stat--heritage" title="Heritage Points">
          <span className="hud-stat__glyph">✦</span>
          <span>{sanctuary.heritagePoints}</span>
        </div>
      </div>

      <div className="game-hud__inventory">
        <FoodRow food={sanctuary.food} />
        <TreatRow treats={sanctuary.treats} />
      </div>

      <div className="game-hud__actions">
        <button type="button" className="hud-btn hud-btn--explore" onClick={onExplore} title="Explore (10g)">
          <IconExplore />
          <span>Explore</span>
        </button>
        <button type="button" className="hud-btn hud-btn--menu" onClick={onReset} title="New game">
          ⋯
        </button>
      </div>

      {overCapacity && (
        <div className="game-hud__alert">
          Sanctuary over capacity — creatures need care!
        </div>
      )}
    </header>
  )
}

function FoodRow({ food }: { food: FoodStock }) {
  return (
    <div className="hud-inventory">
      <IconFood />
      {(Object.keys(food) as (keyof FoodStock)[]).map((key) => (
        <span key={key} className="hud-chip" title={FOOD_LABELS[key]}>
          {food[key]}
        </span>
      ))}
    </div>
  )
}

function TreatRow({ treats }: { treats: TreatStock }) {
  const total = treats.spicyBerry + treats.moonFruit + treats.crystalCandy
  if (total === 0) return null
  return (
    <div className="hud-inventory hud-inventory--treats">
      <IconTreat />
      <span className="hud-chip">{total}</span>
    </div>
  )
}
