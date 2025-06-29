'use client';

import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import UploadRenderForm from '@/components/UploadRenderForm';
import { Button } from '@/ui/button/Button';
import {
  FiBox,
  FiSmartphone,
  FiTablet,
  FiInfo,
  FiArrowLeft,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  // Sidebar content for upload page
  const sidebarContent = (
    <VStack gap={4} align='start'>
      {/* Back to renders */}
      <Button
        variant='ghost'
        leftIcon={<FiArrowLeft />}
        onClick={() => router.push('/dashboard/renders')}
        w='full'
        justifyContent='flex-start'
      >
        Volver a Mis Renders
      </Button>

      {/* Upload info */}
      <Box
        p={4}
        bg='teal.900'
        borderRadius='lg'
        border='1px'
        borderColor='teal.700'
      >
        <Flex align='center' gap={2} mb={3}>
          <FiInfo color='teal' />
          <Text fontWeight='semibold' color='teal.300' fontSize='sm'>
            Información AR
          </Text>
        </Flex>
        <VStack align='start' gap={2} fontSize='xs'>
          <Flex align='center' gap={2}>
            <FiSmartphone color='teal' size={14} />
            <Text color='teal.100'>
              <Text as='span' fontWeight='semibold'>
                iOS:
              </Text>{' '}
              Archivo .usdz
            </Text>
          </Flex>
          <Flex align='center' gap={2}>
            <FiTablet color='teal' size={14} />
            <Text color='teal.100'>
              <Text as='span' fontWeight='semibold'>
                Android:
              </Text>{' '}
              Archivo .glb
            </Text>
          </Flex>
          <Text color='green.300' fontSize='xs' mt={2}>
            💡 Sube ambos para máxima compatibilidad
          </Text>
        </VStack>
      </Box>

      {/* Quick tips */}
      <Box
        p={4}
        bg='gray.700'
        borderRadius='lg'
        border='1px'
        borderColor='gray.600'
      >
        <Text fontWeight='semibold' color='white' fontSize='sm' mb={2}>
          📋 Consejos rápidos
        </Text>
        <VStack align='start' gap={1} fontSize='xs' color='gray.300'>
          <Text>• Usa nombres descriptivos</Text>
          <Text>• Archivos optimizados funcionan mejor</Text>
          <Text>• Prueba en dispositivos reales</Text>
          <Text>• Comparte en Instagram Stories</Text>
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <SidebarLayout
      sidebarTitle='Subir Modelo AR'
      sidebarSubtitle='Crea experiencias de Realidad Aumentada'
      sidebarContent={sidebarContent}
      searchPlaceholder='Buscar archivos...'
      headerActions={
        <Button
          variant='outline'
          leftIcon={<FiBox />}
          onClick={() => router.push('/dashboard/renders')}
        >
          Ver Mis Modelos
        </Button>
      }
    >
      <Box maxW='4xl' mx='auto'>
        <UploadRenderForm />
      </Box>
    </SidebarLayout>
  );
}
