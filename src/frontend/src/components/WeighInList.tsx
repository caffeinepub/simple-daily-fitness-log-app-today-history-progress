import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';
import { useGetWeightEntries } from '../hooks/queries/useWeightEntries';
import AsyncState from './AsyncState';

export default function WeighInList() {
  const { data: entries, isLoading } = useGetWeightEntries();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight History</CardTitle>
      </CardHeader>
      <CardContent>
        <AsyncState
          isLoading={isLoading}
          isEmpty={!entries || entries.length === 0}
          emptyMessage="No weight entries yet"
        >
          <div className="space-y-3">
            {entries?.slice(0, 10).map((entry, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{entry.weightKg} kg</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Number(entry.timestamp) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AsyncState>
      </CardContent>
    </Card>
  );
}
