'use client';

import { useState, createContext, useContext, useCallback } from 'react';
import DashboardNav from '@/components/DashboardNav';
import DashboardSidebar from '@/components/layouts/DashboardSidebar';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeView: 'all' | 'analytics' | 'recientes';
  setActiveView: (view: 'all' | 'analytics' | 'recientes') => void;
  updateSidebarStats: (stats: {
    rendersCount: number;
    recentActivitiesCount: number;
    completeRendersCount: number;
    iosOnlyCount: number;
    androidOnlyCount: number;
  }) => void;
  sidebarStats: {
    rendersCount: number;
    recentActivitiesCount: number;
    completeRendersCount: number;
    iosOnlyCount: number;
    androidOnlyCount: number;
  };
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isSidebarOpen: false,
      toggleSidebar: () => {},
      setSidebarOpen: () => {},
      activeView: 'all',
      setActiveView: () => {},
      updateSidebarStats: () => {},
      sidebarStats: {
        rendersCount: 0,
        recentActivitiesCount: 0,
        completeRendersCount: 0,
        iosOnlyCount: 0,
        androidOnlyCount: 0,
      },
    };
  }
  return context;
};

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'all' | 'analytics' | 'recientes'>('all');
  const [sidebarStats, setSidebarStats] = useState({
    rendersCount: 0,
    recentActivitiesCount: 0,
    completeRendersCount: 0,
    iosOnlyCount: 0,
    androidOnlyCount: 0,
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const setSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
  };

  const handleSetActiveView = (view: 'all' | 'analytics' | 'recientes') => {
    setActiveView(view);
  };

  const updateSidebarStats = useCallback((stats: typeof sidebarStats) => {
    setSidebarStats(stats);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        activeView,
        setActiveView: handleSetActiveView,
        updateSidebarStats,
        sidebarStats,
      }}
    >
      <DashboardNav onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className='flex h-screen bg-gray-900'>
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeView={activeView}
          setActiveView={handleSetActiveView}
          {...sidebarStats}
        />
        <div className='flex-1 overflow-auto'>{children}</div>
      </div>
    </SidebarContext.Provider>
  );
}
