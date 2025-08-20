'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RenderData } from '@/types/render';
import React from 'react';
import { useSidebar } from '@/components/layouts/DashboardWrapper';
import {
  useAppStore,
  trackActivity,
  useRecentActivities,
  RecentActivity,
} from '@/lib/store';
import {
  FiPlus,
  FiLayout,
  FiPieChart,
  FiClock,
  FiSmartphone,
  FiTablet,
  FiBox,
  FiEye,
  FiCopy,
  FiEdit3,
  FiX,
  FiCalendar,
  FiActivity,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactElement;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

const NavItem = ({ icon, children, active, onClick, count }: NavItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
        active
          ? 'bg-gray-700 text-white'
          : 'bg-transparent text-white hover:bg-gray-700',
      )}
      onClick={onClick}
    >
      <div className='flex items-center gap-3'>
        {icon}
        <span
          className={cn('text-sm', active ? 'font-semibold' : 'font-normal')}
        >
          {children}
        </span>
      </div>
      {count !== undefined && (
        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-500 text-white'>
          {count}
        </span>
      )}
    </div>
  );
};

interface RenderCardProps {
  render: RenderData;
  onViewAR: (slug: string) => void;
  onCopyLink: (slug: string) => void;
  onEdit: (slug: string) => void;
}

