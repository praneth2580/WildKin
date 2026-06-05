import {
  BEHAVIOR_THRESHOLDS,
  BUILDING_DEFS,
  CARETAKER_NAMES,
  FOOD_BONUS,
  PREFERRED_FOOD_BONUS,
  STAGE_THRESHOLDS,
  TRUST_DECAY,
} from '../data/constants'
import type {
  BehaviorStage,
  BuildingId,
  Egg,
  GameAction,
  GameState,
  LifeStage,
  Monster,
} from '../types/game'
import {
  breedDna,
  createFounderBloodline,
  generateMonsterName,
  randomDna,
  randomPreferredFood,
} from './genetics'
import { uid } from './ids'

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function population(state: GameState): number {
  return state.monsters.length + state.eggs.length
}

function isOverCapacity(state: GameState): boolean {
  return population(state) > state.sanctuary.capacity
}

function getBuilding(state: GameState, id: BuildingId) {
  return state.buildings.find((b) => b.id === id)
}

function updateBehavior(trust: number, current: BehaviorStage): BehaviorStage {
  if (current === 'rampant') return 'rampant'
  if (trust <= BEHAVIOR_THRESHOLDS.rampant) return 'rampant'
  if (trust <= BEHAVIOR_THRESHOLDS.hostile) return 'hostile'
  if (trust <= BEHAVIOR_THRESHOLDS.uncooperative) return 'uncooperative'
  return 'healthy'
}

function advanceStage(stage: LifeStage): LifeStage | null {
  if (stage === 'egg') return 'infant'
  if (stage === 'infant') return 'juvenile'
  if (stage === 'juvenile') return 'adult'
  return null
}

function createMonsterFromEgg(
  egg: Egg,
  bloodlines: GameState['bloodlines'],
): { monster: Monster; bloodlines: GameState['bloodlines'] } {
  const bloodlineId = egg.bloodlineId ?? uid('bloodline')
  let updatedBloodlines = [...bloodlines]

  if (!egg.bloodlineId) {
    const founderId = uid('monster')
    const line = createFounderBloodline(founderId, egg.dna)
    updatedBloodlines = [...updatedBloodlines, { ...line, founderId }]
  } else {
    updatedBloodlines = updatedBloodlines.map((bl) =>
      bl.id === bloodlineId
        ? { ...bl, descendants: bl.descendants + 1, heritageValue: bl.heritageValue + 2 }
        : bl,
    )
  }

  const monster: Monster = {
    id: uid('monster'),
    name: generateMonsterName(egg.dna),
    dna: egg.dna,
    bloodlineId,
    generation: egg.generation,
    stage: 'infant',
    behavior: 'healthy',
    trust: 70,
    ageTicks: 0,
    ticksSinceFed: 0,
    ticksInStage: 0,
    caretakerId: null,
    preferredFood: randomPreferredFood(),
    isMutated: Object.values(egg.dna).some((v) =>
      ['Star', 'Halo', 'Crystal', 'Shadow'].includes(v),
    ),
    canBreed: false,
    inRehab: false,
    hatchedAt: Date.now(),
  }

  return { monster, bloodlines: updatedBloodlines }
}

function tickMonsters(state: GameState): Monster[] {
  const overCap = isOverCapacity(state)

  return state.monsters.map((m) => {
    if (m.inRehab) {
      const rehabChance = 0.15
      if (Math.random() < rehabChance) {
        return {
          ...m,
          inRehab: false,
          behavior: 'healthy',
          trust: 50,
          canBreed: m.stage === 'adult',
        }
      }
      return m
    }

    let trust = m.trust
    let ticksSinceFed = m.ticksSinceFed + 1
    let ticksInStage = m.ticksInStage + 1
    let stage = m.stage

    if (ticksSinceFed >= 2) {
      trust -= TRUST_DECAY
    }
    if (overCap) trust -= 2

    const caretaker = state.caretakers.find((c) => c.assignedMonsterId === m.id)
    if (caretaker) {
      trust += 1 + Math.floor(caretaker.level / 3)
      if (caretaker.role === 'keeper') trust += 1
    }

    trust = clamp(trust, 0, 100)
    const behavior = updateBehavior(trust, m.behavior)

    const threshold = STAGE_THRESHOLDS[stage]
    if (threshold && ticksInStage >= threshold) {
      const next = advanceStage(stage)
      if (next) {
        stage = next
        ticksInStage = 0
      }
    }

    return {
      ...m,
      trust,
      ticksSinceFed,
      ticksInStage,
      stage,
      behavior,
      ageTicks: m.ageTicks + 1,
      canBreed: stage === 'adult' && behavior !== 'rampant' && behavior !== 'hostile',
    }
  })
}

