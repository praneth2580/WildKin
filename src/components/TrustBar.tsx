interface Props {
  trust: number
  behavior: string
}

const BEHAVIOR_COLORS: Record<string, string> = {
  healthy: 'var(--trust-good)',
  uncooperative: 'var(--trust-warn)',
  hostile: 'var(--trust-bad)',
  rampant: 'var(--trust-critical)',
}

export function TrustBar({ trust, behavior }: Props) {
  const color = BEHAVIOR_COLORS[behavior] ?? BEHAVIOR_COLORS.healthy

  return (
    <div className="trust-bar">
      <div className="trust-bar__track">
        <div
          className="trust-bar__fill"
          style={{ width: `${trust}%`, background: color }}
        />
      </div>
      <span className="trust-bar__label">{trust}%</span>
    </div>
  )
}
