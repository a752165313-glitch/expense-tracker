'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { X, FileText, FileJson, Printer, Download, Eye } from 'lucide-react'
import { Expense, Category } from '@/types/expense'
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { filterExpenses, exportAsCSV, exportAsJSON, exportAsPDF } from '@/utils/exportData'
import { clsx } from 'clsx'

type ExportFormat = 'csv' | 'json' | 'pdf'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  expenses: Expense[]
}

const FORMATS: { id: ExportFormat; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'csv', label: 'CSV', icon: <FileText size={22} />, desc: 'Spreadsheet / Excel' },
  { id: 'json', label: 'JSON', icon: <FileJson size={22} />, desc: 'Developer friendly' },
  { id: 'pdf', label: 'PDF', icon: <Printer size={22} />, desc: 'Print-ready report' },
]

export function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [filename, setFilename] = useState('expenses')
  const [isExporting, setIsExporting] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const filtered = useMemo(
    () => filterExpenses(expenses, dateFrom, dateTo, selectedCategories),
    [expenses, dateFrom, dateTo, selectedCategories]
  )

  const previewRows = filtered.slice(0, 5)
  const remaining = filtered.length - previewRows.length

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleExport = async () => {
    if (filtered.length === 0) return
    setIsExporting(true)
    await new Promise((r) => setTimeout(r, 600))
    const name = filename.trim() || 'expenses'
    if (format === 'csv') exportAsCSV(filtered, name)
    else if (format === 'json') exportAsJSON(filtered, name)
    else exportAsPDF(filtered, name)
    setIsExporting(false)
    onClose()
  }

  if (!isOpen) return null

  const exportName = (filename.trim() || 'expenses') + '.' + format

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Export Expenses</h2>
            <p className="text-xs text-gray-400 mt-0.5">{expenses.length} total records available</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Format */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Export Format</p>
            <div className="grid grid-cols-3 gap-3">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={clsx(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    format === f.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700'
                  )}
                >
                  {f.icon}
                  <span className="font-semibold text-sm">{f.label}</span>
                  <span className="text-xs text-gray-400">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Date Range</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(''); setDateTo('') }}
                className="mt-2 text-xs text-primary-600 hover:underline"
              >
                Clear dates
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Categories</p>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-primary-600 hover:underline"
                >
                  Show all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all',
                      active
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <span>{CATEGORY_ICONS[cat]}</span>
                    {cat}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {selectedCategories.length === 0
                ? 'All categories included'
                : `${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'} selected`}
            </p>
          </div>

          {/* Filename */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Filename</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="expenses"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-400 shrink-0">.{format}</span>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye size={14} className="text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Preview</p>
              <span
                className={clsx(
                  'ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full',
                  filtered.length === 0
                    ? 'bg-red-50 text-red-600'
                    : 'bg-emerald-50 text-emerald-700'
                )}
              >
                {filtered.length} record{filtered.length !== 1 ? 's' : ''} will be exported
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <span className="text-2xl mb-2">🔍</span>
                <p className="text-sm">No expenses match the selected filters</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Date', 'Category', 'Amount', 'Description'].map((h) => (
                        <th
                          key={h}
                          className={clsx(
                            'px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide',
                            h === 'Amount' ? 'text-right' : 'text-left'
                          )}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((e) => (
                      <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{e.date}</td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1.5 text-gray-700">
                            <span>{CATEGORY_ICONS[e.category]}</span>
                            {e.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                          ${e.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 truncate max-w-[140px]">
                          {e.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {remaining > 0 && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-center">
                    + {remaining} more record{remaining !== 1 ? 's' : ''} not shown in preview
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            {filtered.length > 0 ? (
              <>
                Exporting{' '}
                <span className="font-medium text-gray-900">{filtered.length}</span>{' '}
                expense{filtered.length !== 1 ? 's' : ''} as{' '}
                <span className="font-medium text-gray-900">{exportName}</span>
              </>
            ) : (
              'No records to export'
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleExport}
              disabled={filtered.length === 0}
              loading={isExporting}
            >
              {!isExporting && <Download size={16} />}
              {isExporting ? 'Exporting...' : `Export ${format.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