function tickEggs(eggs: Egg[]): Egg[] {
  const nestBonus = 1
  return eggs.map((egg) => ({
    ...egg,
    incubationProgress: Math.min(
      egg.incubationRequired,
      egg.incubationProgress + 1 + nestBonus,
    ),
  }))
}

function produceFood(state: GameState): GameState['sanctuary']['food'] {
  const farm = getBuilding(state, 'foodFarm')
  if (!farm?.built) return state.sanctuary.food

  const level = farm.level
  return {
    proteinFeed: state.sanctuary.food.proteinFeed + 2 * level,
    growthFruit: state.sanctuary.food.growthFruit + 1 * level,
    crystalHerbs: state.sanctuary.food.crystalHerbs + Math.floor(level / 2),
  }
}

function createInitialState(): GameState {
  const starterDna = randomDna()
  const bloodline = createFounderBloodline(uid('monster'), starterDna)

  const starterMonster: Monster = {
    id: uid('monster'),
    name: generateMonsterName(starterDna),
    dna: starterDna,
    bloodlineId: bloodline.id,
    generation: 1,
    stage: 'juvenile',
    behavior: 'healthy',
    trust: 75,
    ageTicks: 3,
    ticksSinceFed: 0,
    ticksInStage: 2,
    caretakerId: null,
    preferredFood: randomPreferredFood(),
    isMutated: false,
    canBreed: false,
    inRehab: false,
    hatchedAt: Date.now(),
  }

  bloodline.founderId = starterMonster.id

  const eggs: Egg[] = Array.from({ length: 3 }, () => {
    const dna = randomDna()
    return {
      id: uid('egg'),
      dna,
      bloodlineId: null,
      generation: 1,
      incubationProgress: 0,
      incubationRequired: 3 + Math.floor(Math.random() * 2),
      isRare: Math.random() < 0.1,
    }
  })

  const buildings = BUILDING_DEFS.map((b) => ({
    ...b,
    built: b.id === 'nest',
    level: b.id === 'nest' ? 1 : 0,
  }))

  const caretakers = [
    {
      id: uid('caretaker'),
      name: CARETAKER_NAMES[0],
      role: 'keeper' as const,
      level: 1,
      experience: 0,
      assignedMonsterId: starterMonster.id,
      affinities: { [starterMonster.id]: 5 },
    },
  ]

  starterMonster.caretakerId = caretakers[0].id

  return {
    sanctuary: {
      name: 'WildKin Sanctuary',
      reputation: 10,
      heritagePoints: 0,
      capacity: 6,
      gold: 100,
      food: { proteinFeed: 15, growthFruit: 8, crystalHerbs: 4 },
      treats: { spicyBerry: 2, moonFruit: 1, crystalCandy: 0 },
      day: 1,
      totalHatched: 0,
      totalBred: 0,
      totalReleased: 0,
    },
    monsters: [starterMonster],
    eggs,
    bloodlines: [bloodline],
    caretakers,
    buildings,
    breedingPair: { parentAId: null, parentBId: null },
    rehabSlots: 0,
    rehabOccupants: [],
    lastTickAt: Date.now(),
  }
}

