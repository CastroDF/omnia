'use client';

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Stack,
  Card,
  Grid
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Container maxW="7xl" py={10}>
      <Stack gap={8}>
        <Box>
          <Heading size="xl" mb={2}>
            ¡Bienvenido de vuelta, {session?.user?.name?.split(' ')[0]}!
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Gestiona tus renders 3D y compártelos con realidad aumentada
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Card.Root>
            <Card.Body>
              <Stack gap={4}>
                <Heading size="lg" color="teal.500">
                  Subir Nuevo Render
                </Heading>
                <Text color="gray.600">
                  Sube tus archivos .obj y .mtl para crear un nuevo render 3D
                </Text>
                <Button 
                  colorScheme="teal" 
                  onClick={() => router.push('/dashboard/renders/upload')}
                >
                  Subir Render
                </Button>
              </Stack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Stack gap={4}>
                <Heading size="lg" color="blue.500">
                  Mis Renders
                </Heading>
                <Text color="gray.600">
                  Revisa y gestiona todos tus renders existentes
                </Text>
                <Button 
                  variant="outline" 
                  colorScheme="blue"
                  onClick={() => router.push('/dashboard/renders')}
                >
                  Ver Renders
                </Button>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Grid>

        <Box>
          <Heading size="md" mb={4}>
            ¿Cómo funciona Omnia?
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>1. Sube tu render</Text>
              <Text fontSize="sm" color="gray.600">
                Carga archivos .obj y .mtl de tu modelo 3D
              </Text>
            </Box>
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>2. Obtén tu enlace</Text>
              <Text fontSize="sm" color="gray.600">
                Recibe un enlace público para compartir
              </Text>
            </Box>
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>3. Comparte en AR</Text>
              <Text fontSize="sm" color="gray.600">
                Tus usuarios verán el modelo en realidad aumentada
              </Text>
            </Box>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
