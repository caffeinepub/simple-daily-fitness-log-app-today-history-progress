import { ReactNode } from 'react';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

type Tab = 'home' | 'workout' | 'diet' | 'progress';

interface AppShellProps {
  children: ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onShowTour: () => void;
}

export default function AppShell({ children, activeTab, onTabChange, onShowTour }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader onShowTour={onShowTour} />
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="mx-auto max-w-2xl px-4 py-6 safe-bottom">
          {children}
        </div>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
