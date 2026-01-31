import { TransactionCategory } from './category';

export interface Transaction {
  id: string;
  type: 'purchased' | 'saved';
  itemPrice: number;
  hoursOfWork: number;
  timestamp: string;
  label: string; // Item name/label (e.g., "Coffee", "T-shirt")
  note?: string; // Optional additional notes
  category?: TransactionCategory; // Premium: Transaction category
  tags?: string[]; // Premium: Custom tags for organization
  photoUri?: string; // Premium: Attached receipt/product photo
}
