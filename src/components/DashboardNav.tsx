'use client';

import { Box, Flex, Heading, Button, Text, Container } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardNav() {
  const { data: session } = useSession();
  const router = useRouter();

  // Extract first name from full name
  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return 'Usuario';
    return fullName.split(' ')[0];
  };

  return (
    <Box bg='gray.900' borderBottom='1px' borderColor='gray.700' py={4}>
      <Container maxW='7xl'>
        <Flex justify='space-between' align='center'>
          <Heading
            size='lg'
            color='teal.400'
            cursor='pointer'
            onClick={() => router.push('/dashboard')}
          >
            Dashboard Omnia
          </Heading>

          <Flex align='center' gap={4}>
            <Button
              variant='ghost'
              color='gray.300'
              _hover={{ color: 'white', bg: 'gray.700' }}
              onClick={() => router.push('/dashboard/renders')}
            >
              Mis Renders
            </Button>
            <Button
              bg='teal.600'
              color='white'
              _hover={{ bg: 'teal.500' }}
              onClick={() => router.push('/dashboard/renders/upload')}
            >
              Subir Render
            </Button>

            <Flex align='center' gap={2}>
              <Text fontSize='sm' color='gray.400'>
                Hola, {getFirstName(session?.user?.name)} 👋
              </Text>
              <Button
                size='sm'
                variant='outline'
                color='gray.300'
                borderColor='gray.600'
                _hover={{ bg: 'gray.700', color: 'white' }}
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Cerrar Sesión
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
