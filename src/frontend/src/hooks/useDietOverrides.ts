import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { queryKeys } from './queries/queryKeys';
import { Meal, mealPlan } from '../data/mealPlan';
import { getWeekdayIndex } from '../utils/date';

// Store diet overrides in localStorage (keyed by principal + date)
const DIET_STORAGE_KEY = 'diet_overrides';

interface DietOverride {
  principal: string;
  date: string;
  meals: Meal[];
}

function getDietOverrides(): DietOverride[] {
  try {
    const stored = localStorage.getItem(DIET_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveDietOverrides(overrides: DietOverride[]) {
  localStorage.setItem(DIET_STORAGE_KEY, JSON.stringify(overrides));
}

function getDietOverrideKey(principal: string, date: string): string {
  return `${principal}:${date}`;
}

/**
 * Get the effective diet for a date (custom override or default from mealPlan)
 */
export function useGetDietForDate(date: string) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Meal[]>({
    queryKey: queryKeys.dietForDate(date),
    queryFn: async () => {
      if (!identity) {
        // Not authenticated, return default
        const weekdayIndex = getWeekdayIndex(date);
        return mealPlan[weekdayIndex];
      }

      const principal = identity.getPrincipal().toString();
      const overrides = getDietOverrides();
      const override = overrides.find(
        (o) => o.principal === principal && o.date === date
      );

      if (override) {
        return override.meals;
      }

      // No override, return default
      const weekdayIndex = getWeekdayIndex(date);
      return mealPlan[weekdayIndex];
    },
    enabled: !!actor,
  });
}

/**
 * Save a custom diet for a specific date
 */
export function useSaveDietForDate() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, meals }: { date: string; meals: Meal[] }) => {
      if (!identity) throw new Error('Not authenticated');

      const principal = identity.getPrincipal().toString();
      const overrides = getDietOverrides();

      // Remove existing override for this date
      const filtered = overrides.filter(
        (o) => !(o.principal === principal && o.date === date)
      );

      // Add new override
      filtered.push({ principal, date, meals });
      saveDietOverrides(filtered);
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dietForDate(date) });
    },
  });
}

/**
 * Reset diet for a date to default (clear custom override)
 */
export function useResetDietForDate() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!identity) throw new Error('Not authenticated');

      const principal = identity.getPrincipal().toString();
      const overrides = getDietOverrides();

      // Remove override for this date
      const filtered = overrides.filter(
        (o) => !(o.principal === principal && o.date === date)
      );

      saveDietOverrides(filtered);
    },
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dietForDate(date) });
    },
  });
}
