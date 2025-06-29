'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Button } from '@/ui/button/Button';
import { Card } from '@/ui/card/Card';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import { RenderData } from '@/types/render';
import React from 'react';
import {
  FiPlus,
  FiLayout,
  FiPieChart,
  FiClock,
  FiSmartphone,
  FiTablet,
  FiBox,
  FiEye,
  FiCopy,
  FiEdit3,
} from 'react-icons/fi';

interface NavItemProps {
  icon: React.ReactElement;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

function NavItem({ icon, children, active, onClick, count }: NavItemProps) {
  return (
    <Flex
      align='center'
      justify='space-between'
      px={3}
      py={2}
      borderRadius='lg'
      bg={active ? 'gray.700' : 'transparent'}
      _hover={{ bg: 'gray.700' }}
      cursor='pointer'
      onClick={onClick}
      transition='all 0.2s'
    >
      <Flex align='center' gap={3}>
        {icon}
        <Text
          fontSize='sm'
          fontWeight={active ? 'semibold' : 'normal'}
          color='white'
        >
          {children}
        </Text>
      </Flex>
      {count !== undefined && (
        <Badge colorPalette='teal' size='sm' borderRadius='full'>
          {count}
        </Badge>
      )}
    </Flex>
  );
}

interface RenderCardProps {
  render: RenderData;
  onViewAR: (slug: string) => void;
  onCopyLink: (slug: string) => void;
  onEdit: (slug: string) => void;
}

function RenderCard({ render, onViewAR, onCopyLink, onEdit }: RenderCardProps) {
  const hasIOS = Boolean(render.files.usdz);
  const hasAndroid = Boolean(render.files.glb);
  const isFullyCompatible = hasIOS && hasAndroid;

  return (
    <Card.Root
      bg='gray.800'
      borderColor='gray.700'
      cursor='pointer'
      transition='all 0.2s'
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'xl',
        borderColor: 'teal.500',
      }}
    >
      <Box
        position='relative'
        aspectRatio='4/3'
        overflow='hidden'
        borderTopRadius='xl'
      >
        <Flex
          w='100%'
          h='100%'
          bg='gray.700'
          align='center'
          justify='center'
          position='relative'
        >
          <FiBox size={64} color='teal' />

          {/* AR Compatibility indicators */}
          <HStack position='absolute' top={3} right={3} gap={1}>
            {hasIOS && (
              <Badge colorPalette='green' size='sm'>
                📱 iOS
              </Badge>
            )}
            {hasAndroid && (
              <Badge colorPalette='green' size='sm'>
                🤖 Android
              </Badge>
            )}
          </HStack>

          {/* Status indicator */}
          <Box position='absolute' top={3} left={3}>
            <Badge
              colorPalette={isFullyCompatible ? 'green' : 'yellow'}
              size='sm'
            >
              {isFullyCompatible ? 'AR Completo' : 'Parcial'}
            </Badge>
          </Box>
        </Flex>
      </Box>

      <Card.Body>
        <VStack align='start' gap={3}>
          {/* Header info */}
          <Box w='100%'>
            <Text fontWeight='bold' fontSize='md' color='white' lineClamp={1}>
              {render.name}
            </Text>
            {render.description && (
              <Text fontSize='sm' color='gray.400' lineClamp={2} mt={1}>
                {render.description}
              </Text>
            )}
          </Box>

          {/* Metadata */}
          <VStack align='start' gap={1} w='100%'>
            <Text fontSize='xs' color='gray.500'>
              <Text as='span' fontWeight='semibold'>
                Slug:
              </Text>{' '}
              {render.slug}
            </Text>
            <Text fontSize='xs' color='gray.500'>
              <Text as='span' fontWeight='semibold'>
                Creado:
              </Text>{' '}
              {new Date(render.createdAt).toLocaleDateString()}
            </Text>
          </VStack>

          {/* AR Compatibility Details */}
          <Box w='100%'>
            <Text fontSize='xs' fontWeight='bold' color='gray.300' mb={2}>
              Compatibilidad AR:
            </Text>
            <VStack gap={1} align='start'>
              <Flex align='center' gap={2} w='100%'>
                <FiSmartphone size={12} color={hasIOS ? 'green' : 'red'} />
                <Text fontSize='xs' color={hasIOS ? 'green.400' : 'red.400'}>
                  iOS:{' '}
                  {hasIOS
                    ? `✅ ${render.files.usdz?.originalName}`
                    : '❌ Falta .usdz'}
                </Text>
              </Flex>

