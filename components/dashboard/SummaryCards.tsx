'use client'

import { TrendingUp, TrendingDown, Receipt, DollarSign, Calendar, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { clsx } from 'clsx'

interface SummaryCardsProps {
  total: number
  monthlyTotal: number
  lastMonthTotal: number
  monthChange: number
  count: number
}

export function SummaryCards({
  total,
  monthlyTotal,
  lastMonthTotal,
  monthChange,
  count,
}: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Spending',
      value: formatCurrency(total),
      sub: `${count} expenses`,
      icon: DollarSign,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      trend: null,
    },
    {
      label: 'This Month',
      value: formatCurrency(monthlyTotal),
      sub:
        monthChange !== 0
          ? `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}% vs last month`
          : 'Same as last month',
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: monthChange,
    },
    {
      label: 'Last Month',
      value: formatCurrency(lastMonthTotal),
      sub: 'Previous month total',
      icon: Receipt,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: null,
    },
    {
      label: 'Daily Average',
      value: formatCurrency(monthlyTotal > 0 ? monthlyTotal / new Date().getDate() : 0),
      sub: 'This month',
      icon: ArrowUpRight,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      trend: null,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', card.iconBg)}>
              <card.icon size={20} className={card.iconColor} />
            </div>
            {card.trend !== null && card.trend !== 0 && (
              <span
                className={clsx(
                  'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
                  card.trend > 0
                    ? 'text-red-600 bg-red-50'
                    : 'text-green-600 bg-green-50'
                )}
              >
                {card.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(card.trend).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{card.value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          <p className="text-xs text-gray-400 mt-2">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
