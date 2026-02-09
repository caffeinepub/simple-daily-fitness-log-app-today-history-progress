import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, CalendarX } from 'lucide-react';
import SafetyDisclaimer from '../components/SafetyDisclaimer';
import DateSelector from '../components/DateSelector';
import MealDayDetail from '../components/MealDayDetail';
import DietEditDialog from '../components/DietEditDialog';
import SkipDayToggle from '../components/SkipDayToggle';
import WaterGlassesTracker from '../components/WaterGlassesTracker';
import ProteinScoopsTracker from '../components/ProteinScoopsTracker';
import { useGetDietForDate } from '../hooks/useDietOverrides';
import { useGetDietSkippedForDate, useToggleDietSkippedForDate } from '../hooks/queries/useDietSkip';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getTodayYYYYMMDD } from '../utils/date';
import { Skeleton } from '@/components/ui/skeleton';

export default function DietScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayYYYYMMDD());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: meals, isLoading } = useGetDietForDate(selectedDate);
  const { data: isSkipped = false } = useGetDietSkippedForDate(selectedDate);
  const toggleSkipped = useToggleDietSkippedForDate();

  const handleEdit = () => {
    if (!identity) {
      return;
    }
    setEditDialogOpen(true);
  };

  const handleToggleSkip = async () => {
    await toggleSkipped.mutateAsync(selectedDate);
  };

  return (
    <div className="space-y-6">
      <SafetyDisclaimer type="diet" />
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <SkipDayToggle
          date={selectedDate}
          isSkipped={isSkipped}
          onToggle={handleToggleSkip}
          isPending={toggleSkipped.isPending}
          type="diet"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleEdit}
          disabled={!identity}
          title={!identity ? 'Sign in to edit diet plan' : 'Edit diet plan'}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {isSkipped && (
        <Alert variant="default" className="border-destructive/50 bg-destructive/10">
          <CalendarX className="h-4 w-4" />
          <AlertDescription>
            This diet day is marked as skipped. You can unskip it to resume your normal meal plan.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <WaterGlassesTracker date={selectedDate} />
        <ProteinScoopsTracker date={selectedDate} />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : meals && !isSkipped ? (
        <MealDayDetail meals={meals} />
      ) : null}

      {meals && (
        <DietEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          date={selectedDate}
          initialMeals={meals}
        />
      )}
    </div>
  );
}
