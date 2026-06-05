import type { Building, Egg, Monster } from '../types/game'
import { MonsterSprite } from './MonsterSprite'
import { TrustBar } from './TrustBar'

interface Props {
  monsters: Monster[]
  eggs: Egg[]
  buildings: Building[]
  selectedId: string | null
  onSelectMonster: (id: string) => void
  onSelectEgg: (id: string) => void
}

const BUILDING_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  nest: { x: 14, y: 70, label: 'Nest' },
  foodFarm: { x: 30, y: 74, label: 'Farm' },
  breedingDen: { x: 70, y: 70, label: 'Den' },
  trainingGrounds: { x: 82, y: 58, label: 'Train' },
  researchHut: { x: 10, y: 52, label: 'R&D' },
  heritageHall: { x: 86, y: 42, label: 'Hall' },
  rehabilitationCenter: { x: 50, y: 80, label: 'Rehab' },
  tradingPost: { x: 60, y: 46, label: 'Trade' },
}

function monsterPosition(index: number, total: number): { x: number; y: number } {
  const cols = total <= 2 ? total : total <= 4 ? 2 : 3
  const row = Math.floor(index / cols)
  const col = index % cols
  const rows = Math.ceil(total / cols)
  const xPad = 18
  const xSpan = 64
  const yStart = 32
  const ySpan = 28
  const x = xPad + (col / Math.max(cols - 1, 1)) * xSpan
  const y = yStart + (row / Math.max(rows - 1, 1)) * ySpan
  const jitter = ((index * 7) % 5) - 2
  return { x: x + jitter * 0.4, y: y + jitter * 0.25 }
}

export function SanctuaryScene({
  monsters,
  eggs,
  buildings,
  selectedId,
  onSelectMonster,
  onSelectEgg,
}: Props) {
  const builtBuildings = buildings.filter((b) => b.built)

  return (
    <div className="sanctuary-scene">
      <div className="sanctuary-scene__sky" />
      <div className="sanctuary-scene__mountains" />
      <div className="sanctuary-scene__trees sanctuary-scene__trees--left" />
      <div className="sanctuary-scene__trees sanctuary-scene__trees--right" />
      <div className="sanctuary-scene__ground" />
      <div className="sanctuary-scene__path" />

      {builtBuildings.map((b) => {
        const pos = BUILDING_POSITIONS[b.id]
        if (!pos) return null
        return (
          <div
            key={b.id}
            className="scene-building"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={b.name}
          >
            <div className="scene-building__roof" />
            <div className="scene-building__body" />
            <span className="scene-building__label">{pos.label}</span>
          </div>
        )
      })}

      {eggs.length > 0 && (
        <div className="scene-nest">
          <span className="scene-nest__label">
            {eggs.length} egg{eggs.length !== 1 ? 's' : ''}
          </span>
          <div className="scene-nest__eggs">
            {eggs.map((egg, i) => (
              <button
                key={egg.id}
                type="button"
                className={`scene-egg ${egg.isRare ? 'scene-egg--rare' : ''}`}
                style={{ animationDelay: `${i * 0.4}s` }}
                onClick={() => onSelectEgg(egg.id)}
                aria-label={egg.isRare ? 'Rare egg' : 'Incubating egg'}
              >
                <MonsterSprite dna={egg.dna} size={40} stage="egg" />
              </button>
            ))}
          </div>
        </div>
      )}

      {monsters.map((m, i) => {
        const pos = monsterPosition(i, monsters.length)
        return (
          <button
            key={m.id}
            type="button"
            className={`scene-creature scene-creature--${m.behavior} ${selectedId === m.id ? 'scene-creature--selected' : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${(i % 5) * 0.6}s`,
            }}
            onClick={() => onSelectMonster(m.id)}
            aria-label={`${m.name}, trust ${m.trust} percent`}
          >
            <div className="scene-creature__shadow" />
            <div className="scene-creature__sprite">
              <MonsterSprite dna={m.dna} size={64} stage={m.stage} />
            </div>
            <div className="scene-creature__plate">
              <span className="scene-creature__name">{m.name}</span>
              <TrustBar trust={m.trust} behavior={m.behavior} />
            </div>
            {m.behavior !== 'healthy' && (
              <span className={`scene-creature__status scene-creature__status--${m.behavior}`} aria-hidden>!</span>
            )}
          </button>
        )
      })}

      {monsters.length === 0 && eggs.length === 0 && (
        <div className="scene-empty">
          <p>Your sanctuary awaits…</p>
          <p className="scene-empty__hint">Tap Explore or hatch an egg</p>
        </div>
      )}
    </div>
  )
}
