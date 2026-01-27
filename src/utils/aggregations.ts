import { Transaction } from '../types/transaction';
import { isInDateRange, getMonthKey, getYearKey } from './dateHelpers';

export interface AggregatedStats {
  totalSpent: number;
  totalSaved: number;
  totalHoursSpent: number;
  totalHoursSaved: number;
  purchaseCount: number;
  saveCount: number;
}

export function aggregateTransactions(transactions: Transaction[]): AggregatedStats {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'purchased') {
        acc.totalSpent += transaction.itemPrice;
        acc.totalHoursSpent += transaction.hoursOfWork;
        acc.purchaseCount += 1;
      } else {
        acc.totalSaved += transaction.itemPrice;
        acc.totalHoursSaved += transaction.hoursOfWork;
        acc.saveCount += 1;
      }
      return acc;
    },
    {
      totalSpent: 0,
      totalSaved: 0,
      totalHoursSpent: 0,
      totalHoursSaved: 0,
      purchaseCount: 0,
      saveCount: 0,
    }
  );
}

export function filterByDateRange(
  transactions: Transaction[],
  start: Date,
  end: Date
): Transaction[] {
  return transactions.filter((t) => isInDateRange(t.timestamp, start, end));
}

export function aggregateByMonth(
  transactions: Transaction[]
): Record<string, AggregatedStats> {
  const byMonth: Record<string, Transaction[]> = {};

  transactions.forEach((t) => {
    const monthKey = getMonthKey(new Date(t.timestamp));
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = [];
    }
    byMonth[monthKey].push(t);
  });

  const result: Record<string, AggregatedStats> = {};
  Object.keys(byMonth).forEach((monthKey) => {
    result[monthKey] = aggregateTransactions(byMonth[monthKey]);
  });

  return result;
}

export function aggregateByYear(
  transactions: Transaction[]
): Record<string, AggregatedStats> {
  const byYear: Record<string, Transaction[]> = {};

  transactions.forEach((t) => {
    const yearKey = getYearKey(new Date(t.timestamp));
    if (!byYear[yearKey]) {
      byYear[yearKey] = [];
    }
    byYear[yearKey].push(t);
  });

  const result: Record<string, AggregatedStats> = {};
  Object.keys(byYear).forEach((yearKey) => {
    result[yearKey] = aggregateTransactions(byYear[yearKey]);
  });

  return result;
}
