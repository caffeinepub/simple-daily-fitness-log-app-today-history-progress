import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RequireAuthNotice from '../components/RequireAuthNotice';
import WeighInForm from '../components/WeighInForm';
import WeighInList from '../components/WeighInList';
import WeightChart from '../components/WeightChart';
import { useGetWeightEntries } from '../hooks/queries/useWeightEntries';
import AsyncState from '../components/AsyncState';

export default function ProgressScreen() {
  const { data: entries, isLoading } = useGetWeightEntries();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <RequireAuthNotice />

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
            isLoading={isLoading}
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
