'use client'

import { useState } from 'react'
import { Expense } from '@/types/expense'
import { CategoryBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dateUtils'
import { Pencil, Trash2, Calendar } from 'lucide-react'
import { CATEGORY_COLORS } from '@/lib/constants'

interface ExpenseItemProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const color = CATEGORY_COLORS[expense.category]

  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 animate-fade-in">
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ backgroundColor: `${color}15` }}>
        {expense.category === 'Food' && '🍔'}
        {expense.category === 'Transportation' && '🚗'}
        {expense.category === 'Entertainment' && '🎬'}
        {expense.category === 'Shopping' && '🛍️'}
        {expense.category === 'Bills' && '📄'}
        {expense.category === 'Other' && '📦'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{expense.description}</p>
        <div className="flex items-center gap-3 mt-1">
          <CategoryBadge category={expense.category} showIcon={false} size="sm" />
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={11} />
            {formatDate(expense.date)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-semibold text-gray-900 tabular-nums">
          {formatCurrency(expense.amount)}
        </span>

        {!confirmDelete ? (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-xs text-gray-500">Delete?</span>
            <button
              onClick={() => onDelete(expense.id)}
              className="px-2.5 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
