'use client'

import { AppShell } from '@/components/layout/AppShell'
import { useExpenseContext } from '@/context/ExpenseContext'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants'
import { formatCurrency } from '@/utils/formatCurrency'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { format, parseISO } from 'date-fns'

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { expenses, isLoaded, categorySummaries, monthlySummaries, pieData, stats } =
    useExpenseContext()

  if (!isLoaded) {
    return (
      <AppShell title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </AppShell>
    )
  }

  const topCategory = categorySummaries[0]
  const avgPerExpense = expenses.length > 0 ? stats.total / expenses.length : 0
  const highestExpense = expenses.reduce(
    (max, e) => (e.amount > max ? e.amount : max),
    0
  )

  const categoryBarData = categorySummaries.map((s) => ({
    name: s.category,
    amount: s.total,
    count: s.count,
    color: CATEGORY_COLORS[s.category],
  }))

  return (
    <AppShell title="Analytics" subtitle="Deep dive into your spending patterns">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spending Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Insights from {expenses.length} expenses
          </p>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Avg per Transaction
            </p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgPerExpense)}</p>
            <p className="text-xs text-gray-400 mt-1">across {expenses.length} expenses</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Highest Expense
            </p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(highestExpense)}</p>
            <p className="text-xs text-gray-400 mt-1">single transaction</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Top Category
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {topCategory
                ? `${CATEGORY_ICONS[topCategory.category]} ${topCategory.category}`
                : '—'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {topCategory ? formatCurrency(topCategory.total) : 'No data yet'}
            </p>
          </div>
        </div>

        {/* Monthly trend */}
        <SpendingChart data={monthlySummaries} />

        {/* Category bar chart */}
        {categoryBarData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900">Spending by Category</h3>
              <p className="text-sm text-gray-400 mt-0.5">Total amount per category</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={categoryBarData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 80, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f3ff' }} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {categoryBarData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie breakdown */}
        <CategoryBreakdown summaries={categorySummaries} pieData={pieData} />

        {expenses.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No data to analyze yet</p>
            <p className="text-sm mt-1">Add some expenses to see your analytics</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
