'use client'

import { FilterOptions, Category } from '@/types/expense'
import { CATEGORIES } from '@/lib/constants'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

interface ExpenseFiltersProps {
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  totalResults: number
}

const categoryOptions = [
  { value: 'All', label: 'All Categories' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
]

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'category', label: 'Category' },
]

const sortOrderOptions = [
  { value: 'desc', label: 'Newest / Highest' },
  { value: 'asc', label: 'Oldest / Lowest' },
]

export function ExpenseFilters({ filters, onChange, totalResults }: ExpenseFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const set = (field: keyof FilterOptions) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ ...filters, [field]: e.target.value })
  }

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'All' ||
    filters.dateFrom ||
    filters.dateTo

  const reset = () => {
    onChange({
      search: '',
      category: 'All',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'desc',
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={set('search')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-300 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={clsx(showAdvanced && 'bg-primary-50 border-primary-200 text-primary-700')}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="md" onClick={reset}>
            <X size={16} />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in">
          <Select
            label="Category"
            value={filters.category}
            onChange={set('category')}
            options={categoryOptions}
          />
          <Input
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={set('dateFrom')}
          />
          <Input
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={set('dateTo')}
          />
          <Select
            label="Sort By"
            value={filters.sortBy}
            onChange={set('sortBy')}
            options={sortOptions}
          />
        </div>
      )}

      {totalResults >= 0 && (
        <p className="text-xs text-gray-400">
          {totalResults} {totalResults === 1 ? 'expense' : 'expenses'} found
        </p>
      )}
    </div>
  )
}
