import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Droplets } from 'lucide-react';
import { useWaterReminder } from '../hooks/useWaterReminder';

export default function WaterReminderSettings() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('09:00');

  useWaterReminder(enabled, time);

  useEffect(() => {
    const savedEnabled = localStorage.getItem('waterReminderEnabled');
    const savedTime = localStorage.getItem('waterReminderTime');
    if (savedEnabled) setEnabled(savedEnabled === 'true');
    if (savedTime) setTime(savedTime);
  }, []);

  const handleEnabledChange = (checked: boolean) => {
    setEnabled(checked);
    localStorage.setItem('waterReminderEnabled', checked.toString());
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    localStorage.setItem('waterReminderTime', newTime);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="h-5 w-5 text-blue-500" />
          Water Reminder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="water-reminder">Enable daily reminder</Label>
          <Switch
            id="water-reminder"
            checked={enabled}
            onCheckedChange={handleEnabledChange}
          />
        </div>
        {enabled && (
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Reminder time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
