import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';

export function useGetWorkoutSkippedForDate(date: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: queryKeys.workoutSkipped(date),
    queryFn: async () => {
      if (!actor) return false;
      return actor.isWorkoutSkippedForDate(date);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useToggleWorkoutSkippedForDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.toggleWorkoutSkippedForDate(date);
    },
    onSuccess: (_, date) => {
      // Invalidate skip status for this date
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutSkipped(date) });
      // Also invalidate completion status since they're mutually exclusive
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutCompletion(date) });
    },
  });
}

export function useSetWorkoutSkippedForDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, skipped }: { date: string; skipped: boolean }) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.setWorkoutSkippedForDate(date, skipped);
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutSkipped(date) });
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutCompletion(date) });
    },
  });
}
