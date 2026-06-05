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
      <div className="game-hud__row game-hud__row--primary">
        <span className="game-hud__logo">WildKin</span>

        <div className="game-hud__stats">
          <div className="hud-stat" aria-label={`Day ${sanctuary.day}`}>
            <IconDay size={16} />
            <span>{sanctuary.day}</span>
          </div>
          <div className="hud-stat hud-stat--gold" aria-label={`${sanctuary.gold} gold`}>
            <IconGold size={16} />
            <span>{sanctuary.gold}</span>
          </div>
          <div
            className={`hud-stat ${overCapacity ? 'hud-stat--warn' : ''}`}
            aria-label={`Population ${population} of ${sanctuary.capacity}`}
          >
            <IconPop size={16} />
            <span>{population}/{sanctuary.capacity}</span>
          </div>
          <div className="hud-stat hud-stat--compact" aria-label={`Reputation ${sanctuary.reputation}`}>
            <IconHeart size={16} />
            <span>{sanctuary.reputation}</span>
          </div>
          <div className="hud-stat hud-stat--heritage hud-stat--compact" aria-label={`Heritage ${sanctuary.heritagePoints}`}>
            <span className="hud-stat__glyph">✦</span>
            <span>{sanctuary.heritagePoints}</span>
          </div>
        </div>

        <div className="game-hud__actions">
          <button type="button" className="hud-btn hud-btn--explore" onClick={onExplore} aria-label="Explore for 10 gold">
            <IconExplore size={18} />
            <span className="hud-btn__text">Explore</span>
          </button>
          <button type="button" className="hud-btn hud-btn--menu" onClick={onReset} aria-label="New game">
            ⋯
          </button>
        </div>
      </div>

      <div className="game-hud__row game-hud__row--inventory">
        <FoodRow food={sanctuary.food} />
        <TreatRow treats={sanctuary.treats} />
      </div>

      {overCapacity && (
        <div className="game-hud__alert" role="alert">
          Over capacity — feed your kin!
        </div>
      )}
    </header>
  )
}

function FoodRow({ food }: { food: FoodStock }) {
  return (
    <div className="hud-inventory" aria-label="Food supplies">
      <IconFood size={16} />
      {(Object.keys(food) as (keyof FoodStock)[]).map((key) => (
        <span key={key} className="hud-chip" title={FOOD_LABELS[key]}>
          <span className="hud-chip__abbr">{FOOD_ABBR[key]}</span>
          <span className="hud-chip__val">{food[key]}</span>
        </span>
      ))}
    </div>
  )
}

const FOOD_ABBR: Record<keyof FoodStock, string> = {
  proteinFeed: 'P',
  growthFruit: 'F',
  crystalHerbs: 'H',
}

function TreatRow({ treats }: { treats: TreatStock }) {
  const total = treats.spicyBerry + treats.moonFruit + treats.crystalCandy
  if (total === 0) return null
  return (
    <div className="hud-inventory hud-inventory--treats" aria-label={`${total} treats`}>
      <IconTreat size={16} />
      <span className="hud-chip">
        <span className="hud-chip__val">{total}</span>
      </span>
    </div>
  )
}
