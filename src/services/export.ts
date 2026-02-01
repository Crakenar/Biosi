import * as FileSystem from 'expo-file-system/build/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
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
      return { success: false, error: error.message || 'Export failed' };
    }
  }

  async exportToPDF(
    transactions: Transaction[],
    currency: string,
    totalSpent: number,
    totalSaved: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Create HTML for PDF
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #4ECDC4;
      border-bottom: 3px solid #4ECDC4;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #666;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .summary {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #ddd;
    }
    .summary-row:last-child {
      border-bottom: none;
      font-weight: bold;
    }
    .transaction {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
    }
    .transaction-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .transaction-title {
      font-weight: bold;
      font-size: 16px;
    }
    .transaction-date {
      color: #888;
      font-size: 12px;
    }
    .transaction-details {
      font-size: 14px;
      color: #666;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge-purchase {
      background: #FFE5E5;
      color: #FF6B6B;
    }
    .badge-saved {
      background: #E5F9F7;
      color: #4ECDC4;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>💰 Time Worth - Transaction Report</h1>

  <p><strong>Generated:</strong> ${format(new Date(), 'MMMM dd, yyyy HH:mm')}</p>

  <div class="summary">
    <h2>Summary</h2>
    <div class="summary-row">
      <span>Total Transactions:</span>
      <span>${transactions.length}</span>
    </div>
    <div class="summary-row">
      <span>Total Spent:</span>
      <span style="color: #FF6B6B;">${currency}${totalSpent.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Total Saved:</span>
      <span style="color: #4ECDC4;">${currency}${totalSaved.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Net Savings:</span>
      <span style="color: ${totalSaved - totalSpent >= 0 ? '#4ECDC4' : '#FF6B6B'};">${currency}${(totalSaved - totalSpent).toFixed(2)}</span>
    </div>
  </div>

  <h2>Transactions</h2>

  ${transactions
    .map(
      (t) => `
    <div class="transaction">
      <div class="transaction-header">
        <div>
          <div class="transaction-title">${t.label}</div>
          <div class="transaction-date">${format(new Date(t.timestamp), 'MMM dd, yyyy HH:mm')}</div>
        </div>
        <div>
          <span class="badge ${t.type === 'purchased' ? 'badge-purchase' : 'badge-saved'}">
            ${t.type === 'purchased' ? 'PURCHASE' : 'SAVED'}
          </span>
        </div>
      </div>
      <div class="transaction-details">
        <div><strong>Amount:</strong> ${currency}${t.itemPrice.toFixed(2)}</div>
        <div><strong>Hours of Work:</strong> ${t.hoursOfWork.toFixed(2)} hours</div>
        ${t.category ? `<div><strong>Category:</strong> ${t.category}</div>` : ''}
        ${t.note ? `<div><strong>Notes:</strong> ${t.note}</div>` : ''}
      </div>
    </div>
  `
    )
    .join('')}

  <div class="footer">
    <p>Generated by Time Worth - Make Mindful Purchase Decisions</p>
  </div>
</body>
</html>
`;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Share the PDF
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Export Transactions PDF',
          UTI: 'com.adobe.pdf',
        });
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'PDF export failed' };
    }
  }
}

export default ExportService.getInstance();
