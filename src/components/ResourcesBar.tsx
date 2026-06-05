import { FOOD_LABELS } from '../data/constants'
import type { FoodStock, TreatStock } from '../types/game'

interface Props {
  food: FoodStock
  treats: TreatStock
}

const TREAT_LABELS: Record<keyof TreatStock, string> = {
  spicyBerry: 'Spicy Berry',
  moonFruit: 'Moon Fruit',
  crystalCandy: 'Crystal Candy',
}

export function ResourcesBar({ food, treats }: Props) {
  return (
    <div className="resources-bar">
      <div className="resources-bar__group">
        <span className="resources-bar__title">Food</span>
        {(Object.keys(food) as (keyof FoodStock)[]).map((key) => (
          <span key={key} className="resource-chip">
            {FOOD_LABELS[key]}: <strong>{food[key]}</strong>
          </span>
        ))}
      </div>
      <div className="resources-bar__group">
        <span className="resources-bar__title">Treats</span>
        {(Object.keys(treats) as (keyof TreatStock)[]).map((key) => (
          <span key={key} className="resource-chip resource-chip--treat">
            {TREAT_LABELS[key]}: <strong>{treats[key]}</strong>
          </span>
        ))}
      </div>
    </div>
  )
}
