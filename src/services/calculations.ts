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
    if (minutes >= 60) {
      return `1 hr`;
    }
    return `${minutes} min`;
  }

  if (hours < workHoursPerDay) {
    let wholeHours = Math.floor(hours);
    let minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 60) {
      wholeHours += 1;
      minutes = 0;
    }
    if (minutes === 0) {
      return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''}`;
    }
    return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''} ${minutes} min`;
  }

  const days = Math.floor(hours / workHoursPerDay);
  const remainingHoursRaw = hours - days * workHoursPerDay;
  let remainingWholeHours = Math.floor(remainingHoursRaw);
  let remainingMinutes = Math.round((remainingHoursRaw - remainingWholeHours) * 60);

  // Handle rounding overflow
  if (remainingMinutes === 60) {
    remainingWholeHours += 1;
    remainingMinutes = 0;
  }
  if (remainingWholeHours >= workHoursPerDay) {
    remainingWholeHours = 0;
    remainingMinutes = 0;
  }

  const dayStr = `${days} day${days !== 1 ? 's' : ''}`;

  if (remainingWholeHours === 0 && remainingMinutes === 0) {
    return dayStr;
  }
  if (remainingMinutes === 0) {
    return `${dayStr} ${remainingWholeHours} hr${remainingWholeHours !== 1 ? 's' : ''}`;
  }
  if (remainingWholeHours === 0) {
    return `${dayStr} ${remainingMinutes} min`;
  }
  return `${dayStr} ${remainingWholeHours} hr${remainingWholeHours !== 1 ? 's' : ''} ${remainingMinutes} min`;
}
