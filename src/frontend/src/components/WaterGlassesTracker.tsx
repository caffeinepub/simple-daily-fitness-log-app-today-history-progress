import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Droplets } from 'lucide-react';
import { useGetWaterGlasses, useUpdateWaterGlasses } from '../hooks/queries/useWaterGlasses';

interface WaterGlassesTrackerProps {
  date: string;
}

export default function WaterGlassesTracker({ date }: WaterGlassesTrackerProps) {
  const { data: glasses = 0 } = useGetWaterGlasses(date);
  const updateGlasses = useUpdateWaterGlasses();

  const handleIncrement = () => {
    updateGlasses.mutate({ date, count: glasses + 1 });
  };

  const handleDecrement = () => {
    if (glasses > 0) {
      updateGlasses.mutate({ date, count: glasses - 1 });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="h-5 w-5 text-primary" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={glasses === 0 || updateGlasses.isPending}
            className="h-12 w-12 rounded-full"
          >
            <Minus className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-bold text-primary">{glasses}</div>
            <div className="text-sm text-muted-foreground">
              {glasses === 1 ? 'glass' : 'glasses'}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={updateGlasses.isPending}
            className="h-12 w-12 rounded-full"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
