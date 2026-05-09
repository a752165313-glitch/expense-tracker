'use client'

import Link from 'next/link'
import { Expense } from '@/types/expense'
import { CategoryBadge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dateUtils'
import { ArrowRight } from 'lucide-react'

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recent = expenses.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Recent Expenses</h3>
          <p className="text-sm text-gray-400 mt-0.5">Last 5 transactions</p>
        </div>
        <Link
          href="/expenses"
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-300">
          <p className="text-sm">No expenses yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((expense) => (
            <div key={expense.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <CategoryBadge category={expense.category} showIcon={false} size="sm" />
                  <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 tabular-nums flex-shrink-0">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
