export interface UserProfile {
  id: string;
  name: string;
  age: number;
  currency: string;
  wage: {
    amount: number;
    period: 'hourly' | 'monthly' | 'yearly';
    hourlyRate: number;
  };
  createdAt: string;
  updatedAt: string;
}
