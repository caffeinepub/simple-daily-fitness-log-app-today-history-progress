import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import type { WeightEntry } from '../../backend';

export function useGetWeightEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeightEntry[]>({
    queryKey: queryKeys.weightEntries,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeightEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetLatestWeight() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeightEntry | null>({
    queryKey: queryKeys.latestWeight,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestWeight();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddWeightEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weight: number) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.addWeightEntry(weight);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weightEntries });
      queryClient.invalidateQueries({ queryKey: queryKeys.latestWeight });
    },
  });
}
