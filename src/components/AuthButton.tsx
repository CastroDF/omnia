'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@chakra-ui/react';

const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button loading colorScheme='teal'>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <Button colorScheme='red' onClick={() => signOut()}>
        Logout ({session.user?.name})
      </Button>
    );
  }

  return (
    <Button colorScheme='teal' onClick={() => signIn('google')}>
      Login with Google
    </Button>
  );
};

export default AuthButton;
