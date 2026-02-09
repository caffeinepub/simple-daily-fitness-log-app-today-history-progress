import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import SafetyDisclaimer from '../components/SafetyDisclaimer';
import DateSelector from '../components/DateSelector';
import WorkoutDayDetail from '../components/WorkoutDayDetail';
import WorkoutEditDialog from '../components/WorkoutEditDialog';
import RequireAuthNotice from '../components/RequireAuthNotice';
import { useGetWorkoutForDate } from '../hooks/queries/useWorkoutForDate';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getTodayYYYYMMDD } from '../utils/date';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkoutScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayYYYYMMDD());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: workout, isLoading } = useGetWorkoutForDate(selectedDate);

  const handleEdit = () => {
    if (!identity) {
      return;
    }
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <SafetyDisclaimer type="workout" />
      <RequireAuthNotice />
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleEdit}
          disabled={!identity}
          title={!identity ? 'Sign in to edit workouts' : 'Edit workout'}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : workout ? (
        <WorkoutDayDetail date={selectedDate} workout={workout} />
      ) : null}

      {workout && (
        <WorkoutEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          date={selectedDate}
          initialWorkout={workout}
        />
      )}
    </div>
  );
}
