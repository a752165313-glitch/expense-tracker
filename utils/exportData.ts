import { Expense, Category } from '@/types/expense'
import { CATEGORY_ICONS } from '@/lib/constants'

export function filterExpenses(
  expenses: Expense[],
  dateFrom: string,
  dateTo: string,
  categories: Category[]
): Expense[] {
  return expenses.filter((e) => {
    if (dateFrom && e.date < dateFrom) return false
    if (dateTo && e.date > dateTo) return false
    if (categories.length > 0 && !categories.includes(e.category)) return false
    return true
  })
}

export function exportAsCSV(expenses: Expense[], filename: string): void {
  const headers = ['Date', 'Category', 'Amount', 'Description']
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    `"${e.description.replace(/"/g, '""')}"`,
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  triggerDownload(csv, `${filename}.csv`, 'text/csv;charset=utf-8;')
}

export function exportAsJSON(expenses: Expense[], filename: string): void {
  const data = expenses.map(({ date, category, amount, description }) => ({
    date,
    category,
    amount,
    description,
  }))
  triggerDownload(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json')
}

export function exportAsPDF(expenses: Expense[], filename: string): void {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const rows = expenses
    .map(
      (e) => `
      <tr>
        <td>${e.date}</td>
        <td>${CATEGORY_ICONS[e.category]} ${e.category}</td>
        <td class="amount">$${e.amount.toFixed(2)}</td>
        <td>${e.description}</td>
      </tr>`
    )
    .join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${filename}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #111827; }
    .header { margin-bottom: 28px; }
    h1 { font-size: 24px; font-weight: 700; color: #111827; }
    .meta { color: #6b7280; font-size: 13px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 16px; }
    th { background: #f9fafb; text-align: left; padding: 10px 14px; font-weight: 600; color: #374151;
         border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; color: #374151; }
    td.amount { font-weight: 600; color: #111827; }
    .footer { margin-top: 20px; display: flex; justify-content: flex-end; }
    .total-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
                 padding: 12px 20px; text-align: right; }
    .total-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .total-value { font-size: 20px; font-weight: 700; color: #111827; margin-top: 2px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${filename}</h1>
    <p class="meta">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; ${expenses.length} record${expenses.length !== 1 ? 's' : ''}</p>
  </div>
  <table>
    <thead>
      <tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    <div class="total-box">
      <div class="total-label">Total</div>
      <div class="total-value">$${total.toFixed(2)}</div>
    </div>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
