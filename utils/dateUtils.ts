import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns'

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatMonthYear(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMMM yyyy')
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MM/dd/yyyy')
  } catch {
    return dateStr
  }
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getMonthRange(monthsBack = 0): { start: string; end: string } {
  const date = subMonths(new Date(), monthsBack)
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

export function isInDateRange(dateStr: string, from: string, to: string): boolean {
  try {
    const date = parseISO(dateStr)
    const start = parseISO(from)
    const end = parseISO(to)
    return isWithinInterval(date, { start, end })
  } catch {
    return true
  }
}

export function getLast12Months(): string[] {
  const months: string[] = []
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    months.push(format(date, 'yyyy-MM'))
  }
  return months
}

export function getMonthLabel(yearMonth: string): string {
  try {
    return format(parseISO(`${yearMonth}-01`), 'MMM yy')
  } catch {
    return yearMonth
  }
}
