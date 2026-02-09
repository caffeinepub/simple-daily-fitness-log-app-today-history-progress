/**
 * Date utilities for calendar navigation and date-to-weekday mapping
 */

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date object
 */
export function parseDateFromYYYYMMDD(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayYYYYMMDD(): string {
  return formatDateToYYYYMMDD(new Date());
}

/**
 * Map a calendar date to weekday index (0=Monday, 6=Sunday)
 * Used to map selected dates to the default 7-day workout/meal plan
 */
export function getWeekdayIndex(dateStr: string): number {
  const date = parseDateFromYYYYMMDD(dateStr);
  const jsDay = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  // Convert to our format: 0=Monday, 6=Sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Add days to a date string
 */
export function addDays(dateStr: string, days: number): string {
  const date = parseDateFromYYYYMMDD(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateToYYYYMMDD(date);
}

/**
 * Format date for display (e.g., "Mon, Jan 15, 2026")
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = parseDateFromYYYYMMDD(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get the day name for a date (e.g., "Monday")
 */
export function getDayName(dateStr: string): string {
  const date = parseDateFromYYYYMMDD(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}
