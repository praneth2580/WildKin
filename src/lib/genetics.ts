import { BLOODLINE_SUFFIXES, MUTATION_TRAITS, TRAIT_POOLS } from '../data/constants'
import type { DnaTraits, Monster } from '../types/game'
import { uid } from './ids'

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomDna(): DnaTraits {
  return {
    body: pick(TRAIT_POOLS.body),
    eyes: pick(TRAIT_POOLS.eyes),
    mouth: pick(TRAIT_POOLS.mouth),
    horns: pick(TRAIT_POOLS.horns),
    wings: pick(TRAIT_POOLS.wings),
    tail: pick(TRAIT_POOLS.tail),
    pattern: pick(TRAIT_POOLS.pattern),
    element: pick(TRAIT_POOLS.element),
    personality: pick(TRAIT_POOLS.personality),
  }
}

export function generateMonsterName(dna: DnaTraits): string {
  const syllables = ['ka', 'ri', 'mo', 'the', 'lun', 'vex', 'sol', 'nyx', 'ara', 'fen']
  const a = pick(syllables)
  const b = pick(syllables)
  return `${dna.element.slice(0, 3)}${a}${b}`.replace(/^./, (c) => c.toUpperCase())
}

export function generateBloodlineName(dna: DnaTraits): string {
  const suffix = pick(BLOODLINE_SUFFIXES)
  return `${dna.element}${dna.body}${suffix}`.replace(/\s/g, '')
}

type TraitKey = keyof DnaTraits

function inheritTrait(
  key: TraitKey,
  parentA: DnaTraits,
  parentB: DnaTraits,
  mutationBoost: number,
): { value: string; mutated: boolean } {
  const roll = Math.random()
  const mutationChance = 0.05 + mutationBoost

  if (roll < mutationChance && MUTATION_TRAITS[key]) {
    const pool = MUTATION_TRAITS[key]!
    return { value: pick(pool), mutated: true }
  }

  if (roll < 0.15) {
    return { value: randomDna()[key], mutated: false }
  }

  if (roll < 0.55) {
    return { value: parentA[key], mutated: false }
  }

  return { value: parentB[key], mutated: false }
}

export function breedDna(
  parentA: Monster,
  parentB: Monster,
  treatBoost = 0,
): { dna: DnaTraits; hasMutation: boolean } {
  const keys = Object.keys(TRAIT_POOLS) as TraitKey[]
  const dna = {} as DnaTraits
  let hasMutation = false

  for (const key of keys) {
    const result = inheritTrait(key, parentA.dna, parentB.dna, treatBoost)
    dna[key] = result.value
    if (result.mutated) hasMutation = true
  }

  return { dna, hasMutation }
}

export function randomPreferredFood(): 'proteinFeed' | 'growthFruit' | 'crystalHerbs' {
  const foods = ['proteinFeed', 'growthFruit', 'crystalHerbs'] as const
  return pick([...foods])
}

export function createFounderBloodline(founderId: string, dna: DnaTraits) {
  return {
    id: uid('bloodline'),
    name: generateBloodlineName(dna),
    founderId,
    generation: 1,
    descendants: 0,
    victories: 0,
    mutations: 0,
    heritageValue: 10,
  }
}

export function dnaSummary(dna: DnaTraits): string {
  return `${dna.body} · ${dna.element} · ${dna.personality}`
}
