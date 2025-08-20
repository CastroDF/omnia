'use client';

import SidebarLayout from '@/components/layouts/SidebarLayout';
import UploadRenderForm from '@/components/UploadRenderForm';
import { Button } from '@/components/ui/button';
import {
  FiBox,
  FiSmartphone,
  FiTablet,
  FiInfo,
  FiArrowLeft,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  // Sidebar content for upload page
  const sidebarContent = (
    <div className='space-y-4'>
      {/* Back to renders */}
      <Button
        variant='ghost'
        onClick={() => router.push('/dashboard/renders')}
        className='w-full justify-start'
      >
        <FiArrowLeft className='mr-2' />
        Volver a Mis Renders
      </Button>

      {/* Upload info */}
      <div className='p-4 bg-teal-900 rounded-lg border border-teal-700'>
        <div className='flex items-center gap-2 mb-3'>
          <FiInfo className='text-teal-400' />
          <span className='font-semibold text-teal-300 text-sm'>
            Información AR
          </span>
        </div>
        <div className='space-y-2 text-xs'>
          <div className='flex items-center gap-2'>
            <FiSmartphone className='text-teal-400' size={14} />
            <span className='text-teal-100'>
              <span className='font-semibold'>iOS:</span> Archivo .usdz
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <FiTablet className='text-teal-400' size={14} />
            <span className='text-teal-100'>
              <span className='font-semibold'>Android:</span> Archivo .glb
            </span>
          </div>
          <p className='text-green-300 text-xs mt-2'>
            💡 Sube ambos para máxima compatibilidad
          </p>
        </div>
      </div>

      {/* Quick tips */}
      <div className='p-4 bg-gray-700 rounded-lg border border-gray-600'>
        <p className='font-semibold text-white text-sm mb-2'>
          📋 Consejos rápidos
        </p>
        <div className='space-y-1 text-xs text-gray-300'>
          <p>• Usa nombres descriptivos</p>
          <p>• Archivos optimizados funcionan mejor</p>
          <p>• Prueba en dispositivos reales</p>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarLayout
      sidebarTitle='Subir Modelo AR'
      sidebarSubtitle='Crea experiencias de Realidad Aumentada'
      sidebarContent={sidebarContent}
      searchPlaceholder='Buscar archivos...'
      headerActions={
        <Button
          variant='outline'
          onClick={() => router.push('/dashboard/renders')}
        >
          <FiBox className='mr-2' />
          Ver Mis Modelos
        </Button>
      }
    >
      <div className='max-w-4xl mx-auto'>
        <UploadRenderForm />
      </div>
    </SidebarLayout>
  );
}
