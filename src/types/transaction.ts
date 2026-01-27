export interface Transaction {
  id: string;
  type: 'purchased' | 'saved';
  itemPrice: number;
  hoursOfWork: number;
  timestamp: string;
  label: string; // Item name/label (e.g., "Coffee", "T-shirt")
  note?: string; // Optional additional notes
}