              <Flex align='center' gap={2} w='100%'>
                <FiTablet size={12} color={hasAndroid ? 'green' : 'red'} />
                <Text
                  fontSize='xs'
                  color={hasAndroid ? 'green.400' : 'red.400'}
                >
                  Android:{' '}
                  {hasAndroid
                    ? `✅ ${render.files.glb?.originalName}`
                    : '❌ Falta .glb'}
                </Text>
              </Flex>

              {/* Legacy files */}
              {(render.files.obj || render.files.mtl) && (
                <Box
                  mt={2}
                  pt={2}
                  borderTop='1px'
                  borderColor='gray.600'
                  w='100%'
                >
                  <Text fontSize='xs' color='gray.500' mb={1}>
                    Archivos legacy:
                  </Text>
                  {render.files.obj && (
                    <Text fontSize='xs' color='gray.500'>
                      • {render.files.obj.originalName}
                    </Text>
                  )}
                  {render.files.mtl && (
                    <Text fontSize='xs' color='gray.500'>
                      • {render.files.mtl.originalName}
                    </Text>
                  )}
                </Box>
              )}
            </VStack>
          </Box>

          {/* Action buttons */}
          <VStack gap={2} w='100%'>
            <HStack gap={2} w='100%'>
              <Button
                size='sm'
                variant='primary'
                leftIcon={<FiEye />}
                onClick={() => onViewAR(render.slug)}
                flex={1}
              >
                Ver AR
              </Button>
              <Button
                size='sm'
                variant='outline'
                leftIcon={<FiCopy />}
                onClick={() => onCopyLink(render.slug)}
                flex={1}
              >
                Copiar Link
              </Button>
            </HStack>

            <Button
              size='sm'
              variant='outline'
              leftIcon={<FiEdit3 />}
              onClick={() => onEdit(render.slug)}
              w='100%'
            >
              Editar Archivos AR
            </Button>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default function RendersPage() {
  const [renders, setRenders] = useState<RenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter renders based on search and active tab
  const filteredRenders = React.useMemo(() => {
    let filtered = renders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        render =>
          render.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          render.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (render.description &&
            render.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    // Apply tab filter
    if (activeTab === 'ios') {
      filtered = filtered.filter(render => render.files.usdz);
    } else if (activeTab === 'android') {
      filtered = filtered.filter(render => render.files.glb);
    }
    // 'recent' shows all

    return filtered;
  }, [renders, searchTerm, activeTab]);

  // Calculate counts for navigation
  const totalCount = renders.length;
  const iOSCount = renders.filter(r => r.files.usdz).length;
  const androidCount = renders.filter(r => r.files.glb).length;

  const handleViewAR = (slug: string) => {
    window.open(`/render/${slug}`, '_blank');
  };

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/render/${slug}`);
    // TODO: Add toast notification for successful copy
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/renders/${slug}/edit`);
  };

  // Sidebar content
  const sidebarContent = (
    <VStack align='stretch' gap={1}>
      <NavItem
        icon={<FiLayout />}
        active={activeTab === 'recent'}
        onClick={() => setActiveTab('recent')}
        count={totalCount}
      >
        Todos los Modelos
      </NavItem>
      <NavItem
        icon={<FiSmartphone />}
        active={activeTab === 'ios'}
        onClick={() => setActiveTab('ios')}
        count={iOSCount}
      >
        Compatible iOS
      </NavItem>
      <NavItem
        icon={<FiTablet />}
        active={activeTab === 'android'}
        onClick={() => setActiveTab('android')}
        count={androidCount}
      >
        Compatible Android
      </NavItem>
      <NavItem icon={<FiPieChart />}>Analíticas</NavItem>

      <Box py={4}>
        <Text fontSize='xs' fontWeight='bold' color='gray.500' px={3} mb={2}>
          ACCIONES RÁPIDAS
        </Text>
        <VStack align='stretch' gap={1}>
          <Box
            px={3}
            py={2}
            borderRadius='md'
            bg='teal.800'
            cursor='pointer'
            _hover={{ bg: 'teal.700' }}
            onClick={() => router.push('/dashboard/renders/upload')}
          >
            <Text fontSize='sm' color='teal.100' fontWeight='semibold'>
              📱 Subir Nuevo Modelo AR
            </Text>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );

