import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../useInternetIdentity';
import { queryKeys } from './queryKeys';
import { getStorageSubject, readProteinScoops, writeProteinScoops } from '../../utils/trackerStorage';

/**
 * Get protein scoops count for a specific date (0-2)
 */
export function useGetProteinScoops(date: string) {
  const { identity } = useInternetIdentity();

  return useQuery<number>({
    queryKey: queryKeys.proteinScoops(date),
    queryFn: () => {
      const principal = identity?.getPrincipal().toString();
      const subject = getStorageSubject(principal);
      return readProteinScoops(subject, date);
    },
  });
}

/**
 * Update protein scoops count for a specific date (clamped to 0-2)
 */
export function useUpdateProteinScoops() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, count }: { date: string; count: number }) => {
      const principal = identity?.getPrincipal().toString();
      const subject = getStorageSubject(principal);
      writeProteinScoops(subject, date, count);
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proteinScoops(date) });
    },
  });
}
