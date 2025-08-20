'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FiLayout, FiPieChart, FiClock, FiX, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactElement;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

const NavItem = ({ icon, children, active, onClick, count }: NavItemProps) => (
  <div
    className={cn(
      'flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
      active ? 'bg-gray-700 text-white' : 'bg-transparent text-white hover:bg-gray-700',
    )}
    onClick={onClick}
  >
    <div className='flex items-center gap-3'>
      {icon}
      <span className={cn('text-sm', active ? 'font-semibold' : 'font-normal')}>{children}</span>
    </div>
    {count !== undefined && (
      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-500 text-white'>
        {count}
      </span>
    )}
  </div>
);

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView?: 'all' | 'analytics' | 'recientes';
  setActiveView?: (view: 'all' | 'analytics' | 'recientes') => void;
  rendersCount?: number;
  recentActivitiesCount?: number;
  completeRendersCount?: number;
  iosOnlyCount?: number;
  androidOnlyCount?: number;
}

export default function DashboardSidebar({
  isSidebarOpen,
  setSidebarOpen,
  activeView = 'all',
  setActiveView,
  rendersCount = 0,
  recentActivitiesCount = 0,
  completeRendersCount = 0,
  iosOnlyCount = 0,
  androidOnlyCount = 0,
}: DashboardSidebarProps) {
  const router = useRouter();

  const sidebarNavItems = [
    {
      icon: <FiLayout />,
      label: 'Todos los modelos',
      active: activeView === 'all',
      count: rendersCount,
      onClick: () => {
        setActiveView?.('all');
        router.push('/dashboard/renders');
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      },
    },
    {
      icon: <FiPieChart />,
      label: 'Analytics',
      active: activeView === 'analytics',
      onClick: () => {
        setActiveView?.('analytics');
        router.push('/dashboard/renders');
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      },
    },
    {
      icon: <FiClock />,
      label: 'Recientes',
      active: activeView === 'recientes',
      count: recentActivitiesCount,
      onClick: () => {
        setActiveView?.('recientes');
        router.push('/dashboard/renders');
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      },
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-40 lg:hidden'
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-800 border-r border-gray-700 p-4
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-lg font-bold text-white'>Mis Modelos 3D</h2>
              <p className='text-sm text-gray-400'>Gestiona tus experiencias AR</p>
            </div>

            {/* Mobile close button */}
            <Button
              variant='ghost'
              size='sm'
              className='lg:hidden text-gray-400 hover:text-white hover:bg-gray-700 p-1'
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <div className='space-y-1'>
            {sidebarNavItems.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                active={item.active}
                count={item.count}
                onClick={item.onClick}
              >
                {item.label}
              </NavItem>
            ))}
          </div>

          {/* Quick Stats */}
          <div className='space-y-3'>
            <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Estadísticas
            </h3>
            <div className='space-y-2 text-sm text-gray-300'>
              <div className='flex justify-between'>
                <span>Total modelos:</span>
                <span className='font-semibold text-white'>{rendersCount}</span>
              </div>
              <div className='flex justify-between'>
                <span>Con AR completo:</span>
                <span className='font-semibold text-green-400'>{completeRendersCount}</span>
              </div>
              <div className='flex justify-between'>
                <span>Solo iOS:</span>
                <span className='font-semibold text-yellow-400'>{iosOnlyCount}</span>
              </div>
              <div className='flex justify-between'>
                <span>Solo Android:</span>
                <span className='font-semibold text-orange-400'>{androidOnlyCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='space-y-3'>
            <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Acciones Rápidas
            </h3>
            <Button
              onClick={() => router.push('/dashboard/renders/upload')}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white'
            >
              <FiPlus className='mr-2' size={16} />
              Subir Modelo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
