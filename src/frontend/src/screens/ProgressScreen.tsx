import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RequireAuthNotice from '../components/RequireAuthNotice';
import WeighInForm from '../components/WeighInForm';
import WeighInList from '../components/WeighInList';
import WeightChart from '../components/WeightChart';
import WorkoutProgressChart from '../components/WorkoutProgressChart';
import { useGetWeightEntries } from '../hooks/queries/useWeightEntries';
import { useGetWorkoutCompletionsForDateRange } from '../hooks/queries/useWorkoutCompletion';
import AsyncState from '../components/AsyncState';
import { formatDateToYYYYMMDD, addDays } from '../utils/date';

export default function ProgressScreen() {
  const { data: entries, isLoading: weightLoading } = useGetWeightEntries();
  const [showForm, setShowForm] = useState(false);

  // Calculate 30-day range for workout progress
  const dateRange = useMemo(() => {
    const today = new Date();
    const endDate = formatDateToYYYYMMDD(today);
    const startDate = addDays(endDate, -29); // 30 days including today
    return { startDate, endDate };
  }, []);

  const { data: workoutCompletions, isLoading: workoutLoading } = useGetWorkoutCompletionsForDateRange(
    dateRange.startDate,
    dateRange.endDate
  );

  return (
    <div className="space-y-6">
      <RequireAuthNotice />

      <Card>
        <CardHeader>
          <CardTitle>Workout Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <AsyncState
            isLoading={workoutLoading}
            isEmpty={!workoutCompletions || workoutCompletions.length === 0}
            emptyMessage="No workout progress yet. Complete a workout to start tracking!"
          >
            {workoutCompletions && workoutCompletions.length > 0 && (
              <WorkoutProgressChart
                completions={workoutCompletions}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
            )}
          </AsyncState>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Weight Progress</CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Entry
          </Button>
        </CardHeader>
        <CardContent>
          <AsyncState
            isLoading={weightLoading}
            isEmpty={!entries || entries.length === 0}
            emptyMessage="No weight entries yet. Add your first entry to start tracking!"
          >
            {entries && entries.length > 0 && <WeightChart entries={entries} />}
          </AsyncState>
        </CardContent>
      </Card>

      <WeighInList />

      <WeighInForm open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}
