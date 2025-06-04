'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Card,
  Center,
} from '@chakra-ui/react';
import { RenderData } from '@/types/render';

interface RenderViewerProps {
  render: RenderData;
}

export default function RenderViewerR3F({ render }: RenderViewerProps) {
  const [deviceType, setDeviceType] = useState<
    'ios' | 'android' | 'desktop' | 'unknown'
  >('unknown');
  const [arCapability, setARCapability] = useState<
    'available' | 'no-files' | 'not-supported'
  >('not-supported');

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;

      // Detect iOS
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        setDeviceType('ios');
        // AR available if .usdz file exists
        if (render.files.usdz) {
          setARCapability('available');
        } else {
          setARCapability('no-files');
        }
        return;
      }

      // Detect Android
      if (/Android/.test(userAgent)) {
        setDeviceType('android');
        // AR available if .glb file exists
        if (render.files.glb) {
          setARCapability('available');
        } else {
          setARCapability('no-files');
        }
        return;
      }

      // Desktop or other devices
      setDeviceType('desktop');
      setARCapability('not-supported');
    };

    detectDevice();
  }, [render.files]);

  const getARButtonText = () => {
    switch (deviceType) {
      case 'ios':
        return arCapability === 'available'
          ? '🥽 Ver en AR (iOS)'
          : '📱 AR no disponible (falta .usdz)';
      case 'android':
        return arCapability === 'available'
          ? '🥽 Ver en AR (Android)'
          : '📱 AR no disponible (falta .glb)';
      case 'desktop':
        return '💻 AR solo en móviles';
      default:
        return 'AR No Disponible';
    }
  };

  const getARButtonColor = () => {
    return arCapability === 'available' ? 'teal' : 'gray';
  };

  const handleARClick = () => {
    if (arCapability !== 'available') {
      let message = '';

      switch (deviceType) {
        case 'ios':
          message =
            '📱 AR para iOS requiere archivo .usdz\n\n💡 Pide al creador que suba un archivo .usdz para usar AR nativo en iPhone/iPad';
          break;
        case 'android':
          message =
            '🤖 AR para Android requiere archivo .glb\n\n💡 Pide al creador que suba un archivo .glb para usar AR nativo en Android';
          break;
        case 'desktop':
          message =
            '📱 AR nativo solo está disponible en dispositivos móviles\n\n✅ Para usar AR:\n• Abre este enlace en tu iPhone/Android\n• El creador debe haber subido archivos .usdz/.glb';
          break;
        default:
          message = '🚫 Tu dispositivo no soporta AR nativo';
      }

      alert(message);
      return;
    }

    // AR available - create native links
    if (deviceType === 'ios' && render.files.usdz) {
      // iOS: use Quick Look with rel="ar"
      const link = document.createElement('a');
      link.href = render.files.usdz.url;
      link.rel = 'ar';
      link.download = render.files.usdz.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (deviceType === 'android' && render.files.glb) {
      // Android: use Scene Viewer with intent://
      const fallbackUrl = encodeURIComponent(window.location.href);
      const modelUrl = encodeURIComponent(render.files.glb.url);

      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar_preferred&title=${encodeURIComponent(render.name)}&browser_fallback_url=${fallbackUrl}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallbackUrl};end`;

      window.location.href = intentUrl;
    }
  };

  return (
    <Box minH='100vh' bg='gray.50'>
      <Container maxW='full' p={0}>
        {/* Header */}
        <Box bg='white' borderBottom='1px' borderColor='gray.200' p={4}>
          <Container maxW='7xl'>
            <Stack gap={3}>
              <Box>
                <Heading size={{ base: 'lg', md: 'xl' }} mb={1}>
                  {render.name}
                </Heading>
                {render.description && (
                  <Text color='gray.600' fontSize={{ base: 'sm', md: 'lg' }}>
                    {render.description}
                  </Text>
                )}
              </Box>

              <Stack direction={{ base: 'column', sm: 'row' }} gap={3}>
                <Button
                  colorScheme={getARButtonColor()}
                  size={{ base: 'sm', md: 'md' }}
                  onClick={handleARClick}
                >
                  {getARButtonText()}
                </Button>
                <Button
                  variant='outline'
                  size={{ base: 'sm', md: 'md' }}
                  onClick={() => window.location.reload()}
                >
                  Reiniciar
                </Button>
              </Stack>

              <Text fontSize='xs' color='gray.500'>
                {new Date(render.createdAt).toLocaleDateString()} •{' '}
                {render.userEmail}
              </Text>
            </Stack>
          </Container>
        </Box>

        {/* Contenido principal - Vista previa y información */}
        <Container maxW='4xl' py={8}>
          <Stack gap={6}>
            {/* Card de vista previa */}
            <Card.Root>
              <Card.Body p={8}>
                <Center>
                  <Stack gap={4} textAlign='center' maxW='md'>
                    <Box fontSize='6xl'>🥽</Box>
                    <Heading size='lg'>Experiencia AR Lista</Heading>
                    <Text color='gray.600'>
                      Este modelo está optimizado para Realidad Aumentada nativa
                      en tu dispositivo móvil.
                    </Text>

                    <Button
                      colorScheme={getARButtonColor()}
                      size='lg'
                      onClick={handleARClick}
                    >
                      {getARButtonText()}
                    </Button>
                  </Stack>
                </Center>
              </Card.Body>
            </Card.Root>

            {/* Información de compatibilidad */}
            <Card.Root>
              <Card.Header>
                <Heading size='md'>Compatibilidad</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  <Box>
                    <Text
                      fontWeight='bold'
                      color={render.files.usdz ? 'green.600' : 'red.500'}
                    >
                      📱 iOS (iPhone/iPad)
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      {render.files.usdz
                        ? `✅ Compatible - Archivo ${render.files.usdz.originalName}`
                        : '❌ No compatible - Falta archivo .usdz'}
                    </Text>
                  </Box>

                  <Box>
                    <Text
                      fontWeight='bold'
                      color={render.files.glb ? 'green.600' : 'red.500'}
                    >
                      🤖 Android
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      {render.files.glb
                        ? `✅ Compatible - Archivo ${render.files.glb.originalName}`
                        : '❌ No compatible - Falta archivo .glb'}
                    </Text>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Instrucciones */}
            <Card.Root>
              <Card.Header>
                <Heading size='md'>Cómo usar AR</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  <Box>
                    <Text fontWeight='bold'>📱 En iOS (iPhone/iPad):</Text>
                    <Text fontSize='sm' color='gray.600'>
                      Toca "Ver en AR" para abrir Quick Look y coloca el modelo
                      en tu espacio real
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight='bold'>🤖 En Android:</Text>
                    <Text fontSize='sm' color='gray.600'>
                      Toca "Ver en AR" para abrir Scene Viewer de Google y
                      experimentar AR
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight='bold'>💻 En Desktop:</Text>
                    <Text fontSize='sm' color='gray.600'>
                      Comparte este enlace con dispositivos móviles para la
                      experiencia AR completa
                    </Text>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Botón para compartir */}
            <Box textAlign='center'>
              <Button
                size='lg'
                variant='outline'
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: render.name,
                      text: `Mira este modelo en AR: ${render.name}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('¡Enlace copiado! Compártelo en tus historias de IG');
                  }
                }}
              >
                📱 Compartir en Instagram Stories
              </Button>
            </Box>
          </Stack>
        </Container>
      </Container>
    </Box>
  );
}
