'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Heading,
  Stack,
  Card,
  Text,
  Button,
  Box,
  Grid,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { RenderData } from '@/types/render';

export default function RendersPage() {
  const [renders, setRenders] = useState<RenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchRenders();
  }, []);

  const fetchRenders = async () => {
    try {
      const response = await fetch('/api/renders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar renders');
      }

      setRenders(data.renders);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={10}>
        <Box p={4} bg="red.50" borderColor="red.200" borderWidth={1} borderRadius="md">
          <Text color="red.600">{error}</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={10}>
      <Stack gap={8}>
        <Box>
          <Heading size="xl" mb={2}>
            Mis Modelos AR
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Gestiona tus modelos de Realidad Aumentada y compártelos
          </Text>
        </Box>

        <Box textAlign="right">
          <Button 
            colorScheme="teal" 
            onClick={() => router.push('/dashboard/renders/upload')}
          >
            Subir Nuevo Modelo AR
          </Button>
        </Box>

        {renders.length === 0 ? (
          <Card.Root>
            <Card.Body>
              <Center py={20}>
                <Stack gap={4} textAlign="center">
                  <Heading size="md" color="gray.500">
                    No tienes modelos AR aún
                  </Heading>
                  <Text color="gray.600">
                    Sube tu primer modelo AR para compartirlo en Instagram Stories
                  </Text>
                  <Button 
                    colorScheme="teal" 
                    onClick={() => router.push('/dashboard/renders/upload')}
                  >
                    Subir Primer Modelo
                  </Button>
                </Stack>
              </Center>
            </Card.Body>
          </Card.Root>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {renders.map((render) => (
              <Card.Root key={render._id}>
                <Card.Body>
                  <Stack gap={4}>
                    <Box>
                      <Heading size="md" mb={2}>
                        {render.name}
                      </Heading>
                      {render.description && (
                        <Text color="gray.600" fontSize="sm">
                          {render.description}
                        </Text>
                      )}
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        <strong>Slug:</strong> {render.slug}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        <strong>Creado:</strong> {new Date(render.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="bold" mb={2}>Compatibilidad AR:</Text>
                      <Stack gap={1}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Text 
                            fontSize="xs" 
                            color={render.files.usdz ? "green.600" : "red.500"}
                            fontWeight="bold"
                          >
                            📱 iOS
                          </Text>
                          {render.files.usdz ? (
                            <Text fontSize="xs" color="green.600">
                              ✅ {render.files.usdz.originalName}
                            </Text>
                          ) : (
                            <Text fontSize="xs" color="red.500">
                              ❌ Falta .usdz
                            </Text>
                          )}
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={2}>
                          <Text 
                            fontSize="xs" 
                            color={render.files.glb ? "green.600" : "red.500"}
                            fontWeight="bold"
                          >
                            🤖 Android
                          </Text>
                          {render.files.glb ? (
                            <Text fontSize="xs" color="green.600">
                              ✅ {render.files.glb.originalName}
                            </Text>
                          ) : (
                            <Text fontSize="xs" color="red.500">
                              ❌ Falta .glb
                            </Text>
                          )}
                        </Box>

                        {/* Mostrar archivos legacy si existen */}
                        {(render.files.obj || render.files.mtl) && (
                          <Box mt={2} pt={2} borderTop="1px" borderColor="gray.200">
                            <Text fontSize="2xs" color="gray.400" mb={1}>
                              Archivos legacy:
                            </Text>
                            {render.files.obj && (
                              <Text fontSize="2xs" color="gray.400">
                                • {render.files.obj.originalName}
                              </Text>
                            )}
                            {render.files.mtl && (
                              <Text fontSize="2xs" color="gray.400">
                                • {render.files.mtl.originalName}
                              </Text>
                            )}
                          </Box>
                        )}
                      </Stack>
                    </Box>

                    <Stack direction="column" gap={2}>
                      <Stack direction="row" gap={2}>
                        <Button 
                          size="sm" 
                          colorScheme="teal" 
                          onClick={() => window.open(`/render/${render.slug}`, '_blank')}
                        >
                          Ver AR
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/render/${render.slug}`);
                            // TODO: Agregar toast de confirmación
                          }}
                        >
                          Copiar Link
                        </Button>
                      </Stack>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => router.push(`/dashboard/renders/${render.slug}/edit`)}
                      >
                        🔧 Editar Archivos AR
                      </Button>
                    </Stack>
                  </Stack>
                </Card.Body>
              </Card.Root>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
