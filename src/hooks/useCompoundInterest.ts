import { useMemo } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { aggregateTransactions } from '../utils/aggregations';
import { calculateCompoundInterest } from '../services/calculations';

export function useCompoundInterest() {
  const { transactions } = useTransactionStore();

  const projections = useMemo(() => {
    const stats = aggregateTransactions(transactions);
    const principal = stats.totalSaved;

    return {
      tenYear: calculateCompoundInterest(principal, 10),
      twentyYear: calculateCompoundInterest(principal, 20),
      principal,
    };
  }, [transactions]);

  return projections;
}
