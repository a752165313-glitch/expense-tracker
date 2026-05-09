'use client'

import { useMemo } from 'react'
import { Expense, ExpenseFormData, FilterOptions, CategorySummary, MonthlySummary, Category } from '@/types/expense'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEY, CATEGORY_COLORS } from '@/lib/constants'
import { getLast12Months, getMonthLabel } from '@/utils/dateUtils'
import { format, parseISO } from 'date-fns'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useExpenses() {
  const [expenses, setExpenses, isLoaded] = useLocalStorage<Expense[]>(STORAGE_KEY, [])

  const addExpense = (data: ExpenseFormData): Expense => {
    const newExpense: Expense = {
      id: generateId(),
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description.trim(),
      date: data.date,
      createdAt: new Date().toISOString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
    return newExpense
  }

  const updateExpense = (id: string, data: ExpenseFormData): void => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              amount: parseFloat(data.amount),
              category: data.category,
              description: data.description.trim(),
              date: data.date,
            }
          : e
      )
    )
  }

  const deleteExpense = (id: string): void => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const getFilteredExpenses = (filters: FilterOptions): Expense[] => {
    return expenses
      .filter((expense) => {
        if (filters.search) {
          const q = filters.search.toLowerCase()
          if (
            !expense.description.toLowerCase().includes(q) &&
            !expense.category.toLowerCase().includes(q)
          ) {
            return false
          }
        }
        if (filters.category !== 'All' && expense.category !== filters.category) return false
        if (filters.dateFrom && expense.date < filters.dateFrom) return false
        if (filters.dateTo && expense.date > filters.dateTo) return false
        return true
      })
      .sort((a, b) => {
        const dir = filters.sortOrder === 'asc' ? 1 : -1
        if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir
        if (filters.sortBy === 'category') return a.category.localeCompare(b.category) * dir
        return a.date.localeCompare(b.date) * dir
      })
  }

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)
    const thisMonth = format(new Date(), 'yyyy-MM')
    const monthlyTotal = expenses
      .filter((e) => e.date.startsWith(thisMonth))
      .reduce((sum, e) => sum + e.amount, 0)
    const lastMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM')
    const lastMonthTotal = expenses
      .filter((e) => e.date.startsWith(lastMonth))
      .reduce((sum, e) => sum + e.amount, 0)
    const monthChange =
      lastMonthTotal > 0 ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

    return { total, monthlyTotal, lastMonthTotal, monthChange, count: expenses.length }
  }, [expenses])

  const categorySummaries = useMemo((): CategorySummary[] => {
    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0)
    const byCategory: Record<string, { total: number; count: number }> = {}
    expenses.forEach((e) => {
      if (!byCategory[e.category]) byCategory[e.category] = { total: 0, count: 0 }
      byCategory[e.category].total += e.amount
      byCategory[e.category].count += 1
    })
    return Object.entries(byCategory)
      .map(([category, { total, count }]) => ({
        category: category as Category,
        total,
        count,
        percentage: totalSpend > 0 ? (total / totalSpend) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total)
  }, [expenses])

  const monthlySummaries = useMemo((): MonthlySummary[] => {
    const months = getLast12Months()
    return months.map((month) => ({
      month: getMonthLabel(month),
      total: expenses
        .filter((e) => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0),
    }))
  }, [expenses])

  const pieData = useMemo(() => {
    return categorySummaries.map((s) => ({
      name: s.category,
      value: s.total,
      color: CATEGORY_COLORS[s.category],
    }))
  }, [categorySummaries])

  return {
    expenses,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    stats,
    categorySummaries,
    monthlySummaries,
    pieData,
  }
}
