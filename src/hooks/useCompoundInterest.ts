import { useMemo } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { useSettingsStore } from '../store/settingsStore';
import { aggregateTransactions } from '../utils/aggregations';
import { calculateCompoundInterest } from '../services/calculations';

export function useCompoundInterest() {
  const { transactions } = useTransactionStore();
  const { settings } = useSettingsStore();

  const projections = useMemo(() => {
    const stats = aggregateTransactions(transactions);
    const principal = stats.totalSaved;
    const rate = settings.compoundInterestRate;

    return {
      tenYear: calculateCompoundInterest(principal, 10, rate),
      twentyYear: calculateCompoundInterest(principal, 20, rate),
      principal,
      rate,
    };
  }, [transactions, settings.compoundInterestRate]);

  return projections;
}
