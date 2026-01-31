import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../types/transaction';
import { format } from 'date-fns';

class ExportService {
  private static instance: ExportService;

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  async exportToCSV(
    transactions: Transaction[],
    currency: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Create CSV header
      const header = 'Date,Type,Item,Category,Price,Hours,Notes\n';

      // Create CSV rows
      const rows = transactions
        .map((t) => {
          const date = format(new Date(t.timestamp), 'yyyy-MM-dd HH:mm:ss');
          const type = t.type === 'purchased' ? 'Purchase' : 'Saved';
          const item = `"${t.label.replace(/"/g, '""')}"`;
          const category = t.category || 'N/A';
          const price = `${currency}${t.itemPrice.toFixed(2)}`;
          const hours = t.hoursOfWork.toFixed(2);
          const notes = t.note ? `"${t.note.replace(/"/g, '""')}"` : '';

          return `${date},${type},${item},${category},${price},${hours},${notes}`;
        })
        .join('\n');

      const csv = header + rows;

      // Save to file
      const fileName = `time-worth-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the file
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Transactions',
          UTI: 'public.comma-separated-values-text',
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Export failed:', error);
      return { success: false, error: error.message || 'Export failed' };
    }
  }

  async exportSummaryToText(
    transactions: Transaction[],
    currency: string,
    totalSpent: number,
    totalSaved: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const summary = `
TIME WORTH - TRANSACTION SUMMARY
Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}

OVERVIEW
========
Total Transactions: ${transactions.length}
Total Spent: ${currency}${totalSpent.toFixed(2)}
Total Saved: ${currency}${totalSaved.toFixed(2)}
Net Savings: ${currency}${(totalSaved - totalSpent).toFixed(2)}

TRANSACTIONS
============
${transactions
  .map(
    (t, i) =>
      `${i + 1}. ${format(new Date(t.timestamp), 'yyyy-MM-dd')} - ${
        t.type === 'purchased' ? 'PURCHASED' : 'SAVED'
      }
   ${t.label} - ${currency}${t.itemPrice.toFixed(2)} (${t.hoursOfWork.toFixed(2)} hours)
   ${t.category ? `Category: ${t.category}` : ''}
   ${t.note ? `Notes: ${t.note}` : ''}`
  )
  .join('\n\n')}
`;

      const fileName = `time-worth-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, summary, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Export Summary',
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Export failed:', error);
      return { success: false, error: error.message || 'Export failed' };
    }
  }
}

export default ExportService.getInstance();
