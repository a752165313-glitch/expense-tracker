import { Category } from '@/types/expense'

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Other: '#6b7280',
}

export const CATEGORY_BG_COLORS: Record<Category, string> = {
  Food: '#fff7ed',
  Transportation: '#eff6ff',
  Entertainment: '#f5f3ff',
  Shopping: '#fdf2f8',
  Bills: '#fef2f2',
  Other: '#f9fafb',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📦',
}

export const STORAGE_KEY = 'expense_tracker_expenses'
