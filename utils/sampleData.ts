import { Expense } from '@/types/expense'
import { format, subDays, subMonths } from 'date-fns'

function d(daysAgo: number) {
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
}

function id() {
  return `sample-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const SAMPLE_EXPENSES: Expense[] = [
  { id: id(), amount: 12.5, category: 'Food', description: 'Lunch at Chipotle', date: d(0), createdAt: new Date().toISOString() },
  { id: id(), amount: 45.0, category: 'Transportation', description: 'Monthly bus pass', date: d(1), createdAt: new Date().toISOString() },
  { id: id(), amount: 89.99, category: 'Shopping', description: 'Amazon order — office supplies', date: d(2), createdAt: new Date().toISOString() },
  { id: id(), amount: 14.99, category: 'Entertainment', description: 'Netflix subscription', date: d(3), createdAt: new Date().toISOString() },
  { id: id(), amount: 120.0, category: 'Bills', description: 'Electricity bill', date: d(5), createdAt: new Date().toISOString() },
  { id: id(), amount: 8.75, category: 'Food', description: 'Coffee & croissant', date: d(5), createdAt: new Date().toISOString() },
  { id: id(), amount: 35.0, category: 'Food', description: 'Grocery run — Whole Foods', date: d(7), createdAt: new Date().toISOString() },
  { id: id(), amount: 22.0, category: 'Transportation', description: 'Uber to airport', date: d(8), createdAt: new Date().toISOString() },
  { id: id(), amount: 15.99, category: 'Entertainment', description: 'Spotify Premium', date: d(10), createdAt: new Date().toISOString() },
  { id: id(), amount: 200.0, category: 'Bills', description: 'Internet bill', date: d(12), createdAt: new Date().toISOString() },
  { id: id(), amount: 67.5, category: 'Shopping', description: 'New running shoes', date: d(14), createdAt: new Date().toISOString() },
  { id: id(), amount: 18.0, category: 'Food', description: 'Dinner takeout', date: d(15), createdAt: new Date().toISOString() },
  { id: id(), amount: 9.99, category: 'Entertainment', description: 'Kindle book', date: d(18), createdAt: new Date().toISOString() },
  { id: id(), amount: 55.0, category: 'Food', description: 'Weekly groceries', date: d(21), createdAt: new Date().toISOString() },
  { id: id(), amount: 30.0, category: 'Transportation', description: 'Gas fill-up', date: d(22), createdAt: new Date().toISOString() },
  { id: id(), amount: 1200.0, category: 'Bills', description: 'Monthly rent', date: d(25), createdAt: new Date().toISOString() },
  { id: id(), amount: 45.5, category: 'Food', description: 'Birthday dinner out', date: d(28), createdAt: new Date().toISOString() },
  { id: id(), amount: 150.0, category: 'Shopping', description: 'Clothing — H&M', date: d(32), createdAt: new Date().toISOString() },
  { id: id(), amount: 12.0, category: 'Food', description: 'Lunch sandwich & drink', date: d(35), createdAt: new Date().toISOString() },
  { id: id(), amount: 80.0, category: 'Entertainment', description: 'Concert tickets', date: d(40), createdAt: new Date().toISOString() },
  { id: id(), amount: 25.0, category: 'Transportation', description: 'Taxi ride', date: d(42), createdAt: new Date().toISOString() },
  { id: id(), amount: 60.0, category: 'Food', description: 'Grocery store', date: d(48), createdAt: new Date().toISOString() },
  { id: id(), amount: 19.99, category: 'Other', description: 'Miscellaneous supplies', date: d(50), createdAt: new Date().toISOString() },
  { id: id(), amount: 300.0, category: 'Bills', description: 'Phone bill (2 months)', date: d(55), createdAt: new Date().toISOString() },
  { id: id(), amount: 40.0, category: 'Food', description: 'Restaurant brunch', date: d(60), createdAt: new Date().toISOString() },
]
