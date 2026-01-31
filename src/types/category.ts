export type TransactionCategory =
  | 'food'
  | 'shopping'
  | 'entertainment'
  | 'transport'
  | 'health'
  | 'education'
  | 'bills'
  | 'housing'
  | 'travel'
  | 'gifts'
  | 'other';

export interface CategoryInfo {
  id: TransactionCategory;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#4ECDC4' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#95E1D3' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#FFE66D' },
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#A8E6CF' },
  { id: 'education', name: 'Education', icon: '📚', color: '#B4A4E8' },
  { id: 'bills', name: 'Bills & Utilities', icon: '📝', color: '#FF8B94' },
  { id: 'housing', name: 'Housing', icon: '🏠', color: '#C7CEEA' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#FFDAC1' },
  { id: 'gifts', name: 'Gifts', icon: '🎁', color: '#FFAAA5' },
  { id: 'other', name: 'Other', icon: '📦', color: '#B8B8B8' },
];

export function getCategoryInfo(categoryId: TransactionCategory): CategoryInfo {
  return CATEGORIES.find((cat) => cat.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
}
