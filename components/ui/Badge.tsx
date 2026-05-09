import { Category } from '@/types/expense'
import { CATEGORY_COLORS, CATEGORY_BG_COLORS, CATEGORY_ICONS } from '@/lib/constants'

interface BadgeProps {
  category: Category
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export function CategoryBadge({ category, showIcon = true, size = 'md' }: BadgeProps) {
  const color = CATEGORY_COLORS[category]
  const bg = CATEGORY_BG_COLORS[category]
  const icon = CATEGORY_ICONS[category]

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
      style={{ backgroundColor: bg, color }}
    >
      {showIcon && <span>{icon}</span>}
      {category}
    </span>
  )
}
