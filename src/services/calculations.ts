import { APP_CONFIG } from '../constants/config';

export function normalizeToHourly(
  amount: number,
  period: 'hourly' | 'monthly' | 'yearly',
  hoursPerWeek: number = APP_CONFIG.DEFAULT_HOURS_PER_WEEK
): number {
  const hoursPerMonth = (hoursPerWeek * 52) / 12;
  const hoursPerYear = hoursPerWeek * 52;

  switch (period) {
    case 'hourly':
      return amount;
    case 'monthly':
      return amount / hoursPerMonth;
    case 'yearly':
      return amount / hoursPerYear;
  }
}

export function calculateHoursOfWork(itemPrice: number, hourlyWage: number): number {
  if (hourlyWage <= 0) return 0;
  return itemPrice / hourlyWage;
}

export function calculateCompoundInterest(
  principal: number,
  years: number,
  rate: number = APP_CONFIG.COMPOUND_INTEREST_RATE
): number {
  return principal * Math.pow(1 + rate, years);
}

export function formatHours(hours: number, workHoursPerDay: number = APP_CONFIG.DEFAULT_WORK_HOURS_PER_DAY): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }

  if (hours < workHoursPerDay) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''}`;
    }
    return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''} ${minutes} min`;
  }

  const days = Math.floor(hours / workHoursPerDay);
  const remainingHours = Math.round(hours % workHoursPerDay);
  if (remainingHours === 0) {
    return `${days} work day${days !== 1 ? 's' : ''}`;
  }
  return `${days} work day${days !== 1 ? 's' : ''} ${remainingHours} hr${remainingHours !== 1 ? 's' : ''}`;
}
