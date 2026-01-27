import { APP_CONFIG } from '../constants/config';

export function normalizeToHourly(
  amount: number,
  period: 'hourly' | 'monthly' | 'yearly'
): number {
  switch (period) {
    case 'hourly':
      return amount;
    case 'monthly':
      return amount / APP_CONFIG.HOURS_PER_MONTH;
    case 'yearly':
      return amount / APP_CONFIG.HOURS_PER_YEAR;
  }
}

export function calculateHoursOfWork(itemPrice: number, hourlyWage: number): number {
  if (hourlyWage <= 0) return 0;
  return itemPrice / hourlyWage;
}

export function calculateCompoundInterest(principal: number, years: number): number {
  const rate = APP_CONFIG.COMPOUND_INTEREST_RATE;
  return principal * Math.pow(1 + rate, years);
}

export function formatHours(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }

  if (hours < 24) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''}`;
    }
    return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''} ${minutes} min`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  if (remainingHours === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hr${remainingHours !== 1 ? 's' : ''}`;
}
