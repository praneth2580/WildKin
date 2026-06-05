export type LifeStage = 'egg' | 'infant' | 'juvenile' | 'adult'

export type BehaviorStage = 'healthy' | 'uncooperative' | 'hostile' | 'rampant'

export type CaretakerRole =
  | 'keeper'
  | 'breeder'
  | 'trainer'
  | 'veterinarian'
  | 'rehabilitation'

export type BuildingId =
  | 'nest'
  | 'breedingDen'
  | 'foodFarm'
  | 'trainingGrounds'
  | 'researchHut'
  | 'tradingPost'
  | 'rehabilitationCenter'
  | 'heritageHall'

export type FoodType = 'proteinFeed' | 'growthFruit' | 'crystalHerbs'

export type TreatType = 'spicyBerry' | 'moonFruit' | 'crystalCandy'

export interface DnaTraits {
  body: string
  eyes: string
  mouth: string
  horns: string
  wings: string
  tail: string
  pattern: string
  element: string
  personality: string
}

export interface Bloodline {
  id: string
  name: string
  founderId: string
  generation: number
  descendants: number
  victories: number
  mutations: number
  heritageValue: number
}

export interface Monster {
  id: string
  name: string
  dna: DnaTraits
  bloodlineId: string
  generation: number
  stage: LifeStage
  behavior: BehaviorStage
  trust: number
  ageTicks: number
  ticksSinceFed: number
  ticksInStage: number
  caretakerId: string | null
  preferredFood: FoodType
  isMutated: boolean
  canBreed: boolean
  inRehab: boolean
  hatchedAt: number
}

export interface Egg {
  id: string
  dna: DnaTraits
  bloodlineId: string | null
  generation: number
  incubationProgress: number
  incubationRequired: number
  isRare: boolean
}

export interface Caretaker {
  id: string
  name: string
  role: CaretakerRole
  level: number
  experience: number
  assignedMonsterId: string | null
  affinities: Record<string, number>
}

export interface Building {
  id: BuildingId
  name: string
  description: string
  built: boolean
  level: number
  cost: number
}

export interface FoodStock {
  proteinFeed: number
  growthFruit: number
  crystalHerbs: number
}

export interface TreatStock {
  spicyBerry: number
  moonFruit: number
  crystalCandy: number
}

export interface Sanctuary {
  name: string
  reputation: number
  heritagePoints: number
  capacity: number
  gold: number
  food: FoodStock
  treats: TreatStock
  day: number
  totalHatched: number
  totalBred: number
  totalReleased: number
}

export interface BreedingPair {
  parentAId: string | null
  parentBId: string | null
}

export interface GameState {
  sanctuary: Sanctuary
  monsters: Monster[]
  eggs: Egg[]
  bloodlines: Bloodline[]
  caretakers: Caretaker[]
  buildings: Building[]
  breedingPair: BreedingPair
  rehabSlots: number
  rehabOccupants: string[]
  lastTickAt: number
}

export type GameAction =
  | { type: 'TICK' }
  | { type: 'FEED'; monsterId: string; food: FoodType }
  | { type: 'GIVE_TREAT'; monsterId: string; treat: TreatType }
  | { type: 'ASSIGN_CARETAKER'; monsterId: string; caretakerId: string | null }
  | { type: 'HATCH_EGG'; eggId: string }
  | { type: 'SET_BREEDING_PARENT'; slot: 'A' | 'B'; monsterId: string | null }
  | { type: 'BREED' }
  | { type: 'RELEASE'; monsterId: string }
  | { type: 'BUILD'; buildingId: BuildingId }
  | { type: 'EXPLORE' }
  | { type: 'REHABILITATE'; monsterId: string }
  | { type: 'PUT_DOWN'; monsterId: string }
  | { type: 'RESET' }
  | { type: 'LOAD'; state: GameState }

export type TabId =
  | 'sanctuary'
  | 'monsters'
  | 'breeding'
  | 'caretakers'
  | 'buildings'
  | 'heritage'
