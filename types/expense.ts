export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other'

export interface Expense {
  id: string
  amount: number
  category: Category
  description: string
  date: string // ISO date string YYYY-MM-DD
  createdAt: string // ISO datetime string
}

export interface ExpenseFormData {
  amount: string
  category: Category
  description: string
  date: string
}

export interface FilterOptions {
  search: string
  category: Category | 'All'
  dateFrom: string
  dateTo: string
  sortBy: 'date' | 'amount' | 'category'
  sortOrder: 'asc' | 'desc'
}

export interface CategorySummary {
  category: Category
  total: number
  count: number
  percentage: number
}

export interface MonthlySummary {
  month: string
  total: number
}
