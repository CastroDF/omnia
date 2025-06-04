'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Stack,
  Card,
  Spinner,
  Center
} from '@chakra-ui/react';

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
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (session) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Container maxW="md" centerContent py={20}>
      <Card.Root>
        <Card.Body>
          <Stack gap={6} p={8} direction="column" align="center">
            <Heading size="xl" textAlign="center" color="teal.500">
              Omnia
            </Heading>
            <Text fontSize="lg" textAlign="center" color="gray.600">
              Plataforma de hosting 3D con integración AR
            </Text>
            <Text textAlign="center" color="gray.500">
              Inicia sesión para acceder a tu dashboard
            </Text>
            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              Continuar con Google
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
} 