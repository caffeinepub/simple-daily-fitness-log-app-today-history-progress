import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import type { WorkoutContent } from '../../backend';
import { workoutPlan, WorkoutDay } from '../../data/workoutPlan';
import { getWeekdayIndex } from '../../utils/date';

/**
 * Get the effective workout for a date (custom override or default from workoutPlan)
 */
export function useGetWorkoutForDate(date: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkoutDay>({
    queryKey: queryKeys.workoutForDate(date),
    queryFn: async () => {
      if (!actor) {
        // Not authenticated, return default
        const weekdayIndex = getWeekdayIndex(date);
        return workoutPlan[weekdayIndex];
      }

      // Check for custom workout
      const customWorkout = await actor.getWorkoutForDate(date);
      if (customWorkout && customWorkout.days.length > 0) {
        // Convert backend WorkoutContent to frontend WorkoutDay
        const backendDay = customWorkout.days[0];
        return {
          name: backendDay.dayName,
          isRestDay: backendDay.sections.length === 0,
          sections: backendDay.sections.map((section) => ({
            name: section.name,
            exercises: section.exercises.map((ex) => ({
              name: ex.name,
              sets: Number(ex.sets),
              reps: ex.reps.toString(),
              restSeconds: 60, // Default rest
            })),
          })),
        };
      }

      // No custom workout, return default
      const weekdayIndex = getWeekdayIndex(date);
      return workoutPlan[weekdayIndex];
    },
    enabled: !!actor && !actorFetching,
  });
}

/**
 * Save a custom workout for a specific date
 */
export function useSaveWorkoutForDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, workout }: { date: string; workout: WorkoutDay }) => {
      if (!actor) throw new Error('Not authenticated');

      // Convert frontend WorkoutDay to backend WorkoutContent
      const workoutContent: WorkoutContent = {
        days: [
          {
            dayName: workout.name,
            sections: workout.sections.map((section) => ({
              name: section.name,
              exercises: section.exercises.map((ex, idx) => ({
                id: BigInt(idx),
                name: ex.name,
                sets: BigInt(ex.sets || 0),
                reps: BigInt(ex.reps ? parseInt(ex.reps) || 0 : 0),
                weightKg: 0,
              })),
            })),
          },
        ],
      };

      return actor.saveCustomWorkoutForDate(date, workoutContent);
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutForDate(date) });
    },
  });
}

/**
 * Reset workout for a date to default (clear custom override)
 */
export function useResetWorkoutForDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.clearCustomWorkoutForDate(date);
    },
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutForDate(date) });
    },
  });
}
