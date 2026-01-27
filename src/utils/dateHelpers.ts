import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  subMonths,
} from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function getMonthStart(date: Date = new Date()): Date {
  return startOfMonth(date);
}

export function getMonthEnd(date: Date = new Date()): Date {
  return endOfMonth(date);
}

export function getYearStart(date: Date = new Date()): Date {
  return startOfYear(date);
}

export function getYearEnd(date: Date = new Date()): Date {
  return endOfYear(date);
}

export function isInDateRange(date: string | Date, start: Date, end: Date): boolean {
  return isWithinInterval(new Date(date), { start, end });
}

export function getLastNMonths(n: number): Date[] {
  const months: Date[] = [];
  const today = new Date();

  for (let i = n - 1; i >= 0; i--) {
    months.push(subMonths(today, i));
  }

  return months;
}

export function getMonthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function getYearKey(date: Date): string {
  return format(date, 'yyyy');
}