export function createNewGame(): GameState {
  return createInitialState()
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD':
      return action.state

    case 'RESET':
      return createInitialState()

    case 'TICK': {
      const monsters = tickMonsters(state)
      const eggs = tickEggs(state.eggs)
      const food = produceFood(state)
      let gold = state.sanctuary.gold + 5

      const training = getBuilding(state, 'trainingGrounds')
      const trainedMonsters =
        training?.built
          ? monsters.map((m) =>
              m.behavior === 'healthy' && m.stage !== 'egg'
                ? { ...m, trust: clamp(m.trust + 1, 0, 100) }
                : m,
            )
          : monsters

      return {
        ...state,
        monsters: trainedMonsters,
        eggs,
        sanctuary: {
          ...state.sanctuary,
          day: state.sanctuary.day + 1,
          food,
          gold,
        },
        lastTickAt: Date.now(),
      }
    }

    case 'FEED': {
      const food = state.sanctuary.food
      if (food[action.food] <= 0) return state

      const monster = state.monsters.find((m) => m.id === action.monsterId)
      if (!monster || monster.behavior === 'rampant') return state

      const bonus =
        monster.preferredFood === action.food ? PREFERRED_FOOD_BONUS : FOOD_BONUS

      const caretaker = state.caretakers.find((c) => c.assignedMonsterId === monster.id)
      const affinityBonus = caretaker ? Math.floor((caretaker.affinities[monster.id] ?? 0) / 5) : 0

      return {
        ...state,
        sanctuary: {
          ...state.sanctuary,
          food: { ...food, [action.food]: food[action.food] - 1 },
        },
        monsters: state.monsters.map((m) =>
          m.id === action.monsterId
            ? {
                ...m,
                trust: clamp(m.trust + bonus + affinityBonus, 0, 100),
                ticksSinceFed: 0,
                behavior: updateBehavior(
                  clamp(m.trust + bonus + affinityBonus, 0, 100),
                  m.behavior === 'rampant' ? 'rampant' : 'healthy',
                ),
              }
            : m,
        ),
        caretakers: state.caretakers.map((c) =>
          c.assignedMonsterId === action.monsterId
            ? {
                ...c,
                experience: c.experience + 2,
                affinities: {
                  ...c.affinities,
                  [action.monsterId]: (c.affinities[action.monsterId] ?? 0) + 1,
                },
              }
            : c,
        ),
      }
    }

    case 'GIVE_TREAT': {
      const treats = state.sanctuary.treats
      if (treats[action.treat] <= 0) return state
      const monster = state.monsters.find((m) => m.id === action.monsterId)
      if (!monster || monster.stage === 'egg') return state

      return {
        ...state,
        sanctuary: {
          ...state.sanctuary,
          treats: { ...treats, [action.treat]: treats[action.treat] - 1 },
        },
        monsters: state.monsters.map((m) =>
          m.id === action.monsterId
            ? { ...m, trust: clamp(m.trust + 10, 0, 100) }
            : m,
        ),
      }
    }

    case 'ASSIGN_CARETAKER': {
      return {
        ...state,
        caretakers: state.caretakers.map((c) => {
          if (c.id === action.caretakerId) {
            return { ...c, assignedMonsterId: action.monsterId }
          }
          if (action.monsterId && c.assignedMonsterId === action.monsterId) {
            return { ...c, assignedMonsterId: null }
          }
          return c
        }),
        monsters: state.monsters.map((m) =>
          m.id === action.monsterId
            ? { ...m, caretakerId: action.caretakerId }
            : action.caretakerId && m.caretakerId === action.caretakerId
              ? { ...m, caretakerId: null }
              : m,
        ),
      }
    }

    case 'HATCH_EGG': {
      const nest = getBuilding(state, 'nest')
      if (!nest?.built) return state
      if (population(state) >= state.sanctuary.capacity) return state

      const egg = state.eggs.find((e) => e.id === action.eggId)
      if (!egg || egg.incubationProgress < egg.incubationRequired) return state

      const { monster, bloodlines } = createMonsterFromEgg(egg, state.bloodlines)

      return {
        ...state,
        eggs: state.eggs.filter((e) => e.id !== action.eggId),
        monsters: [...state.monsters, monster],
        bloodlines,
        sanctuary: {
          ...state.sanctuary,
          totalHatched: state.sanctuary.totalHatched + 1,
          reputation: state.sanctuary.reputation + (egg.isRare ? 5 : 1),
        },
      }
    }

    case 'SET_BREEDING_PARENT': {
      const den = getBuilding(state, 'breedingDen')
      if (!den?.built) return state

      const key = action.slot === 'A' ? 'parentAId' : 'parentBId'
      return {
        ...state,
        breedingPair: { ...state.breedingPair, [key]: action.monsterId },
      }
    }

    case 'BREED': {
      const den = getBuilding(state, 'breedingDen')
      if (!den?.built) return state
      if (population(state) >= state.sanctuary.capacity) return state

      const { parentAId, parentBId } = state.breedingPair
      if (!parentAId || !parentBId || parentAId === parentBId) return state

      const parentA = state.monsters.find((m) => m.id === parentAId)
      const parentB = state.monsters.find((m) => m.id === parentBId)
      if (!parentA?.canBreed || !parentB?.canBreed) return state

      const treatBoost =
        state.sanctuary.treats.moonFruit > 0 ? 0.05 : 0

      const { dna, hasMutation } = breedDna(parentA, parentB, treatBoost)
      const generation = Math.max(parentA.generation, parentB.generation) + 1
      const bloodlineId = parentA.bloodlineId

      const egg: Egg = {
        id: uid('egg'),
        dna,
        bloodlineId,
        generation,
        incubationProgress: 0,
        incubationRequired: 4,
        isRare: hasMutation,
      }

      let bloodlines = state.bloodlines.map((bl) =>
        bl.id === bloodlineId
          ? {
              ...bl,
              generation: Math.max(bl.generation, generation),
              mutations: bl.mutations + (hasMutation ? 1 : 0),
              heritageValue: bl.heritageValue + (hasMutation ? 5 : 2),
            }
          : bl,
      )

      if (hasMutation) {
        bloodlines = bloodlines.map((bl) =>
          bl.id === bloodlineId ? { ...bl, mutations: bl.mutations + 1 } : bl,
        )
      }

      const moonFruitUsed = treatBoost > 0 && state.sanctuary.treats.moonFruit > 0

      return {
        ...state,
        eggs: [...state.eggs, egg],
        bloodlines,
        breedingPair: { parentAId: null, parentBId: null },
        sanctuary: {
          ...state.sanctuary,
          totalBred: state.sanctuary.totalBred + 1,
          reputation: state.sanctuary.reputation + 3,
          treats: moonFruitUsed
            ? { ...state.sanctuary.treats, moonFruit: state.sanctuary.treats.moonFruit - 1 }
            : state.sanctuary.treats,
        },
      }
    }

    case 'RELEASE': {
      const monster = state.monsters.find((m) => m.id === action.monsterId)
      if (!monster || monster.behavior === 'rampant') return state

      const heritageGain = 5 + monster.generation * 2

      return {
        ...state,
        monsters: state.monsters.filter((m) => m.id !== action.monsterId),
        caretakers: state.caretakers.map((c) =>
          c.assignedMonsterId === action.monsterId
            ? { ...c, assignedMonsterId: null }
            : c,
        ),
        sanctuary: {
          ...state.sanctuary,
          heritagePoints: state.sanctuary.heritagePoints + heritageGain,
          reputation: state.sanctuary.reputation + 2,
          totalReleased: state.sanctuary.totalReleased + 1,
        },
      }
    }

    case 'BUILD': {
      const building = state.buildings.find((b) => b.id === action.buildingId)
      if (!building || building.built) return state
      if (state.sanctuary.gold < building.cost) return state

      const updates: Partial<GameState> = {}
      if (action.buildingId === 'rehabilitationCenter') {
        updates.rehabSlots = 2
      }
      if (action.buildingId === 'foodFarm') {
        updates.sanctuary = {
          ...state.sanctuary,
          gold: state.sanctuary.gold - building.cost,
          capacity: state.sanctuary.capacity + 1,
        }
      } else {
        updates.sanctuary = {
          ...state.sanctuary,
          gold: state.sanctuary.gold - building.cost,
        }
      }

      return {
        ...state,
        ...updates,
        buildings: state.buildings.map((b) =>
          b.id === action.buildingId ? { ...b, built: true, level: 1 } : b,
        ),
        sanctuary: updates.sanctuary ?? {
          ...state.sanctuary,
          gold: state.sanctuary.gold - building.cost,
        },
      }
    }

    case 'EXPLORE': {
      if (state.sanctuary.gold < 10) return state
      const foundEgg = Math.random() < 0.6
      const dna = randomDna()

      const newEgg: Egg = {
        id: uid('egg'),
        dna,
        bloodlineId: null,
        generation: 1,
        incubationProgress: 0,
        incubationRequired: 3 + Math.floor(Math.random() * 3),
        isRare: Math.random() < 0.15,
      }

      return {
        ...state,
        eggs: foundEgg ? [...state.eggs, newEgg] : state.eggs,
        sanctuary: {
          ...state.sanctuary,
          gold: state.sanctuary.gold - 10,
          food: foundEgg
            ? state.sanctuary.food
            : {
                proteinFeed: state.sanctuary.food.proteinFeed + 3,
                growthFruit: state.sanctuary.food.growthFruit + 2,
                crystalHerbs: state.sanctuary.food.crystalHerbs + 1,
              },
          reputation: state.sanctuary.reputation + (foundEgg ? 2 : 0),
        },
      }
    }

    case 'REHABILITATE': {
      const rehab = getBuilding(state, 'rehabilitationCenter')
      if (!rehab?.built) return state
      if (state.rehabOccupants.length >= state.rehabSlots) return state
      if (state.sanctuary.gold < 25) return state

      const monster = state.monsters.find((m) => m.id === action.monsterId)
      if (!monster || monster.behavior !== 'rampant') return state

      return {
        ...state,
        rehabOccupants: [...state.rehabOccupants, action.monsterId],
        monsters: state.monsters.map((m) =>
          m.id === action.monsterId ? { ...m, inRehab: true } : m,
        ),
        sanctuary: { ...state.sanctuary, gold: state.sanctuary.gold - 25 },
      }
    }

    case 'PUT_DOWN': {
      const monster = state.monsters.find((m) => m.id === action.monsterId)
      if (!monster || monster.behavior !== 'rampant') return state

      return {
        ...state,
        monsters: state.monsters.filter((m) => m.id !== action.monsterId),
        rehabOccupants: state.rehabOccupants.filter((id) => id !== action.monsterId),
      }
    }

    default:
      return state
  }
}
