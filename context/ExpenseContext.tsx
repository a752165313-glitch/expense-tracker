'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Expense, ExpenseFormData, FilterOptions } from '@/types/expense'
import { useExpenses } from '@/hooks/useExpenses'
import { CategorySummary, MonthlySummary } from '@/types/expense'

interface ExpenseContextValue {
  expenses: Expense[]
  isLoaded: boolean
  addExpense: (data: ExpenseFormData) => Expense
  updateExpense: (id: string, data: ExpenseFormData) => void
  deleteExpense: (id: string) => void
  getFilteredExpenses: (filters: FilterOptions) => Expense[]
  stats: {
    total: number
    monthlyTotal: number
    lastMonthTotal: number
    monthChange: number
    count: number
  }
  categorySummaries: CategorySummary[]
  monthlySummaries: MonthlySummary[]
  pieData: { name: string; value: number; color: string }[]
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null)

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const value = useExpenses()
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export function useExpenseContext() {
  const ctx = useContext(ExpenseContext)
  if (!ctx) throw new Error('useExpenseContext must be used within ExpenseProvider')
  return ctx
}
