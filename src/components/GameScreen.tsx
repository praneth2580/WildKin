import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  onClose?: () => void
  children: ReactNode
  variant?: 'parchment' | 'dark'
}

export function GameScreen({ title, subtitle, onClose, children, variant = 'parchment' }: Props) {
  return (
    <div className={`game-screen game-screen--${variant}`}>
      <div className="game-screen__frame">
        <div className="game-screen__header">
          <div>
            <h2 className="game-screen__title">{title}</h2>
            {subtitle && <p className="game-screen__subtitle">{subtitle}</p>}
          </div>
          {onClose && (
            <button type="button" className="game-screen__close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>
        <div className="game-screen__body">{children}</div>
      </div>
    </div>
  )
}
