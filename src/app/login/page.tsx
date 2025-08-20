'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500'></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500'></div>
      </div>
    );
  }

  return (
    <div className='container max-w-md mx-auto px-4 py-20 flex flex-col items-center'>
      <Card className='w-full'>
        <CardContent className='p-8'>
          <div className='flex flex-col items-center space-y-6'>
            <h1 className='text-3xl font-bold text-center text-teal-500'>
              Omnia
            </h1>
            <p className='text-lg text-center text-gray-600'>
              Plataforma de hosting 3D con integración AR
            </p>
            <p className='text-center text-gray-500'>
              Inicia sesión para acceder a tu dashboard
            </p>
            <Button
              size='lg'
              className='w-full bg-teal-600 hover:bg-teal-700'
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              Continuar con Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
