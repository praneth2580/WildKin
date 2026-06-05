interface IconProps {
  size?: number
}

export function IconDay({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconGold({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.25" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">G</text>
    </svg>
  )
}

export function IconHeart({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-7-4.6-9.5-9.2C.8 8.2 3.2 5 6.5 5c1.8 0 3.4.9 4.3 2.3C11.7 5.9 13.3 5 15.1 5c3.3 0 5.7 3.2 4 6.8C19 16.4 12 21 12 21z" />
    </svg>
  )
}

export function IconPop({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="10" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="15" cy="10" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="15" r="4" fill="currentColor" />
    </svg>
  )
}

export function IconExplore({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20l14-6.5L4 7v13z" fill="currentColor" opacity="0.5" />
      <path d="M4 7l14 6.5L4 20V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IconSanctuary({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 18h16M6 18V10l6-5 6 5v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 18v-4h4v4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IconBreeding({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconBuild({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20h16M8 20V12h8v8M10 12V8h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 4l2 4h-4l2-4z" fill="currentColor" />
    </svg>
  )
}

export function IconCaretakers({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconHeritage({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 4h12v16H6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconFood({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="14" rx="7" ry="5" fill="currentColor" opacity="0.4" />
      <path d="M12 4c-2 4-2 8 0 10M12 4c2 4 2 8 0 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconTreat({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8V5M9 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
