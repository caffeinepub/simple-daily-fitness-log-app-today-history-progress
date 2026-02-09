import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useWaterReminder(enabled: boolean, time: string) {
  const hasShownTodayRef = useRef(false);
  const notificationPermissionRef = useRef<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      notificationPermissionRef.current = Notification.permission;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      const lastShown = localStorage.getItem('lastWaterReminderDate');
      const today = now.toDateString();

      if (now >= reminderTime && lastShown !== today && !hasShownTodayRef.current) {
        hasShownTodayRef.current = true;
        localStorage.setItem('lastWaterReminderDate', today);

        toast('💧 Water Reminder', {
          description: 'Time to hydrate! Drink a glass of water.',
          duration: 10000,
        });

        if (notificationPermissionRef.current === 'granted') {
          new Notification('💧 Water Reminder', {
            body: 'Time to hydrate! Drink a glass of water.',
            icon: '/assets/generated/app-icon.dim_1024x1024.png',
          });
        } else if (notificationPermissionRef.current === 'default') {
          Notification.requestPermission().then((permission) => {
            notificationPermissionRef.current = permission;
          });
        }
      }
    };

    const interval = setInterval(checkReminder, 60000);
    checkReminder();

    return () => clearInterval(interval);
  }, [enabled, time]);
}
