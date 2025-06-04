'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Heading,
  Stack,
  Card,
  Text,
  Button,
  Box,
  Input,
  VStack,
  HStack,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { RenderData } from '@/types/render';

export default function EditRenderPage() {
  const [render, setRender] = useState<RenderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [usdzFile, setUsdzFile] = useState<File | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);

  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      fetchRender();
    }
  }, [slug]);

  const fetchRender = async () => {
    try {
      const response = await fetch(`/api/renders/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar el modelo');
      }

      setRender(data.render);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFiles = async () => {
    if (!usdzFile && !glbFile) {
      setError('Selecciona al menos un archivo para subir');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();

      if (usdzFile) {
        formData.append('usdzFile', usdzFile);
      }

      if (glbFile) {
        formData.append('glbFile', glbFile);
      }

      const response = await fetch(`/api/renders/${slug}/files`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir archivos');
      }

      setSuccess('Archivos subidos exitosamente');
      setUsdzFile(null);
      setGlbFile(null);

      // Recargar datos del render
      await fetchRender();
    } catch (error) {
      console.error('Error:', error);
      setError(
        error instanceof Error ? error.message : 'Error al subir archivos',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileType: 'usdz' | 'glb') => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el archivo ${fileType.toUpperCase()}?`,
      )
    ) {
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/renders/${slug}/files/${fileType}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar archivo');
      }

      setSuccess(`Archivo ${fileType.toUpperCase()} eliminado exitosamente`);

      // Recargar datos del render
      await fetchRender();
    } catch (error) {
      console.error('Error:', error);
      setError(
        error instanceof Error ? error.message : 'Error al eliminar archivo',
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Center h='50vh'>
        <Spinner size='xl' color='teal.500' />
      </Center>
    );
  }

  if (error && !render) {
    return (
      <Container maxW='4xl' py={10}>
        <Box
          p={4}
          bg='red.50'
          borderColor='red.200'
          borderWidth={1}
          borderRadius='md'
        >
          <Text color='red.600'>{error}</Text>
        </Box>
      </Container>
    );
  }

  if (!render) {
    return (
      <Container maxW='4xl' py={10}>
        <Text>Modelo no encontrado</Text>
      </Container>
    );
  }

  return (
    <Container maxW='4xl' py={10}>
      <Stack gap={8}>
        {/* Header */}
        <Box>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push('/dashboard/renders')}
            mb={4}
          >
            ← Volver a Mis Modelos
          </Button>

          <Heading size='xl' mb={2}>
            Editar Archivos AR
          </Heading>
          <Text color='gray.600' fontSize='lg'>
            {render.name}
          </Text>
          {render.description && (
            <Text color='gray.500' fontSize='md'>
              {render.description}
            </Text>
          )}
        </Box>

        {/* Mensajes */}
        {error && (
          <Box
            p={4}
            bg='red.50'
            borderColor='red.200'
            borderWidth={1}
            borderRadius='md'
          >
            <Text color='red.600'>{error}</Text>
          </Box>
        )}

        {success && (
          <Box
            p={4}
            bg='green.50'
            borderColor='green.200'
            borderWidth={1}
            borderRadius='md'
          >
            <Text color='green.600'>{success}</Text>
          </Box>
        )}

        {/* Estado actual */}
        <Card.Root>
          <Card.Header>
            <Heading size='md'>Estado Actual</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Box>
                <HStack justify='space-between' align='center'>
                  <Box>
                    <Text
                      fontWeight='bold'
                      color={render.files.usdz ? 'green.600' : 'red.500'}
                    >
                      📱 iOS (.usdz)
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      {render.files.usdz
                        ? `✅ ${render.files.usdz.originalName}`
                        : '❌ No disponible'}
                    </Text>
                  </Box>
                  {render.files.usdz && (
                    <Button
                      size='sm'
                      colorScheme='red'
                      variant='outline'
                      onClick={() => handleDeleteFile('usdz')}
                      disabled={uploading}
                    >
                      Eliminar
                    </Button>
                  )}
                </HStack>
              </Box>

              <Box>
                <HStack justify='space-between' align='center'>
                  <Box>
                    <Text
                      fontWeight='bold'
                      color={render.files.glb ? 'green.600' : 'red.500'}
                    >
                      🤖 Android (.glb)
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      {render.files.glb
                        ? `✅ ${render.files.glb.originalName}`
                        : '❌ No disponible'}
                    </Text>
                  </Box>
                  {render.files.glb && (
                    <Button
                      size='sm'
                      colorScheme='red'
                      variant='outline'
                      onClick={() => handleDeleteFile('glb')}
                      disabled={uploading}
                    >
                      Eliminar
                    </Button>
                  )}
                </HStack>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Subir nuevos archivos */}
        <Card.Root>
          <Card.Header>
            <Heading size='md'>Subir Archivos AR</Heading>
          </Card.Header>
          <Card.Body>
            <VStack gap={6}>
              <Box w='full'>
                <Text fontWeight='bold' mb={2}>
                  Archivo USDZ{' '}
                  <Box
                    as='span'
                    bg='blue.100'
                    color='blue.800'
                    px={2}
                    py={1}
                    borderRadius='md'
                    fontSize='xs'
                  >
                    iOS AR
                  </Box>
                </Text>
                <Input
                  type='file'
                  accept='.usdz'
                  onChange={e => setUsdzFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                  pt={1}
                />
                <Text fontSize='sm' color='gray.600' mt={1}>
                  Para AR nativo en iPhone/iPad usando Quick Look
                </Text>
                {usdzFile && (
                  <Text fontSize='xs' color='green.600' mt={1}>
                    ✅ Archivo seleccionado: {usdzFile.name}
                  </Text>
                )}
              </Box>

              <Box w='full'>
                <Text fontWeight='bold' mb={2}>
                  Archivo GLB{' '}
                  <Box
                    as='span'
                    bg='green.100'
                    color='green.800'
                    px={2}
                    py={1}
                    borderRadius='md'
                    fontSize='xs'
                  >
                    Android AR
                  </Box>
                </Text>
                <Input
                  type='file'
                  accept='.glb'
                  onChange={e => setGlbFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                  pt={1}
                />
                <Text fontSize='sm' color='gray.600' mt={1}>
                  Para AR nativo en Android usando Scene Viewer
                </Text>
                {glbFile && (
                  <Text fontSize='xs' color='green.600' mt={1}>
                    ✅ Archivo seleccionado: {glbFile.name}
                  </Text>
                )}
              </Box>

              <Button
                colorScheme='teal'
                size='lg'
                w='full'
                onClick={handleUploadFiles}
                disabled={(!usdzFile && !glbFile) || uploading}
                loading={uploading}
              >
                {uploading ? 'Subiendo...' : 'Subir Archivos'}
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Enlace del modelo */}
        <Card.Root>
          <Card.Header>
            <Heading size='md'>Enlace Público</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={3}>
              <Box
                p={3}
                bg='gray.50'
                borderRadius='md'
                fontFamily='mono'
                fontSize='sm'
              >
                {window.location.origin}/render/{render.slug}
              </Box>
              <HStack>
                <Button
                  size='sm'
                  colorScheme='teal'
                  onClick={() =>
                    window.open(`/render/${render.slug}`, '_blank')
                  }
                >
                  Ver Modelo AR
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/render/${render.slug}`,
                    );
                    setSuccess('¡Enlace copiado al portapapeles!');
                  }}
                >
                  Copiar Enlace
                </Button>
              </HStack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Container>
  );
}
