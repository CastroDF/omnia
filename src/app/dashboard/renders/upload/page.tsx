'use client';

import UploadRenderForm from '@/components/UploadRenderForm';
import { Button } from '@/components/ui/button';
import { FiBox, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  return (
    <div className='p-4 sm:p-6'>
      {/* Page Header */}
      <div className='mb-6 sm:mb-8'>
        {/* Back Button - Full width on mobile */}
        <div className='mb-4 sm:mb-0'>
          <Button
            variant='ghost'
            onClick={() => router.push('/dashboard/renders')}
            className='w-full sm:w-auto text-gray-300 hover:text-white hover:bg-gray-700'
          >
            <FiArrowLeft className='mr-2' />
            Volver a Mis Renders
          </Button>
        </div>

        {/* Title and Description - Stacked on mobile */}
        <div className='mb-4 sm:mb-0'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-teal-400 mb-2'>
            Subir Modelo AR
          </h1>
          <p className='text-sm sm:text-base text-gray-400'>
            Crea experiencias de Realidad Aumentada
          </p>
        </div>

        {/* Action Button - Full width on mobile */}
        <div className='mt-4 sm:mt-0'>
          <Button
            variant='outline'
            onClick={() => router.push('/dashboard/renders')}
            className='w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
          >
            <FiBox className='mr-2' />
            Ver Mis Modelos
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className='max-w-4xl mx-auto'>
        <UploadRenderForm />
      </div>
    </div>
  );
}
