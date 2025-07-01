'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { FiSearch } from 'react-icons/fi';

interface SidebarLayoutProps {
  // Sidebar content
  sidebarTitle: string;
  sidebarSubtitle?: string;
  sidebarContent: React.ReactNode;

  // Main content
  children: React.ReactNode;

  // Search functionality
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Header actions
  headerActions?: React.ReactNode;
}

export default function SidebarLayout({
  sidebarTitle,
  sidebarSubtitle,
  sidebarContent,
  children,
  searchPlaceholder = 'Buscar...',
  searchValue = '',
  onSearchChange,
  headerActions,
}: SidebarLayoutProps) {
  return (
    <div className='flex h-screen bg-gray-900'>
      {/* Sidebar */}
      <div className='w-72 bg-gray-800 border-r border-gray-700'>
        <div className='p-6'>
          <h1 className='text-lg font-bold text-teal-400'>{sidebarTitle}</h1>
          {sidebarSubtitle && (
            <p className='text-sm text-gray-400 mt-1'>{sidebarSubtitle}</p>
          )}
        </div>

        {/* Sidebar content */}
        <div className='px-4'>{sidebarContent}</div>
      </div>

      {/* Main content */}
      <div className='flex-1'>
        {/* Header */}
        <div className='bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between'>
          {/* Search */}
          <div className='w-96 relative'>
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
              <FiSearch className='text-gray-400' />
            </div>
            <Input
              type='search'
              placeholder={searchPlaceholder}
              className='bg-gray-700 border-gray-600 text-white pl-10 placeholder:text-gray-400 focus:border-teal-500'
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
            />
          </div>

          {/* Header actions (if any) */}
          {headerActions && <div>{headerActions}</div>}
        </div>

        {/* Main content area */}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}
