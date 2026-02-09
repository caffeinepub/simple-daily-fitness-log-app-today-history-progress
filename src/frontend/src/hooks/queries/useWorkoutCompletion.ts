import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import type { WorkoutCompletionRecord } from '../../backend';

export function useGetWorkoutRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkoutCompletionRecord[]>({
    queryKey: queryKeys.workoutRecords,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkoutRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetWorkoutStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.workoutStats,
    queryFn: async () => {
      if (!actor) return { completionCount: BigInt(0), streak: BigInt(0) };
      const [completionCount, streak] = await Promise.all([
        actor.getWorkoutCompletionCount(),
        actor.getWorkoutStreak(),
      ]);
      return { completionCount, streak };
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMarkWorkoutCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      return actor.markWorkoutCompleted();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutRecords });
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutStats });
    },
  });
}

// Date-scoped completion hooks
export function useGetWorkoutCompletionForDate(date: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: queryKeys.workoutCompletion(date),
    queryFn: async () => {
      if (!actor) return false;
      return actor.getWorkoutCompletionForDate(date);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useToggleWorkoutCompletionForDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.toggleWorkoutCompletionForDate(date);
    },
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutCompletion(date) });
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutStats });
      // Also invalidate skip status since they're mutually exclusive
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutSkipped(date) });
    },
  });
}
