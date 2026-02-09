import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../useInternetIdentity';
import { queryKeys } from './queryKeys';
import { getStorageSubject, readWaterGlasses, writeWaterGlasses } from '../../utils/trackerStorage';

/**
 * Get water glasses count for a specific date
 */
export function useGetWaterGlasses(date: string) {
  const { identity } = useInternetIdentity();

  return useQuery<number>({
    queryKey: queryKeys.waterGlasses(date),
    queryFn: () => {
      const principal = identity?.getPrincipal().toString();
      const subject = getStorageSubject(principal);
      return readWaterGlasses(subject, date);
    },
  });
}

/**
 * Update water glasses count for a specific date
 */
export function useUpdateWaterGlasses() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, count }: { date: string; count: number }) => {
      const principal = identity?.getPrincipal().toString();
      const subject = getStorageSubject(principal);
      writeWaterGlasses(subject, date, count);
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waterGlasses(date) });
    },
  });
}
