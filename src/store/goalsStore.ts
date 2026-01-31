import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage';
import { SavingsGoal } from '../types/goal';

interface GoalsStore {
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, amount: number) => void;
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: `goal_${Date.now()}`,
              currentAmount: 0,
              completed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
              : goal
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      updateGoalProgress: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === id) {
              const newAmount = goal.currentAmount + amount;
              return {
                ...goal,
                currentAmount: newAmount,
                completed: newAmount >= goal.targetAmount,
                updatedAt: new Date().toISOString(),
              };
            }
            return goal;
          }),
        })),
    }),
    {
      name: 'goals-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
