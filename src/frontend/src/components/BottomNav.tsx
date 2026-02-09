import { Home, Dumbbell, UtensilsCrossed, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'home' | 'workout' | 'diet' | 'progress';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'workout' as Tab, label: 'Workout', icon: Dumbbell },
    { id: 'diet' as Tab, label: 'Diet', icon: UtensilsCrossed },
    { id: 'progress' as Tab, label: 'Progress', icon: TrendingDown },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-bottom">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-lg ${
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
