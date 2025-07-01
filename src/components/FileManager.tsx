'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  FiSearch,
  FiPlus,
  FiUpload,
  FiFolder,
  FiVideo,
  FiGrid,
  FiLayout,
  FiPieChart,
  FiStar,
  FiShare2,
  FiClock,
} from 'react-icons/fi';

interface NavItemProps {
  icon: React.ReactElement;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, children, active, onClick }: NavItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
        active
          ? 'bg-gray-100 text-gray-900'
          : 'bg-transparent text-gray-700 hover:bg-gray-50',
      )}
      onClick={onClick}
    >
      {icon}
      <span className={cn('text-sm', active ? 'font-semibold' : 'font-normal')}>
        {children}
      </span>
    </div>
  );
};

const FolderItem = ({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) => {
  return (
    <div className='flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200'>
      <div className='flex items-center gap-2'>
        <FiFolder size={16} className='text-gray-500' />
        <span className='text-sm text-gray-700'>{children}</span>
      </div>
      {count && (
        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
          {count}
        </span>
      )}
    </div>
  );
};

interface FileCardProps {
  title: string;
  type: string;
  size: string;
  date: string;
  thumbnail?: string;
  isFolder?: boolean;
}

const FileCard = ({
  title,
  type,
  size,
  date,
  thumbnail,
  isFolder,
}: FileCardProps) => {
  return (
    <Card className='cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group'>
      <div className='relative aspect-[4/3] overflow-hidden rounded-t-xl'>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width={400}
            height={300}
            className='w-full h-full object-cover transition-transform duration-200 group-hover:scale-105'
          />
        ) : (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              isFolder ? 'bg-blue-50' : 'bg-gray-50',
            )}
          >
            {isFolder ? (
              <FiFolder size={48} className='text-blue-500' />
            ) : (
              <FiVideo size={48} className='text-gray-400' />
            )}
          </div>
        )}
      </div>

      <CardContent className='p-4'>
        <div className='space-y-1'>
          <h3 className='font-semibold text-sm text-gray-900 line-clamp-1'>
            {title}
          </h3>
          <p className='text-xs text-gray-500'>
            {type} • {size}
          </p>
          <p className='text-xs text-gray-400'>{date}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function FileManager() {
  const sampleFiles = [
    {
      title: 'Q4 Sales Presentation',
      type: 'Presentation',
      size: '15.2 MB',
      date: '2 days ago',
      isFolder: false,
    },
    {
      title: 'Product Demo Videos',
      type: 'Folder',
      size: '5 items',
      date: '1 week ago',
      isFolder: true,
    },
    {
      title: '3D Render - Living Room',
      type: '3D Render',
      size: '45.8 MB',
      date: '3 days ago',
      isFolder: false,
    },
    {
      title: 'Client Proposals',
      type: 'Folder',
      size: '12 items',
      date: '5 days ago',
      isFolder: true,
    },
    {
      title: 'Architecture Plans',
      type: 'Documents',
      size: '8.3 MB',
      date: '1 week ago',
      isFolder: false,
    },
    {
      title: 'Marketing Assets',
      type: 'Folder',
      size: '24 items',
      date: '2 weeks ago',
      isFolder: true,
    },
  ];

  return (
    <div className='flex h-screen bg-white'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-50 border-r border-gray-200 p-4'>
        <div className='space-y-6'>
          {/* Search */}
          <div className='relative'>
            <FiSearch className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              type='search'
              placeholder='Buscar archivos...'
              className='pl-10'
            />
          </div>

          {/* Upload Button */}
          <Button className='w-full justify-start gap-3'>
            <FiUpload size={16} />
            Subir Archivo
          </Button>

          {/* Navigation */}
          <div className='space-y-1'>
            <NavItem icon={<FiGrid size={16} />} active>
              Todos los archivos
            </NavItem>
            <NavItem icon={<FiClock size={16} />}>Recientes</NavItem>
            <NavItem icon={<FiStar size={16} />}>Favoritos</NavItem>
            <NavItem icon={<FiShare2 size={16} />}>Compartidos</NavItem>
          </div>

          {/* Folders */}
          <div className='space-y-2'>
            <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Carpetas
            </h3>
            <div className='space-y-1'>
              <FolderItem count={12}>Proyectos</FolderItem>
              <FolderItem count={8}>Clientes</FolderItem>
              <FolderItem count={5}>Recursos</FolderItem>
              <FolderItem count={3}>Plantillas</FolderItem>
            </div>
          </div>

          {/* Storage */}
          <div className='space-y-3'>
            <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Almacenamiento
            </h3>
            <div className='space-y-2'>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-teal-600 h-2 rounded-full'
                  style={{ width: '65%' }}
                ></div>
              </div>
              <p className='text-xs text-gray-500'>6.5 GB de 10 GB usados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <div className='bg-white border-b border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Gestor de Archivos
              </h1>
              <p className='text-gray-600 mt-1'>
                Administra y organiza todos tus archivos
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <Button variant='outline' size='sm'>
                <FiLayout size={16} className='mr-2' />
                Vista Lista
              </Button>
              <Button variant='outline' size='sm'>
                <FiPieChart size={16} className='mr-2' />
                Estadísticas
              </Button>
              <Button size='sm'>
                <FiPlus size={16} className='mr-2' />
                Nuevo
              </Button>
            </div>
          </div>
        </div>

        {/* File Grid */}
        <div className='flex-1 p-6 overflow-auto'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
            {sampleFiles.map((file, index) => (
              <FileCard
                key={index}
                title={file.title}
                type={file.type}
                size={file.size}
                date={file.date}
                isFolder={file.isFolder}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