const RenderCard = ({
  render,
  onViewAR,
  onCopyLink,
  onEdit,
}: RenderCardProps) => {
  const hasIOS = Boolean(render.files.usdz);
  const hasAndroid = Boolean(render.files.glb);
  const isFullyCompatible = hasIOS && hasAndroid;

  return (
    <Card className='bg-gray-800 border-gray-700 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-teal-500'>
      <div className='relative aspect-[4/3] overflow-hidden rounded-t-xl'>
        <div className='w-full h-full bg-gray-700 flex items-center justify-center relative'>
          <FiBox size={64} className='text-teal-500' />

          {/* AR Compatibility indicators */}
          <div className='absolute top-3 right-3 flex gap-1'>
            {hasIOS && (
              <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500 text-white'>
                📱 iOS
              </span>
            )}
            {hasAndroid && (
              <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500 text-white'>
                🤖 Android
              </span>
            )}
          </div>

          {/* Status indicator */}
          <div className='absolute top-3 left-3'>
            <span
              className={cn(
                'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                isFullyCompatible
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-black',
              )}
            >
              {isFullyCompatible ? 'AR Completo' : 'Parcial'}
            </span>
          </div>
        </div>
      </div>

      <CardContent className='p-4'>
        <div className='space-y-3'>
          {/* Header info */}
          <div className='w-full'>
            <h3 className='font-bold text-md text-white line-clamp-1'>
              {render.name}
            </h3>
            {render.description && (
              <p className='text-sm text-gray-400 line-clamp-2 mt-1'>
                {render.description}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className='space-y-1 w-full'>
            <p className='text-xs text-gray-500'>
              <span className='font-semibold'>Slug:</span> {render.slug}
            </p>
            <p className='text-xs text-gray-500'>
              <span className='font-semibold'>Creado:</span>{' '}
              {new Date(render.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* AR Compatibility Details */}
          <div className='w-full'>
            <p className='text-xs font-bold text-gray-300 mb-2'>
              Compatibilidad AR:
            </p>
            <div className='space-y-1'>
              <div className='flex items-center gap-2 w-full'>
                <FiSmartphone
                  size={12}
                  className={hasIOS ? 'text-green-400' : 'text-red-400'}
                />
                <p
                  className={cn(
                    'text-xs',
                    hasIOS ? 'text-green-400' : 'text-red-400',
                  )}
                >
                  iOS:{' '}
                  {hasIOS
                    ? `✅ ${render.files.usdz?.originalName}`
                    : '❌ Falta .usdz'}
                </p>
              </div>

              <div className='flex items-center gap-2 w-full'>
                <FiTablet
                  size={12}
                  className={hasAndroid ? 'text-green-400' : 'text-red-400'}
                />
                <p
                  className={cn(
                    'text-xs',
                    hasAndroid ? 'text-green-400' : 'text-red-400',
                  )}
                >
                  Android:{' '}
                  {hasAndroid
                    ? `✅ ${render.files.glb?.originalName}`
                    : '❌ Falta .glb'}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-2 pt-2'>
            <Button
              size='sm'
              variant='default'
              className='flex-1 text-xs'
              onClick={() => onViewAR(render.slug)}
            >
              <FiEye className='mr-1' />
              Ver AR
            </Button>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                className='flex-1 text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                onClick={() => onCopyLink(render.slug)}
              >
                <FiCopy className='mr-1' />
                Copiar
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='flex-1 text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                onClick={() => onEdit(render.slug)}
              >
                <FiEdit3 className='mr-1' />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Recientes View Component
const RecientesView = () => {
  const recentActivities = useRecentActivities();

  if (recentActivities.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-96 text-center px-4'>
        <FiClock size={48} className='text-gray-600 mb-4' />
        <h3 className='text-xl font-bold text-white mb-2'>
          No hay actividad reciente
        </h3>
        <p className='text-gray-400 mb-6 max-w-md'>
          Tus actividades recientes aparecerán aquí cuando interactúes con tus
          modelos AR.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold text-white mb-4'>Actividad Reciente</h2>
      <div className='space-y-3'>
        {recentActivities.map(activity => (
          <Card key={activity.id} className='bg-gray-800 border-gray-700'>
            <CardContent className='p-4'>
              <div className='flex items-start gap-3'>
                <div className='flex-shrink-0 mt-1'>
                  {activity.type === 'render_created' && (
                    <FiPlus className='text-green-400' size={16} />
                  )}
                  {activity.type === 'render_viewed' && (
                    <FiEye className='text-blue-400' size={16} />
                  )}
                  {activity.type === 'render_edited' && (
                    <FiEdit3 className='text-yellow-400' size={16} />
                  )}
                  {activity.type === 'render_shared' && (
                    <FiCopy className='text-purple-400' size={16} />
                  )}
                </div>
                <div className='flex-1'>
                  <h4 className='text-white font-medium text-sm'>
                    {activity.title}
                  </h4>
                  <p className='text-gray-400 text-xs mt-1'>
                    {activity.description}
                  </p>
                  <p className='text-gray-500 text-xs mt-2'>
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Analytics View Component
const AnalyticsView = ({ renders }: { renders: RenderData[] }) => {
  const totalRenders = renders.length;
  const completeRenders = renders.filter(
    r => r.files.usdz && r.files.glb,
  ).length;
  const iosOnlyRenders = renders.filter(
    r => r.files.usdz && !r.files.glb,
  ).length;
  const androidOnlyRenders = renders.filter(
    r => !r.files.usdz && r.files.glb,
  ).length;

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-bold text-white mb-4'>Analytics</h2>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='bg-gray-800 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-teal-600 rounded-lg'>
                <FiBox className='text-white' size={20} />
              </div>
              <div>
                <p className='text-gray-400 text-xs'>Total Modelos</p>
                <p className='text-white text-xl font-bold'>{totalRenders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-600 rounded-lg'>
                <FiTrendingUp className='text-white' size={20} />
              </div>
              <div>
                <p className='text-gray-400 text-xs'>AR Completo</p>
                <p className='text-white text-xl font-bold'>
                  {completeRenders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-600 rounded-lg'>
                <FiSmartphone className='text-white' size={20} />
              </div>
              <div>
                <p className='text-gray-400 text-xs'>Solo iOS</p>
                <p className='text-white text-xl font-bold'>{iosOnlyRenders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-orange-600 rounded-lg'>
                <FiTablet className='text-white' size={20} />
              </div>
              <div>
                <p className='text-gray-400 text-xs'>Solo Android</p>
                <p className='text-white text-xl font-bold'>
                  {androidOnlyRenders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className='bg-gray-800 border-gray-700'>
        <CardContent className='p-6'>
          <div className='text-center'>
            <FiActivity size={48} className='text-gray-600 mx-auto mb-4' />
            <h3 className='text-lg font-bold text-white mb-2'>
              Más métricas próximamente
            </h3>
            <p className='text-gray-400'>
              Estamos trabajando en analytics avanzados incluyendo vistas de
              modelos, engagement de usuarios, y métricas de rendimiento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function RendersPage() {
  const [renders, setRenders] = useState<RenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<
    'all' | 'analytics' | 'recientes'
  >('all');
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const recentActivities = useRecentActivities();

  const router = useRouter();

  const fetchRenders = async () => {
    try {
      const response = await fetch('/api/renders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar renders');
      }

      setRenders(data.renders || []);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenders();
  }, []);

  const handleViewAR = (slug: string) => {
    router.push(`/render/${slug}`);
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/render/${slug}`;
    navigator.clipboard.writeText(url);
    alert('¡Enlace copiado!');
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/renders/${slug}/edit`);
  };

  const sidebarNavItems = [
    {
      icon: <FiLayout />,
      label: 'Todos los modelos',
      active: activeView === 'all',
      count: renders.length,
      onClick: () => setActiveView('all'),
    },
    {
      icon: <FiPieChart />,
      label: 'Analytics',
      active: activeView === 'analytics',
      onClick: () => setActiveView('analytics'),
    },
    {
      icon: <FiClock />,
      label: 'Recientes',
      active: activeView === 'recientes',
      count: recentActivities.length,
      onClick: () => setActiveView('recientes'),
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className='flex h-screen bg-gray-900 relative'>
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
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
                <p className='text-sm text-gray-400'>
                  Gestiona tus experiencias AR
                </p>
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
                  <span className='font-semibold text-white'>
                    {renders.length}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Con AR completo:</span>
                  <span className='font-semibold text-green-400'>
                    {
                      renders.filter(
                        r => Boolean(r.files.usdz) && Boolean(r.files.glb),
                      ).length
                    }
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Solo iOS:</span>
                  <span className='font-semibold text-yellow-400'>
                    {
                      renders.filter(
                        r => Boolean(r.files.usdz) && !Boolean(r.files.glb),
                      ).length
                    }
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Solo Android:</span>
                  <span className='font-semibold text-yellow-400'>
                    {
                      renders.filter(
                        r => !Boolean(r.files.usdz) && Boolean(r.files.glb),
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1 flex flex-col lg:ml-0'>
          {/* Header */}
          <div className='bg-gray-800 border-b border-gray-700 p-4 sm:p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-white'>
                  Mis Modelos AR
                </h1>
                <p className='text-gray-400 mt-1 text-sm sm:text-base'>
                  Gestiona y comparte tus experiencias de Realidad Aumentada
                </p>
              </div>

              <Button
                onClick={() => router.push('/dashboard/renders/upload')}
                className='bg-teal-600 hover:bg-teal-500 w-full sm:w-auto'
              >
                <FiPlus className='mr-2' />
                Subir Modelo
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 p-4 sm:p-6 overflow-auto'>
            {activeView === 'all' && (
              <>
                {renders.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-96 text-center px-4'>
                    <FiBox
                      size={48}
                      className='text-gray-600 mb-4 sm:w-16 sm:h-16'
                    />
                    <h3 className='text-lg sm:text-xl font-bold text-white mb-2'>
                      No tienes modelos AR
                    </h3>
                    <p className='text-gray-400 mb-6 max-w-md text-sm sm:text-base'>
                      Sube tu primer modelo 3D para comenzar a crear
                      experiencias de Realidad Aumentada increíbles.
                    </p>
                    <Button
                      onClick={() => router.push('/dashboard/renders/upload')}
                      className='bg-teal-600 hover:bg-teal-500 w-full sm:w-auto'
                    >
                      <FiPlus className='mr-2' />
                      Subir Mi Primer Modelo
                    </Button>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6'>
                    {renders.map(render => (
                      <RenderCard
                        key={render._id}
                        render={render}
                        onViewAR={handleViewAR}
                        onCopyLink={handleCopyLink}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeView === 'analytics' && <AnalyticsView renders={renders} />}

            {activeView === 'recientes' && <RecientesView />}
          </div>
        </div>
      </div>
    </>
  );
}
