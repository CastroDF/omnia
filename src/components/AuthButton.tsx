'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button disabled className='bg-teal-600 hover:bg-teal-700'>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <Button variant='destructive' onClick={() => signOut()}>
        Logout ({session.user?.name})
      </Button>
    );
  }

  return (
    <Button
      className='bg-teal-600 hover:bg-teal-700'
      onClick={() => signIn('google')}
    >
      Login with Google
    </Button>
  );
};

export default AuthButton;
