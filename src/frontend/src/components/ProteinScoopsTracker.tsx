import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Beef } from 'lucide-react';
import { useGetProteinScoops, useUpdateProteinScoops } from '../hooks/queries/useProteinScoops';

interface ProteinScoopsTrackerProps {
  date: string;
}

export default function ProteinScoopsTracker({ date }: ProteinScoopsTrackerProps) {
  const { data: scoops = 0 } = useGetProteinScoops(date);
  const updateScoops = useUpdateProteinScoops();

  const handleIncrement = () => {
    if (scoops < 2) {
      updateScoops.mutate({ date, count: scoops + 1 });
    }
  };

  const handleDecrement = () => {
    if (scoops > 0) {
      updateScoops.mutate({ date, count: scoops - 1 });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Beef className="h-5 w-5 text-primary" />
          Protein Scoops
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={scoops === 0 || updateScoops.isPending}
            className="h-12 w-12 rounded-full"
          >
            <Minus className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-bold text-primary">
              {scoops}/2
            </div>
            <div className="text-sm text-muted-foreground">
              {scoops === 0 && 'No scoops yet'}
              {scoops === 1 && '1 scoop done'}
              {scoops === 2 && 'Goal reached!'}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={scoops >= 2 || updateScoops.isPending}
            className="h-12 w-12 rounded-full"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
