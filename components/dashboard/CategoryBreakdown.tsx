'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CategorySummary } from '@/types/expense'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants'
import { formatCurrency } from '@/utils/formatCurrency'

interface CategoryBreakdownProps {
  summaries: CategorySummary[]
  pieData: { name: string; value: number; color: string }[]
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
        <p className="text-xs font-medium text-gray-500">{payload[0].name}</p>
        <p className="text-sm font-bold text-gray-900">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function CategoryBreakdown({ summaries, pieData }: CategoryBreakdownProps) {
  const hasData = summaries.length > 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900">Spending by Category</h3>
        <p className="text-sm text-gray-400 mt-0.5">All-time breakdown</p>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-48 text-gray-300">
          <p className="text-sm">No categories yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {summaries.map((s) => (
              <div key={s.category} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[s.category] }}
                />
                <span className="text-sm text-gray-600 flex-1">
                  {CATEGORY_ICONS[s.category]} {s.category}
                </span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">
                    {formatCurrency(s.total)}
                  </p>
                  <p className="text-xs text-gray-400">{s.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
