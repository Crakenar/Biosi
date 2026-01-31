export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  icon: string;
}
