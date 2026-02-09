import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Dumbbell, TrendingDown, Flame, Edit } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/queries/useCurrentUserProfile';
import { useGetWorkoutStats } from '../hooks/queries/useWorkoutCompletion';
import { useGetLatestWeight } from '../hooks/queries/useWeightEntries';
import GoalSetupDialog from '../components/GoalSetupDialog';
import WaterReminderSettings from '../components/WaterReminderSettings';
import RequireAuthNotice from '../components/RequireAuthNotice';
import AsyncState from '../components/AsyncState';

export default function HomeScreen() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: stats } = useGetWorkoutStats();
  const { data: latestWeight } = useGetLatestWeight();
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  return (
    <div className="space-y-6">
      <RequireAuthNotice />

      <AsyncState isLoading={profileLoading}>
        {profile && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Your Goals</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowGoalDialog(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>Start Weight</span>
                    </div>
                    <p className="text-2xl font-bold">{profile.startWeight} kg</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4" />
                      <span>Target Weight</span>
                    </div>
                    <p className="text-2xl font-bold">{profile.targetWeight} kg</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Dumbbell className="h-4 w-4" />
                      <span>Workout Days</span>
                    </div>
                    <p className="text-2xl font-bold">{profile.weeklyWorkoutFrequency.toString()}/week</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Flame className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <p className="text-2xl font-bold">{profile.dailyDurationHours}h/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Workouts Done
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats?.completionCount.toString() || '0'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats?.streak.toString() || '0'} days</p>
                </CardContent>
              </Card>
            </div>

            {latestWeight && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Latest Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{latestWeight.weightKg} kg</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(Number(latestWeight.timestamp) / 1000000).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            )}

            <WaterReminderSettings />
          </>
        )}
      </AsyncState>

      <GoalSetupDialog open={showGoalDialog} onOpenChange={setShowGoalDialog} />
    </div>
  );
}
