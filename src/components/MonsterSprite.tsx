import type { DnaTraits } from '../types/game'

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#e85d4a',
  Water: '#4a9fd4',
  Earth: '#8b7355',
  Lightning: '#d4b84a',
  Shadow: '#5a4a7a',
  Flora: '#5ab87a',
}

interface Props {
  dna: DnaTraits
  size?: number
  stage?: string
}

export function MonsterSprite({ dna, size = 80, stage }: Props) {
  const color = ELEMENT_COLORS[dna.element] ?? '#7a8a6a'
  const hasWings = dna.wings !== 'None'
  const hasHorns = dna.horns !== 'None'
  const isEgg = stage === 'egg'

  if (isEgg) {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
        <ellipse cx="40" cy="48" rx="22" ry="28" fill="#f5e6c8" stroke="#c4a882" strokeWidth="2" />
        <ellipse cx="40" cy="38" rx="14" ry="18" fill="#fff8ee" opacity="0.6" />
        <circle cx="32" cy="42" r="2" fill="#8b7355" opacity="0.4" />
        <circle cx="48" cy="50" r="1.5" fill="#8b7355" opacity="0.3" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
      {hasWings && (
        <>
          <ellipse cx="18" cy="42" rx="14" ry="20" fill={color} opacity="0.5" transform="rotate(-15 18 42)" />
          <ellipse cx="62" cy="42" rx="14" ry="20" fill={color} opacity="0.5" transform="rotate(15 62 42)" />
        </>
      )}
      <ellipse cx="40" cy="52" rx="20" ry="18" fill={color} />
      <circle cx="40" cy="32" r="18" fill={color} filter="brightness(1.1)" />
      {hasHorns && (
        <>
          <polygon points="28,18 26,6 32,16" fill={dna.horns === 'Crystal' ? '#a8d8ea' : '#d4c4a8'} />
          <polygon points="52,18 54,6 48,16" fill={dna.horns === 'Crystal' ? '#a8d8ea' : '#d4c4a8'} />
        </>
      )}
      <circle cx="33" cy="30" r={dna.eyes === 'Star' ? 4 : 3} fill={dna.eyes === 'Glow' ? '#fffacd' : '#2a2a2a'} />
      <circle cx="47" cy="30" r={dna.eyes === 'Star' ? 4 : 3} fill={dna.eyes === 'Glow' ? '#fffacd' : '#2a2a2a'} />
      {dna.eyes === 'Star' && (
        <>
          <polygon points="33,26 34,30 33,34 32,30" fill="#ffd700" />
          <polygon points="47,26 48,30 47,34 46,30" fill="#ffd700" />
        </>
      )}
      <ellipse cx="40" cy="38" rx="4" ry="2" fill="#1a1a1a" opacity="0.6" />
      <ellipse cx="40" cy="62" rx="8" ry="5" fill={color} filter="brightness(0.85)" />
    </svg>
  )
}
