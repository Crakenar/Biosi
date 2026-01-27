import { useMemo } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { getMonthStart, getMonthEnd } from '../utils/dateHelpers';
import { filterByDateRange, aggregateTransactions } from '../utils/aggregations';

export function useMonthlyStats() {
  const { transactions } = useTransactionStore();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = getMonthStart(now);
    const monthEnd = getMonthEnd(now);

    const monthTransactions = filterByDateRange(transactions, monthStart, monthEnd);
    return aggregateTransactions(monthTransactions);
  }, [transactions]);

  return stats;
}
