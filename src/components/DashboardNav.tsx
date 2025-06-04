'use client';

import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  Text,
  Container
} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardNav() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
      <Container maxW="7xl">
        <Flex justify="space-between" align="center">
          <Heading 
            size="lg" 
            color="teal.500" 
            cursor="pointer"
            onClick={() => router.push('/dashboard')}
          >
            Omnia Dashboard
          </Heading>
          
          <Flex align="center" gap={4}>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard/renders')}
            >
              Mis Renders
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={() => router.push('/dashboard/renders/upload')}
            >
              Subir Render
            </Button>
            
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color="gray.600">
                {session?.user?.name}
              </Text>
              <Button 
                size="sm" 
                variant="outline" 
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