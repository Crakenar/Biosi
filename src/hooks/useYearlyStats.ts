import { useMemo } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { getYearStart, getYearEnd } from '../utils/dateHelpers';
import { filterByDateRange, aggregateTransactions } from '../utils/aggregations';

export function useYearlyStats() {
  const { transactions } = useTransactionStore();

  const stats = useMemo(() => {
    const now = new Date();
    const yearStart = getYearStart(now);
    const yearEnd = getYearEnd(now);

    const yearTransactions = filterByDateRange(transactions, yearStart, yearEnd);
    return aggregateTransactions(yearTransactions);
  }, [transactions]);

  return stats;
}
