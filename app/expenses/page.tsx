'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { useExpenseContext } from '@/context/ExpenseContext'
import { FilterOptions } from '@/types/expense'

const defaultFilters: FilterOptions = {
  search: '',
  category: 'All',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortOrder: 'desc',
}

export default function ExpensesPage() {
  const { expenses, isLoaded, addExpense, updateExpense, deleteExpense, getFilteredExpenses } =
    useExpenseContext()
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)

  const filteredExpenses = getFilteredExpenses(filters)

  if (!isLoaded) {
    return (
      <AppShell title="Expenses">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Expenses" subtitle="Manage your spending">
      <ExpenseList
        expenses={expenses}
        filteredExpenses={filteredExpenses}
        filters={filters}
        onFiltersChange={setFilters}
        onAdd={addExpense}
        onEdit={updateExpense}
        onDelete={deleteExpense}
      />
    </AppShell>
  )
}
