'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Text,
  Heading,
  Input,
  Textarea,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { Button } from '@/ui/button/Button';
import { Card } from '@/ui/card/Card';
import {
  FiUpload,
  FiSmartphone,
  FiTablet,
  FiCheckCircle,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';

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
        setName('');
        setDescription('');
        setUsdzFile(null);
        setGlbFile(null);
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch {
      setResult({ success: false, error: 'Error al subir archivos' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <VStack gap={6} w='full'>
      {/* Main form card */}
      <Card.Root bg='gray.800' borderColor='gray.700' w='full'>
        <Card.Body>
          <Box as='form' onSubmit={handleSubmit}>
            <VStack gap={6}>
              {/* Basic information section */}
              <Box w='full'>
                <Heading size='md' color='white' mb={4}>
                  📝 Información del Modelo
                </Heading>

                <VStack gap={4}>
                  <Box w='full'>
                    <Text fontWeight='semibold' mb={2} color='gray.300'>
                      Nombre del modelo *
                    </Text>
                    <Input
                      type='text'
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder='Ej: Audi R8 2024'
                      bg='gray.700'
                      border='1px'
                      borderColor='gray.600'
                      color='white'
                      _placeholder={{ color: 'gray.400' }}
                      _focus={{
                        borderColor: 'teal.500',
                        boxShadow: '0 0 0 1px teal.500',
                      }}
                      borderRadius='lg'
                      required
                    />
                  </Box>

                  <Box w='full'>
                    <Text fontWeight='semibold' mb={2} color='gray.300'>
                      Descripción
                    </Text>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder='Describe tu modelo 3D...'
                      bg='gray.700'
                      border='1px'
                      borderColor='gray.600'
                      color='white'
                      _placeholder={{ color: 'gray.400' }}
                      _focus={{
                        borderColor: 'teal.500',
                        boxShadow: '0 0 0 1px teal.500',
                      }}
                      borderRadius='lg'
                      rows={3}
                      resize='vertical'
                    />
                  </Box>
                </VStack>
              </Box>

              {/* File upload sections */}
              <Box w='full'>
                <Heading size='md' color='white' mb={4}>
                  🥽 Archivos AR
                </Heading>

                <VStack gap={4}>
                  {/* USDZ File Upload */}
                  <Card.Root bg='gray.700' borderColor='gray.600' w='full'>
                    <Card.Body>
                      <VStack gap={3}>
                        <Flex align='center' justify='space-between' w='full'>
                          <Flex align='center' gap={3}>
                            <FiSmartphone size={20} color='teal' />
                            <Text fontWeight='semibold' color='white'>
                              Archivo USDZ
                            </Text>
                            <Badge colorPalette='blue' size='sm'>
                              iOS AR
                            </Badge>
                          </Flex>
                        </Flex>

                        <Box w='full'>
                          <Input
                            type='file'
                            accept='.usdz'
                            onChange={e =>
                              setUsdzFile(e.target.files?.[0] || null)
                            }
                            bg='gray.800'
                            border='1px'
                            borderColor='gray.500'
                            color='white'
                            _focus={{
                              borderColor: 'teal.500',
                              boxShadow: '0 0 0 1px teal.500',
                            }}
                            borderRadius='lg'
                            pt={1}
                          />
                          <Text fontSize='sm' color='gray.400' mt={2}>
                            Para AR nativo en iPhone/iPad usando Quick Look
                          </Text>
                          {usdzFile && (
                            <Flex align='center' gap={2} mt={2}>
                              <FiCheckCircle color='green' size={16} />
                              <Text fontSize='sm' color='green.400'>
                                Archivo seleccionado: {usdzFile.name}
                              </Text>
                            </Flex>
                          )}
                        </Box>
                      </VStack>
                    </Card.Body>
                  </Card.Root>

                  {/* GLB File Upload */}
                  <Card.Root bg='gray.700' borderColor='gray.600' w='full'>
                    <Card.Body>
                      <VStack gap={3}>
                        <Flex align='center' justify='space-between' w='full'>
                          <Flex align='center' gap={3}>
                            <FiTablet size={20} color='teal' />
                            <Text fontWeight='semibold' color='white'>
                              Archivo GLB
                            </Text>
                            <Badge colorPalette='green' size='sm'>
                              Android AR
                            </Badge>
                          </Flex>
                        </Flex>

                        <Box w='full'>
                          <Input
                            type='file'
                            accept='.glb'
                            onChange={e =>
                              setGlbFile(e.target.files?.[0] || null)
                            }
                            bg='gray.800'
                            border='1px'
                            borderColor='gray.500'
                            color='white'
                            _focus={{
                              borderColor: 'teal.500',
                              boxShadow: '0 0 0 1px teal.500',
                            }}
                            borderRadius='lg'
                            pt={1}
                          />
                          <Text fontSize='sm' color='gray.400' mt={2}>
                            Para AR nativo en Android usando Scene Viewer
                          </Text>
                          {glbFile && (
                            <Flex align='center' gap={2} mt={2}>
                              <FiCheckCircle color='green' size={16} />
                              <Text fontSize='sm' color='green.400'>
                                Archivo seleccionado: {glbFile.name}
                              </Text>
                            </Flex>
                          )}
                        </Box>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                </VStack>
              </Box>

              {/* Submit button */}
              <Button
                type='submit'
                variant='primary'
                size='lg'
                loading={isUploading}
                disabled={(!usdzFile && !glbFile) || !name || isUploading}
                w='full'
                leftIcon={<FiUpload />}
              >
                {isUploading ? 'Subiendo...' : 'Subir Modelo AR'}
              </Button>

              <Text fontSize='sm' color='gray.500' textAlign='center'>
                * Se requiere al menos un archivo (USDZ o GLB) y el nombre del
                modelo
              </Text>
            </VStack>
          </Box>
        </Card.Body>
      </Card.Root>

      {/* Upload progress */}
      {isUploading && (
        <Card.Root bg='gray.700' borderColor='gray.600' w='full'>
          <Card.Body>
            <VStack gap={3}>
              <Flex align='center' gap={2}>
                <FiUpload color='teal' />
                <Text color='white' fontWeight='semibold'>
                  Subiendo archivos...
                </Text>
              </Flex>
              <Box w='full'>
                <Box
                  w='full'
                  bg='gray.600'
                  borderRadius='full'
                  h='3'
                  overflow='hidden'
                >
                  <Box
                    bg='teal.500'
                    h='full'
                    borderRadius='full'
                    w={`${uploadProgress}%`}
                    transition='width 0.3s ease'
                  />
                </Box>
                <Text fontSize='sm' color='gray.400' mt={1} textAlign='center'>
                  {uploadProgress}% completado
                </Text>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}

      {/* Result */}
      {result && (
        <Card.Root
          bg={result.success ? 'green.900' : 'red.900'}
          borderColor={result.success ? 'green.700' : 'red.700'}
          w='full'
        >
          <Card.Body>
            {result.success ? (
              <VStack gap={4} align='start'>
                <Flex align='center' gap={2}>
                  <FiCheckCircle color='green' size={20} />
                  <Text fontWeight='bold' color='green.300' fontSize='lg'>
                    ¡Modelo AR subido exitosamente!
                  </Text>
                </Flex>

                <Box w='full'>
                  <Text color='green.200' mb={2}>
                    <Text as='span' fontWeight='semibold'>
                      Enlace público:
                    </Text>
                  </Text>
                  <Box
                    p={3}
                    bg='gray.800'
                    borderRadius='lg'
                    border='1px'
                    borderColor='gray.600'
                  >
                    <Text color='teal.400' fontFamily='mono' fontSize='sm'>
                      {typeof window !== 'undefined'
                        ? window.location.origin
                        : ''}
                      /render/{result.slug}
                    </Text>
                  </Box>
                </Box>

                {description && (
                  <Text color='green.200' fontSize='sm'>
                    <Text as='span' fontWeight='semibold'>
                      Descripción:
                    </Text>{' '}
                    {description}
                  </Text>
                )}

                <Box p={3} bg='teal.800' borderRadius='lg' w='full'>
                  <Text fontSize='sm' color='teal.100'>
                    💡 Comparte este enlace en Instagram Stories para AR nativo
                  </Text>
                </Box>

                <Button
                  variant='outline'
                  leftIcon={<FiArrowRight />}
                  onClick={() => router.push('/dashboard/renders')}
                  w='full'
                >
                  Ver Mis Modelos AR
                </Button>
              </VStack>
            ) : (
              <Flex align='center' gap={2}>
                <FiAlertCircle color='red' size={20} />
                <Text color='red.300'>{result.error}</Text>
              </Flex>
            )}
          </Card.Body>
        </Card.Root>
      )}
    </VStack>
  );
}
