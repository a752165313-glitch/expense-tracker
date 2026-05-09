'use client'

import { useState, useEffect } from 'react'
import { Expense, ExpenseFormData, Category } from '@/types/expense'
import { CATEGORIES } from '@/lib/constants'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { getTodayISO } from '@/utils/dateUtils'

interface ExpenseFormProps {
  initialData?: Expense
  onSubmit: (data: ExpenseFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

interface FormErrors {
  amount?: string
  category?: string
  description?: string
  date?: string
}

const defaultForm: ExpenseFormData = {
  amount: '',
  category: 'Food',
  description: '',
  date: getTodayISO(),
}

export function ExpenseForm({ initialData, onSubmit, onCancel, isLoading }: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseFormData>(defaultForm)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (initialData) {
      setForm({
        amount: String(initialData.amount),
        category: initialData.category,
        description: initialData.description,
        date: initialData.date,
      })
    } else {
      setForm({ ...defaultForm, date: getTodayISO() })
    }
    setErrors({})
  }, [initialData])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    const amount = parseFloat(form.amount)
    if (!form.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0'
    } else if (amount > 1_000_000) {
      newErrors.amount = 'Amount cannot exceed $1,000,000'
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (form.description.trim().length < 2) {
      newErrors.description = 'Description must be at least 2 characters'
    }
    if (!form.date) {
      newErrors.date = 'Please select a date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(form)
    }
  }

  const set = (field: keyof ExpenseFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={set('amount')}
              className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.amount
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
        </div>

        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={set('date')}
          error={errors.date}
          max={getTodayISO()}
        />
      </div>

      <Select
        label="Category"
        value={form.category}
        onChange={set('category')}
        options={categoryOptions}
        error={errors.category}
      />

      <Input
        label="Description"
        type="text"
        placeholder="What did you spend on?"
        value={form.description}
        onChange={set('description')}
        error={errors.description}
        maxLength={100}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isLoading} className="flex-1">
          {initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  )
}
