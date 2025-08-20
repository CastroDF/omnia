'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FiMenu, FiX } from 'react-icons/fi';

interface DashboardNavProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function DashboardNav({
  onToggleSidebar,
  isSidebarOpen,
}: DashboardNavProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Extract first name from full name
  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return 'Usuario';
    return fullName.split(' ')[0];
  };

  return (
    <div className='bg-gray-900 border-b border-gray-700 py-4'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            {/* Mobile hamburger menu */}
            {onToggleSidebar && (
              <Button
                variant='ghost'
                size='sm'
                className='lg:hidden text-gray-300 hover:text-white hover:bg-gray-700 p-2'
                onClick={onToggleSidebar}
              >
                {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </Button>
            )}

            <h1
              className='text-xl font-bold text-teal-400 cursor-pointer'
              onClick={() => router.push('/dashboard')}
            >
              Dashboard Omnia
            </h1>
          </div>

          <div className='flex items-center gap-2 md:gap-4'>
            <Button
              variant='ghost'
              className='hidden md:flex text-gray-300 hover:text-white hover:bg-gray-700'
              onClick={() => router.push('/dashboard/renders')}
            >
              Mis Renders
            </Button>
            <Button
              className='hidden sm:flex bg-teal-600 hover:bg-teal-500 text-white'
              onClick={() => router.push('/dashboard/renders/upload')}
            >
              Subir Render
            </Button>

            <div className='flex items-center gap-2'>
              <span className='hidden sm:inline text-sm text-gray-400'>
                Hola, {getFirstName(session?.user?.name)} 👋
              </span>
              <span className='sm:hidden text-xs text-gray-400'>
                {getFirstName(session?.user?.name)} 👋
              </span>
              <Button
                size='sm'
                variant='outline'
                className='text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white text-xs sm:text-sm'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <span className='hidden sm:inline'>Cerrar Sesión</span>
                <span className='sm:hidden'>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
