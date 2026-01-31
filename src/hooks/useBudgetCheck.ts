import { useEffect } from 'react';
import { useBudgetStore } from '../store/budgetStore';
import { useTransactionStore } from '../store/transactionStore';
import { useUserStore } from '../store/userStore';
import NotificationService from '../services/notifications';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  isWithinInterval,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from 'date-fns';

export function useBudgetCheck() {
  const { budgets } = useBudgetStore();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

  useEffect(() => {
    const checkBudgets = () => {
      const now = new Date();

      budgets.forEach((budget) => {
        if (!budget.enabled) return;

        let periodStart: Date;
        let periodEnd: Date;

        switch (budget.period) {
          case 'daily':
            periodStart = startOfDay(now);
            periodEnd = endOfDay(now);
            break;
          case 'weekly':
            periodStart = startOfWeek(now, { weekStartsOn: 1 });
            periodEnd = endOfWeek(now, { weekStartsOn: 1 });
            break;
          case 'monthly':
            periodStart = startOfMonth(now);
            periodEnd = endOfMonth(now);
            break;
        }

        const periodTransactions = transactions.filter(
          (t) =>
            t.type === 'purchased' &&
            isWithinInterval(new Date(t.timestamp), { start: periodStart, end: periodEnd })
        );

        const totalSpent = periodTransactions.reduce((sum, t) => sum + t.itemPrice, 0);
        const percentage = (totalSpent / budget.amount) * 100;

        if (percentage >= budget.alertThreshold) {
          const periodName =
            budget.period === 'daily'
              ? 'today'
              : budget.period === 'weekly'
              ? 'this week'
              : 'this month';

          NotificationService.scheduleBudgetAlert(
            budget.id,
            '⚠️ Budget Alert',
            `You've spent ${percentage.toFixed(0)}% of your ${periodName}'s budget (${
              user?.currency || '$'
            }${totalSpent.toFixed(2)} / ${user?.currency || '$'}${budget.amount})`
          );
        }
      });
    };

    checkBudgets();
  }, [budgets, transactions, user]);
}
