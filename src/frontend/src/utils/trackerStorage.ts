// Shared localStorage helpers for water glasses and protein scoops tracking

const ANONYMOUS_SUBJECT_KEY = 'tracker_anonymous_subject';
const WATER_GLASSES_KEY = 'water_glasses';
const PROTEIN_SCOOPS_KEY = 'protein_scoops';

/**
 * Get or create a stable anonymous subject key for unauthenticated users
 */
function getAnonymousSubject(): string {
  let subject = localStorage.getItem(ANONYMOUS_SUBJECT_KEY);
  if (!subject) {
    subject = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(ANONYMOUS_SUBJECT_KEY, subject);
  }
  return subject;
}

/**
 * Get the storage subject key (authenticated principal or anonymous key)
 */
export function getStorageSubject(principal?: string): string {
  return principal || getAnonymousSubject();
}

/**
 * Create a storage key for a specific subject and date
 */
function makeStorageKey(prefix: string, subject: string, date: string): string {
  return `${prefix}:${subject}:${date}`;
}

/**
 * Read water glasses count for a specific subject and date
 */
export function readWaterGlasses(subject: string, date: string): number {
  const key = makeStorageKey(WATER_GLASSES_KEY, subject, date);
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored, 10) : 0;
}

/**
 * Write water glasses count for a specific subject and date
 */
export function writeWaterGlasses(subject: string, date: string, count: number): void {
  const key = makeStorageKey(WATER_GLASSES_KEY, subject, date);
  localStorage.setItem(key, count.toString());
}

/**
 * Read protein scoops count for a specific subject and date (clamped to 0-2)
 */
export function readProteinScoops(subject: string, date: string): number {
  const key = makeStorageKey(PROTEIN_SCOOPS_KEY, subject, date);
  const stored = localStorage.getItem(key);
  const value = stored ? parseInt(stored, 10) : 0;
  return Math.max(0, Math.min(2, value));
}

/**
 * Write protein scoops count for a specific subject and date (clamped to 0-2)
 */
export function writeProteinScoops(subject: string, date: string, count: number): void {
  const key = makeStorageKey(PROTEIN_SCOOPS_KEY, subject, date);
  const clamped = Math.max(0, Math.min(2, count));
  localStorage.setItem(key, clamped.toString());
}
