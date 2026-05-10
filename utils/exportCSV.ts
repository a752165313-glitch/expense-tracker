import { Expense } from '@/types/expense'
import { formatDate } from './dateUtils'
import { formatCurrency } from './formatCurrency'

export function exportToCSV(expenses: Expense[], filename = 'expenses'): void {
  const headers = ['Date', 'Category', 'Amount', 'Description']
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    e.amount.toFixed(2),
    `"${e.description.replace(/"/g, '""')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
