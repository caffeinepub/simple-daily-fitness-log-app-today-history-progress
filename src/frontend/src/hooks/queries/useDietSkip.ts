import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../useInternetIdentity';
import { queryKeys } from './queryKeys';

// Store diet skip status in localStorage (keyed by principal + date)
const DIET_SKIP_STORAGE_KEY = 'diet_skipped';

interface DietSkipRecord {
  principal: string;
  date: string;
  skipped: boolean;
}

function getDietSkipRecords(): DietSkipRecord[] {
  try {
    const stored = localStorage.getItem(DIET_SKIP_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveDietSkipRecords(records: DietSkipRecord[]) {
  localStorage.setItem(DIET_SKIP_STORAGE_KEY, JSON.stringify(records));
}

export function useGetDietSkippedForDate(date: string) {
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: queryKeys.dietSkipped(date),
    queryFn: async () => {
      if (!identity) return false;

      const principal = identity.getPrincipal().toString();
      const records = getDietSkipRecords();
      const record = records.find(
        (r) => r.principal === principal && r.date === date
      );

      return record?.skipped ?? false;
    },
    enabled: !!identity,
  });
}

export function useToggleDietSkippedForDate() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!identity) throw new Error('Not authenticated');

      const principal = identity.getPrincipal().toString();
      const records = getDietSkipRecords();
      
      // Find existing record
      const existingIndex = records.findIndex(
        (r) => r.principal === principal && r.date === date
      );

      let newSkippedValue: boolean;

      if (existingIndex >= 0) {
        // Toggle existing record
        newSkippedValue = !records[existingIndex].skipped;
        records[existingIndex].skipped = newSkippedValue;
      } else {
        // Create new record
        newSkippedValue = true;
        records.push({ principal, date, skipped: true });
      }

      saveDietSkipRecords(records);
      return newSkippedValue;
    },
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dietSkipped(date) });
    },
  });
}

export function useSetDietSkippedForDate() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, skipped }: { date: string; skipped: boolean }) => {
      if (!identity) throw new Error('Not authenticated');

      const principal = identity.getPrincipal().toString();
      const records = getDietSkipRecords();

      // Remove existing record for this date
      const filtered = records.filter(
        (r) => !(r.principal === principal && r.date === date)
      );

      // Add new record
      filtered.push({ principal, date, skipped });
      saveDietSkipRecords(filtered);
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dietSkipped(date) });
    },
  });
}
