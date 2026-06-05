import { BLOODLINE_SUFFIXES, MUTATION_TRAITS, TRAIT_POOLS, emptyBranchCounts } from '../data/constants'
import type { BranchCounts, BranchType, DnaTraits, Monster } from '../types/game'
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
type TraitSource = 'parentA' | 'parentB' | 'random' | 'mutation'

function inheritTrait(
  key: TraitKey,
  parentA: DnaTraits,
  parentB: DnaTraits,
  mutationBoost: number,
): { value: string; source: TraitSource } {
  const roll = Math.random()
  const mutationChance = 0.05 + mutationBoost

  if (roll < mutationChance && MUTATION_TRAITS[key]) {
    const pool = MUTATION_TRAITS[key]!
    return { value: pick(pool), source: 'mutation' }
  }

  if (roll < 0.15) {
    return { value: randomDna()[key], source: 'random' }
  }

  if (roll < 0.55) {
    return { value: parentA[key], source: 'parentA' }
  }

  return { value: parentB[key], source: 'parentB' }
}

export function resolveBranchType(counts: Record<TraitSource, number>): BranchType {
  if (counts.mutation > 0) return 'mutation'
  if (counts.random >= 3) return 'recessive'
  if (counts.parentA >= counts.parentB + 3) return 'dominant'
  if (counts.parentB >= counts.parentA + 3) return 'recessive'
  return 'mainline'
}

export function breedDna(
  parentA: Monster,
  parentB: Monster,
  treatBoost = 0,
): { dna: DnaTraits; hasMutation: boolean; branchType: BranchType } {
  const keys = Object.keys(TRAIT_POOLS) as TraitKey[]
  const dna = {} as DnaTraits
  const sources: Record<TraitSource, number> = {
    parentA: 0,
    parentB: 0,
    random: 0,
    mutation: 0,
  }

  for (const key of keys) {
    const result = inheritTrait(key, parentA.dna, parentB.dna, treatBoost)
    dna[key] = result.value
    sources[result.source] += 1
  }

  const branchType = resolveBranchType(sources)
  const hasMutation = branchType === 'mutation'

  return { dna, hasMutation, branchType }
}

export function randomPreferredFood(): 'proteinFeed' | 'growthFruit' | 'crystalHerbs' {
  const foods = ['proteinFeed', 'growthFruit', 'crystalHerbs'] as const
  return pick([...foods])
}

export function createFounderBloodline(founderId: string, dna: DnaTraits) {
  const branchCounts = emptyBranchCounts()
  branchCounts.founder = 1
  return {
    id: uid('bloodline'),
    name: generateBloodlineName(dna),
    founderId,
    generation: 1,
    descendants: 0,
    victories: 0,
    mutations: 0,
    heritageValue: 10,
    branchCounts,
  }
}

export function incrementBranchCount(counts: BranchCounts, branch: BranchType): BranchCounts {
  return { ...counts, [branch]: counts[branch] + 1 }
}

export function dnaSummary(dna: DnaTraits): string {
  return `${dna.body} · ${dna.element} · ${dna.personality}`
}
