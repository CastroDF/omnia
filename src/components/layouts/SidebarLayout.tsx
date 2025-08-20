'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='flex h-screen bg-gray-900'>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-gray-800 border-r border-gray-700
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className='p-6'>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-lg font-bold text-teal-400'>{sidebarTitle}</h1>
              {sidebarSubtitle && <p className='text-sm text-gray-400 mt-1'>{sidebarSubtitle}</p>}
            </div>

            {/* Mobile close button */}
            <Button
              variant='ghost'
              size='sm'
              className='lg:hidden text-gray-400 hover:text-white hover:bg-gray-700 p-1'
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={20} />
            </Button>
          </div>
        </div>

        {/* Sidebar content */}
        <div className='px-4'>{sidebarContent}</div>
      </div>

      {/* Main content */}
      <div className='flex-1'>
        {/* Header */}
        <div className='bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between'>
          {/* Left side - Toggle button and search */}
          <div className='flex items-center gap-4'>
            {/* Sidebar toggle button */}
            <Button
              variant='ghost'
              size='sm'
              className='lg:hidden text-gray-400 hover:text-white hover:bg-gray-700 p-2'
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </Button>

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
