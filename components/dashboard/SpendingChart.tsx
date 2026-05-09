'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { MonthlySummary } from '@/types/expense'
import { formatCurrency } from '@/utils/formatCurrency'

interface SpendingChartProps {
  data: MonthlySummary[]
}

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

export function SpendingChart({ data }: SpendingChartProps) {
  const hasData = data.some((d) => d.total > 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900">Monthly Spending</h3>
        <p className="text-sm text-gray-400 mt-0.5">Last 12 months overview</p>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-48 text-gray-300">
          <p className="text-sm">No spending data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f3ff', radius: 4 }} />
            <Bar
              dataKey="total"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
