'use client';

import { useState, createContext, useContext } from 'react';
import DashboardNav from '@/components/DashboardNav';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isSidebarOpen: false,
      toggleSidebar: () => {},
      setSidebarOpen: () => {},
    };
  }
  return context;
};

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const setSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
  };

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, setSidebarOpen }}
    >
      <DashboardNav
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      {children}
    </SidebarContext.Provider>
  );
}
