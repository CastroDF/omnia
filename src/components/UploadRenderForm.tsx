'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Card,
  Heading,
} from '@chakra-ui/react';

interface UploadResponse {
  success: boolean;
  slug?: string;
  error?: string;
}

export default function UploadRenderForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [usdzFile, setUsdzFile] = useState<File | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usdzFile && !glbFile) {
      setResult({
        success: false,
        error: 'Se requiere al menos un archivo: USDZ (iOS) o GLB (Android)',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (usdzFile) {
      formData.append('usdzFile', usdzFile);
    }

    if (glbFile) {
      formData.append('glbFile', glbFile);
    }

    try {
      // Simular progreso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, slug: data.slug });
        // Limpiar formulario
        setName('');
        setDescription('');
        setUsdzFile(null);
        setGlbFile(null);
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      setResult({ success: false, error: 'Error al subir archivos' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <Card.Root maxW='2xl' mx='auto'>
      <Card.Header>
        <Heading size='lg'>Subir Modelo AR</Heading>
        <Text color='gray.600' mt={2}>
          Crea experiencias de Realidad Aumentada nativas para iOS y Android
        </Text>
      </Card.Header>

      <Card.Body>
        <Box as='form' onSubmit={handleSubmit}>
          <VStack gap={6}>
            {/* Información básica */}
            <Box w='full'>
              <Text fontWeight='bold' mb={2}>
                Nombre del modelo *
              </Text>
              <Input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Ej: Audi R8 2024'
              />
            </Box>

            <Box w='full'>
              <Text fontWeight='bold' mb={2}>
                Descripción
              </Text>
              <Input
                type='text'
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Describe tu modelo 3D...'
              />
            </Box>

            {/* Separador */}
            <Box w='full' h='1px' bg='gray.200' />

            {/* Archivos AR */}
            <Box w='full'>
              <Heading size='md' mb={3}>
                🥽 Archivos AR (al menos uno requerido)
              </Heading>

              <Box p={4} bg='blue.50' borderRadius='md' mb={4}>
                <Text fontWeight='bold' color='blue.800'>
                  Compatibilidad por plataforma:
                </Text>
                <VStack align='start' mt={2} gap={1}>
                  <Text fontSize='sm' color='blue.700'>
                    📱 <strong>iOS:</strong> Requiere archivo .usdz (Quick Look
                    AR)
                  </Text>
                  <Text fontSize='sm' color='blue.700'>
                    🤖 <strong>Android:</strong> Requiere archivo .glb (Scene
                    Viewer AR)
                  </Text>
                  <Text fontSize='sm' color='green.700'>
                    ✅ <strong>Tip:</strong> Sube ambos para máxima
                    compatibilidad
                  </Text>
                </VStack>
              </Box>

              <VStack gap={4}>
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
              </VStack>
            </Box>

            {/* Progreso de upload */}
            {isUploading && (
              <Box w='full'>
                <Text mb={2}>Subiendo archivos...</Text>
                <Box w='full' bg='gray.200' borderRadius='md' h='2'>
                  <Box
                    bg='teal.500'
                    h='full'
                    borderRadius='md'
                    w={`${uploadProgress}%`}
                    transition='width 0.3s ease'
                  />
                </Box>
              </Box>
            )}

            {/* Resultado */}
            {result && (
              <Box
                w='full'
                p={4}
                bg={result.success ? 'green.50' : 'red.50'}
                borderColor={result.success ? 'green.200' : 'red.200'}
                borderWidth={1}
                borderRadius='md'
              >
                {result.success ? (
                  <Box>
                    <Text fontWeight='bold' color='green.800'>
                      ¡Modelo AR subido exitosamente!
                    </Text>
                    <Text mt={2} color='green.700'>
                      <strong>Enlace público:</strong>{' '}
                      <Text as='span' color='teal.600' fontFamily='mono'>
                        /render/{result.slug}
                      </Text>
                    </Text>
                    {description && (
                      <Text mt={1} fontSize='sm' color='gray.600'>
                        {description}
                      </Text>
                    )}
                    <Text mt={2} fontSize='sm' color='green.600'>
                      💡 Comparte este enlace en Instagram Stories para AR
                      nativo
                    </Text>
                  </Box>
                ) : (
                  <Text color='red.800'>{result.error}</Text>
                )}
              </Box>
            )}

            {/* Botón de envío */}
            <Button
              type='submit'
              colorScheme='teal'
              size='lg'
              loading={isUploading}
              disabled={(!usdzFile && !glbFile) || !name || isUploading}
              w='full'
            >
              {isUploading ? 'Subiendo...' : 'Subir Modelo AR'}
            </Button>

            <Text fontSize='sm' color='gray.500' textAlign='center'>
              * Se requiere al menos un archivo (USDZ o GLB)
            </Text>
          </VStack>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
