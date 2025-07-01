'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className='container max-w-7xl mx-auto px-4 py-10'>
      <div className='space-y-8'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>
            ¡Bienvenido de vuelta, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className='text-gray-600 text-lg'>
            Gestiona tus renders 3D y compártelos con realidad aumentada
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <h2 className='text-xl font-bold text-teal-500'>
                  Subir Nuevo Render
                </h2>
                <p className='text-gray-600'>
                  Sube tus archivos .obj y .mtl para crear un nuevo render 3D
                </p>
                <Button
                  className='bg-teal-600 hover:bg-teal-700'
                  onClick={() => router.push('/dashboard/renders/upload')}
                >
                  Subir Render
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <h2 className='text-xl font-bold text-blue-500'>Mis Renders</h2>
                <p className='text-gray-600'>
                  Revisa y gestiona todos tus renders existentes
                </p>
                <Button
                  variant='outline'
                  className='border-blue-500 text-blue-500 hover:bg-blue-50'
                  onClick={() => router.push('/dashboard/renders')}
                >
                  Ver Renders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className='text-lg font-bold mb-4'>¿Cómo funciona Omnia?</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-gray-50 rounded-md'>
              <p className='font-bold mb-2'>1. Sube tu render</p>
              <p className='text-sm text-gray-600'>
                Carga archivos .obj y .mtl de tu modelo 3D
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-md'>
              <p className='font-bold mb-2'>2. Obtén tu enlace</p>
              <p className='text-sm text-gray-600'>
                Recibe un enlace público para compartir
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-md'>
              <p className='font-bold mb-2'>3. Comparte en AR</p>
              <p className='text-sm text-gray-600'>
                Tus usuarios verán el modelo en realidad aumentada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
