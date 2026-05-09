'use client'

import { AppShell } from '@/components/layout/AppShell'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { RecentExpenses } from '@/components/dashboard/RecentExpenses'
import { useExpenseContext } from '@/context/ExpenseContext'
import { Button } from '@/components/ui/Button'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { Modal } from '@/components/ui/Modal'
import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { SAMPLE_EXPENSES } from '@/utils/sampleData'
import { STORAGE_KEY } from '@/lib/constants'

export default function DashboardPage() {
  const { expenses, isLoaded, stats, categorySummaries, monthlySummaries, pieData, addExpense } =
    useExpenseContext()
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (data: any) => {
    addExpense(data)
    setShowForm(false)
    toast.success('Expense added!')
  }

  const handleLoadSample = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EXPENSES))
    toast.success('Sample data loaded! Refreshing...')
    setTimeout(() => window.location.reload(), 800)
  }

  const today = format(new Date(), 'EEEE, MMMM d')

  if (!isLoaded) {
    return (
      <AppShell title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading your data...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (expenses.length === 0) {
    return (
      <AppShell title="Dashboard" subtitle={today}>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mb-6">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ExpenseAI!</h1>
          <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
            Start tracking your personal expenses to gain insights into your spending habits.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="lg" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Add Your First Expense
            </Button>
            <Button variant="secondary" size="lg" onClick={handleLoadSample}>
              <Sparkles size={18} />
              Load Sample Data
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Sample data helps you explore all features without entering real expenses
          </p>
        </div>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Expense">
          <ExpenseForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </Modal>
      </AppShell>
    )
  }

  return (
    <AppShell title="Dashboard" subtitle={today}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {expenses.length} expenses tracked
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Add Expense
          </Button>
        </div>

        <SummaryCards
          total={stats.total}
          monthlyTotal={stats.monthlyTotal}
          lastMonthTotal={stats.lastMonthTotal}
          monthChange={stats.monthChange}
          count={stats.count}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SpendingChart data={monthlySummaries} />
          </div>
          <CategoryBreakdown summaries={categorySummaries} pieData={pieData} />
        </div>

        <RecentExpenses expenses={expenses} />
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Expense">
        <ExpenseForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      </Modal>
    </AppShell>
  )
}
