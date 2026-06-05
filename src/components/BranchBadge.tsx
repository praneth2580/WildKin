import { BRANCH_DESCRIPTIONS, BRANCH_LABELS } from '../data/constants'
import type { BranchType } from '../types/game'

interface Props {
  branch: BranchType
  showDescription?: boolean
}

export function BranchBadge({ branch, showDescription = false }: Props) {
  return (
    <span className={`badge badge--branch badge--branch-${branch}`} title={BRANCH_DESCRIPTIONS[branch]}>
      {BRANCH_LABELS[branch]}
      {showDescription && (
        <span className="badge__desc"> — {BRANCH_DESCRIPTIONS[branch]}</span>
      )}
    </span>
  )
}