  if (loading) {
    return (
      <Box h='100vh' bg='gray.900'>
        <Center h='100%'>
          <VStack gap={4}>
            <Spinner size='xl' color='teal.500' />
            <Text color='gray.400'>Cargando modelos AR...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (error) {
    return (
      <Box h='100vh' bg='gray.900' p={6}>
        <Center h='100%'>
          <Box
            p={6}
            bg='red.900'
            borderColor='red.700'
            borderWidth={1}
            borderRadius='lg'
            maxW='md'
          >
            <Text color='red.300' textAlign='center'>
              {error}
            </Text>
          </Box>
        </Center>
      </Box>
    );
  }

  return (
    <SidebarLayout
      sidebarTitle='Modelos AR'
      sidebarSubtitle='Gestiona tus assets 3D de realidad aumentada'
      sidebarContent={sidebarContent}
      searchPlaceholder='Buscar modelos AR...'
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* Action buttons */}
      <HStack gap={3} mb={6}>
        <Button
          leftIcon={<FiPlus />}
          variant='primary'
          size='md'
          onClick={() => router.push('/dashboard/renders/upload')}
        >
          Subir Modelo
        </Button>
      </HStack>

      {/* Tab indicators */}
      <Box mb={6}>
        <HStack gap={6} borderBottom='1px' borderColor='gray.700' pb={3}>
          <Flex
            align='center'
            gap={2}
            cursor='pointer'
            color={activeTab === 'recent' ? 'teal.400' : 'gray.500'}
            borderBottom={activeTab === 'recent' ? '2px solid' : 'none'}
            borderColor='teal.400'
            pb={3}
            onClick={() => setActiveTab('recent')}
          >
            <FiClock />
            <Text fontWeight={activeTab === 'recent' ? 'semibold' : 'normal'}>
              Todos los Modelos ({totalCount})
            </Text>
          </Flex>
          <Flex
            align='center'
            gap={2}
            cursor='pointer'
            color={activeTab === 'ios' ? 'teal.400' : 'gray.500'}
            borderBottom={activeTab === 'ios' ? '2px solid' : 'none'}
            borderColor='teal.400'
            pb={3}
            onClick={() => setActiveTab('ios')}
          >
            <FiSmartphone />
            <Text fontWeight={activeTab === 'ios' ? 'semibold' : 'normal'}>
              iOS ({iOSCount})
            </Text>
          </Flex>
          <Flex
            align='center'
            gap={2}
            cursor='pointer'
            color={activeTab === 'android' ? 'teal.400' : 'gray.500'}
            borderBottom={activeTab === 'android' ? '2px solid' : 'none'}
            borderColor='teal.400'
            pb={3}
            onClick={() => setActiveTab('android')}
          >
            <FiTablet />
            <Text fontWeight={activeTab === 'android' ? 'semibold' : 'normal'}>
              Android ({androidCount})
            </Text>
          </Flex>
        </HStack>
      </Box>

      {/* Content based on renders */}
      {filteredRenders.length === 0 ? (
        <Center py={20}>
          <VStack gap={4} textAlign='center'>
            <Box p={4} borderRadius='full' bg='gray.700'>
              <FiBox size={32} color='gray' />
            </Box>
            <Heading size='md' color='gray.400'>
              {renders.length === 0
                ? 'No tienes modelos AR aún'
                : searchTerm
                  ? 'No hay modelos que coincidan con tu búsqueda'
                  : `No se encontraron modelos ${activeTab === 'ios' ? 'iOS' : activeTab === 'android' ? 'Android' : ''}`}
            </Heading>
            <Text color='gray.500' maxW='md'>
              {renders.length === 0
                ? 'Sube tu primer modelo AR para compartirlo en Instagram Stories'
                : searchTerm
                  ? 'Intenta ajustar los términos de búsqueda'
                  : `Sube modelos con archivos ${activeTab === 'ios' ? '.usdz' : '.glb'} para compatibilidad ${activeTab === 'ios' ? 'iOS' : 'Android'}`}
            </Text>
            {renders.length === 0 && (
              <Button
                variant='primary'
                onClick={() => router.push('/dashboard/renders/upload')}
                size='lg'
              >
                Subir Primer Modelo
              </Button>
            )}
          </VStack>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
          {filteredRenders.map(render => (
            <RenderCard
              key={render._id}
              render={render}
              onViewAR={handleViewAR}
              onCopyLink={handleCopyLink}
              onEdit={handleEdit}
            />
          ))}
        </SimpleGrid>
      )}
    </SidebarLayout>
  );
}
