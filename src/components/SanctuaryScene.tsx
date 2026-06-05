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
  nest: { x: 12, y: 68, label: 'Nest' },
  foodFarm: { x: 28, y: 72, label: 'Farm' },
  breedingDen: { x: 72, y: 68, label: 'Den' },
  trainingGrounds: { x: 85, y: 55, label: 'Training' },
  researchHut: { x: 8, y: 48, label: 'Research' },
  heritageHall: { x: 88, y: 38, label: 'Heritage' },
  rehabilitationCenter: { x: 50, y: 78, label: 'Rehab' },
  tradingPost: { x: 62, y: 42, label: 'Trade' },
}

function monsterPosition(index: number, total: number): { x: number; y: number } {
  const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(total))))
  const row = Math.floor(index / cols)
  const col = index % cols
  const rows = Math.ceil(total / cols)
  const x = 22 + (col / Math.max(cols - 1, 1)) * 56
  const y = 38 + (row / Math.max(rows - 1, 1)) * 22
  const jitter = ((index * 7) % 5) - 2
  return { x: x + jitter * 0.5, y: y + jitter * 0.3 }
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
          <span className="scene-nest__label">Nest · {eggs.length} egg{eggs.length !== 1 ? 's' : ''}</span>
          <div className="scene-nest__eggs">
            {eggs.map((egg, i) => (
              <button
                key={egg.id}
                type="button"
                className={`scene-egg ${egg.isRare ? 'scene-egg--rare' : ''}`}
                style={{ animationDelay: `${i * 0.4}s` }}
                onClick={() => onSelectEgg(egg.id)}
                title="Incubating egg"
              >
                <MonsterSprite dna={egg.dna} size={36} stage="egg" />
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
          >
            <div className="scene-creature__shadow" />
            <div className="scene-creature__sprite">
              <MonsterSprite dna={m.dna} size={72} stage={m.stage} />
            </div>
            <div className="scene-creature__plate">
              <span className="scene-creature__name">{m.name}</span>
              <TrustBar trust={m.trust} behavior={m.behavior} />
            </div>
            {m.behavior !== 'healthy' && (
              <span className={`scene-creature__status scene-creature__status--${m.behavior}`}>!</span>
            )}
          </button>
        )
      })}

      {monsters.length === 0 && eggs.length === 0 && (
        <div className="scene-empty">
          <p>Your sanctuary awaits its first creatures…</p>
          <p className="scene-empty__hint">Explore the wilds or hatch an egg!</p>
        </div>
      )}
    </div>
  )
}
