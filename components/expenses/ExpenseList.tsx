'use client'

import { useState } from 'react'
import { Expense, ExpenseFormData, FilterOptions } from '@/types/expense'
import { ExpenseItem } from './ExpenseItem'
import { ExpenseFilters } from './ExpenseFilters'
import { ExpenseForm } from './ExpenseForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Plus, Download, Receipt } from 'lucide-react'
import { exportToCSV } from '@/utils/exportCSV'
import toast from 'react-hot-toast'

interface ExpenseListProps {
  expenses: Expense[]
  filteredExpenses: Expense[]
  filters: FilterOptions
  onFiltersChange: (f: FilterOptions) => void
  onAdd: (data: ExpenseFormData) => void
  onEdit: (id: string, data: ExpenseFormData) => void
  onDelete: (id: string) => void
}

export function ExpenseList({
  expenses,
  filteredExpenses,
  filters,
  onFiltersChange,
  onAdd,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const handleAdd = (data: ExpenseFormData) => {
    onAdd(data)
    setShowForm(false)
    toast.success('Expense added!')
  }

  const handleEdit = (data: ExpenseFormData) => {
    if (editingExpense) {
      onEdit(editingExpense.id, data)
      setEditingExpense(null)
      toast.success('Expense updated!')
    }
  }

  const handleDelete = (id: string) => {
    onDelete(id)
    toast.success('Expense deleted')
  }

  const handleExport = () => {
    if (filteredExpenses.length === 0) {
      toast.error('No expenses to export')
      return
    }
    exportToCSV(filteredExpenses)
    toast.success(`Exported ${filteredExpenses.length} expenses`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500">{expenses.length} total expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={handleExport}>
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button variant="primary" size="md" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
        </div>
      </div>

      <ExpenseFilters
        filters={filters}
        onChange={onFiltersChange}
        totalResults={filteredExpenses.length}
      />

      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Receipt size={28} className="text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">No expenses found</p>
            <p className="text-sm text-gray-400 mt-1">
              {expenses.length === 0
                ? 'Add your first expense to get started'
                : 'Try adjusting your filters'}
            </p>
            {expenses.length === 0 && (
              <Button
                variant="primary"
                size="md"
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Add Expense
              </Button>
            )}
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        <ExpenseForm
          initialData={editingExpense || undefined}
          onSubmit={handleEdit}
          onCancel={() => setEditingExpense(null)}
        />
      </Modal>
    </div>
  )
}
