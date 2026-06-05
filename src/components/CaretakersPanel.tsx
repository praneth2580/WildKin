import type { Caretaker, Monster } from '../types/game'

interface Props {
  caretakers: Caretaker[]
  monsters: Monster[]
}

const ROLE_LABELS: Record<string, string> = {
  keeper: 'Keeper',
  breeder: 'Breeder',
  trainer: 'Trainer',
  veterinarian: 'Veterinarian',
  rehabilitation: 'Rehab Specialist',
}

export function CaretakersPanel({ caretakers, monsters }: Props) {
  return (
    <div className="caretakers-panel">
      {caretakers.map((c) => {
        const assigned = monsters.find((m) => m.id === c.assignedMonsterId)
        const topAffinity = Object.entries(c.affinities)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)

        return (
          <div key={c.id} className="caretaker-card">
            <div className="caretaker-card__header">
              <h3>{c.name}</h3>
              <span className="badge">{ROLE_LABELS[c.role]}</span>
            </div>
            <p>Level {c.level} · {c.experience} XP</p>
            <p>
              Assigned: <strong>{assigned?.name ?? 'None'}</strong>
            </p>
            {topAffinity.length > 0 && (
              <div className="affinity-list">
                <span className="affinity-list__title">Top Affinities</span>
                {topAffinity.map(([id, val]) => {
                  const m = monsters.find((mon) => mon.id === id)
                  return (
                    <span key={id} className="affinity-chip">
                      {m?.name ?? 'Released'}: {val}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      <p className="hint">
        Caretakers build affinity with monsters they care for, improving feeding and trust bonuses.
      </p>
    </div>
  )
}
