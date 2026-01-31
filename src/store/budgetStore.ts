import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage';
import { Budget } from '../types/budget';

interface BudgetStore {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  toggleBudget: (id: string) => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      budgets: [],
      addBudget: (budget) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            {
              ...budget,
              id: `budget_${Date.now()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateBudget: (id, updates) =>
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id
              ? { ...budget, ...updates, updatedAt: new Date().toISOString() }
              : budget
          ),
        })),
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        })),
      toggleBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id
              ? {
                  ...budget,
                  enabled: !budget.enabled,
                  updatedAt: new Date().toISOString(),
                }
              : budget
          ),
        })),
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
