export interface Budget {
  id: string;
  period: 'daily' | 'weekly' | 'monthly';
  amount: number;
  alertThreshold: number; // Percentage (e.g., 80 means alert at 80%)
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
