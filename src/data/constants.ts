import type { Building, DnaTraits, FoodType } from '../types/game'

export const SAVE_KEY = 'wildkin-save-v1'

export const TRAIT_POOLS: Record<keyof DnaTraits, string[]> = {
  body: ['Wolf', 'Drake', 'Moth', 'Bloom', 'Stone', 'Wisp'],
  eyes: ['Round', 'Star', 'Glow', 'Sharp', 'Sleepy', 'Prism'],
  mouth: ['Grin', 'Fangs', 'Beak', 'Gentle', 'None', 'Whistle'],
  horns: ['None', 'Spiral', 'Crystal', 'Halo', 'Thorn', 'Antler'],
  wings: ['None', 'Feather', 'Membrane', 'Crystal', 'Shadow', 'Bloom'],
  tail: ['Bush', 'Serpent', 'Crystal', 'Shadow', 'Flag', 'Plume'],
  pattern: ['Solid', 'Spotted', 'Striped', 'Gradient', 'Mosaic', 'Shimmer'],
  element: ['Fire', 'Water', 'Earth', 'Lightning', 'Shadow', 'Flora'],
  personality: ['Curious', 'Bold', 'Gentle', 'Mischievous', 'Stoic', 'Playful'],
}

export const MUTATION_TRAITS: Partial<Record<keyof DnaTraits, string[]>> = {
  eyes: ['Star'],
  horns: ['Halo', 'Crystal'],
  wings: ['Crystal', 'Shadow'],
  tail: ['Crystal', 'Shadow'],
}

export const STAGE_THRESHOLDS: Record<string, number> = {
  egg: 3,
  infant: 5,
  juvenile: 8,
}

export const FOOD_LABELS: Record<FoodType, string> = {
  proteinFeed: 'Protein Feed',
  growthFruit: 'Growth Fruit',
  crystalHerbs: 'Crystal Herbs',
}

export const FOOD_BONUS = 15
export const PREFERRED_FOOD_BONUS = 25
export const TRUST_DECAY = 3
export const CARETAKER_TRUST_BONUS = 1
export const TICK_MS = 4000

export const BEHAVIOR_THRESHOLDS = {
  uncooperative: 40,
  hostile: 20,
  rampant: 5,
}

export const BUILDING_DEFS: Omit<Building, 'built' | 'level'>[] = [
  {
    id: 'nest',
    name: 'Nest',
    description: 'Incubate eggs. Required for hatching.',
    cost: 0,
  },
  {
    id: 'foodFarm',
    name: 'Food Farm',
    description: 'Produces food each day.',
    cost: 50,
  },
  {
    id: 'breedingDen',
    name: 'Breeding Den',
    description: 'Allows adult monsters to breed.',
    cost: 80,
  },
  {
    id: 'trainingGrounds',
    name: 'Training Grounds',
    description: 'Improves battle readiness and trust.',
    cost: 100,
  },
  {
    id: 'researchHut',
    name: 'Research Hut',
    description: 'Reveals genetic insights over time.',
    cost: 120,
  },
  {
    id: 'heritageHall',
    name: 'Heritage Hall',
    description: 'Records bloodline history and achievements.',
    cost: 150,
  },
  {
    id: 'rehabilitationCenter',
    name: 'Rehabilitation Center',
    description: 'Recover rampant monsters. 2 slots.',
    cost: 200,
  },
  {
    id: 'tradingPost',
    name: 'Trading Post',
    description: 'Future local player trading hub.',
    cost: 250,
  },
]

export const CARETAKER_NAMES = [
  'Mira', 'Thorn', 'Elara', 'Kael', 'Sable', 'Rowan', 'Fenn', 'Lyra',
]

export const BLOODLINE_SUFFIXES = [
  'fang', 'wing', 'scale', 'bloom', 'storm', 'glow', 'claw', 'veil',
]
