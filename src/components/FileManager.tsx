'use client';

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  InputElement,
  SimpleGrid,
  Image,
  IconButton,
  Avatar,
  Badge,
} from '@chakra-ui/react';
import { Button } from '@/ui/button/Button';
import { Card } from '@/ui/card/Card';
import React from 'react';
import {
  FiSearch,
  FiPlus,
  FiUpload,
  FiFolder,
  FiVideo,
  FiGrid,
  FiBell,
  FiLayout,
  FiPieChart,
  FiStar,
  FiShare2,
  FiClock,
} from 'react-icons/fi';

interface NavItemProps {
  icon: React.ReactElement;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, children, active, onClick }: NavItemProps) {
  return (
    <Flex
      align='center'
      gap={3}
      px={3}
      py={2}
      borderRadius='lg'
      bg={active ? 'gray.100' : 'transparent'}
      _hover={{ bg: 'gray.50' }}
      cursor='pointer'
      onClick={onClick}
      transition='all 0.2s'
    >
      {icon}
      <Text fontSize='sm' fontWeight={active ? 'semibold' : 'normal'}>
        {children}
      </Text>
    </Flex>
  );
}

function FolderItem({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <Flex
      align='center'
      justify='space-between'
      px={3}
      py={2}
      borderRadius='md'
      _hover={{ bg: 'gray.50' }}
      cursor='pointer'
      transition='all 0.2s'
    >
      <Flex align='center' gap={2}>
        <FiFolder size={16} color='gray' />
        <Text fontSize='sm'>{children}</Text>
      </Flex>
      {count && (
        <Badge colorPalette='gray' size='sm' borderRadius='full'>
          {count}
        </Badge>
      )}
    </Flex>
  );
}

interface FileCardProps {
  title: string;
  type: string;
  size: string;
  date: string;
  thumbnail?: string;
  isFolder?: boolean;
}

function FileCard({
  title,
  type,
  size,
  date,
  thumbnail,
  isFolder,
}: FileCardProps) {
  return (
    <Card.Root
      cursor='pointer'
      transition='all 0.2s'
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
    >
      <Box
        position='relative'
        aspectRatio='4/3'
        overflow='hidden'
        borderTopRadius='xl'
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            w='100%'
            h='100%'
            objectFit='cover'
            transition='transform 0.2s'
            _groupHover={{ transform: 'scale(1.05)' }}
          />
        ) : (
          <Flex
            w='100%'
            h='100%'
            bg={isFolder ? 'blue.50' : 'gray.50'}
            align='center'
            justify='center'
          >
            {isFolder ? (
              <FiFolder size={48} color='blue' />
            ) : (
              <FiVideo size={48} color='gray' />
            )}
          </Flex>
        )}
      </Box>

      <Card.Body>
        <VStack align='start' gap={1}>
          <Text fontWeight='semibold' fontSize='sm' lineClamp={1}>
            {title}
          </Text>
          <Text fontSize='xs' color='gray.500'>
            {type} • {size}
          </Text>
          <Text fontSize='xs' color='gray.400'>
            {date}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default function FileManager() {
  const sampleFiles = [
    {
      title: 'Q4 Sales Presentation',
      type: 'Presentation',
      size: '15.2 MB',
      date: '2 days ago',
      isFolder: false,
    },
    {
      title: 'Product Demo Videos',
      type: 'Folder',
      size: '5 items',
      date: '1 week ago',
      isFolder: true,
    },
    {
      title: '3D Render - Living Room',
      type: '3D Render',
      size: '45.8 MB',
      date: '3 days ago',
      isFolder: false,
    },
    {
      title: 'Client Proposals',
      type: 'Folder',
      size: '12 items',
      date: '5 days ago',
      isFolder: true,
    },
    {
      title: 'Architecture Plans',
      type: 'CAD File',
      size: '8.3 MB',
      date: '1 week ago',
      isFolder: false,
    },
    {
      title: 'Marketing Materials',
      type: 'Folder',
      size: '23 items',
      date: '2 weeks ago',
      isFolder: true,
    },
  ];

  const [activeTab, setActiveTab] = React.useState('recent');

  return (
    <Flex h='100vh' bg='gray.50'>
      {/* Sidebar */}
      <Box w='280px' bg='white' borderRight='1px' borderColor='gray.200'>
        <Box p={6}>
          <Heading size='lg' color='teal.500'>
            Omnia Files
          </Heading>
        </Box>

        <VStack align='stretch' gap={1} px={4}>
          <NavItem icon={<FiLayout />} active>
            All Content
          </NavItem>
          <NavItem icon={<FiVideo />}>3D Renders</NavItem>
          <NavItem icon={<FiPieChart />}>Analytics</NavItem>

          <Box py={4}>
            <Text
              fontSize='xs'
              fontWeight='bold'
              color='gray.500'
              px={3}
              mb={2}
            >
              COLLECTIONS
            </Text>
            <VStack align='stretch' gap={1}>
              <FolderItem count={8}>Product Renders</FolderItem>
              <FolderItem count={5}>Architecture</FolderItem>
              <FolderItem count={12}>Interior Design</FolderItem>
              <FolderItem count={3}>Presentations</FolderItem>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Main content */}
      <Box flex={1}>
        {/* Header */}
        <Flex
          bg='white'
          borderBottom='1px'
          borderColor='gray.200'
          px={6}
          py={4}
          align='center'
          justify='space-between'
        >
          <Box w='400px' position='relative'>
            <InputElement
              pointerEvents='none'
              position='absolute'
              left={3}
              top='50%'
              transform='translateY(-50%)'
            >
              <FiSearch color='gray' />
            </InputElement>
            <Input
              type='search'
              placeholder='Search files and folders...'
              bg='gray.50'
              border='none'
              pl={10}
            />
          </Box>

          <HStack gap={3}>
            <IconButton aria-label='Grid view' variant='ghost' size='sm'>
              <FiGrid />
            </IconButton>
            <IconButton aria-label='Notifications' variant='ghost' size='sm'>
              <FiBell />
            </IconButton>
            <Avatar.Root size='sm'>
              <Avatar.Fallback>U</Avatar.Fallback>
            </Avatar.Root>
          </HStack>
        </Flex>

        {/* Content */}
        <Box p={6}>
          {/* Action buttons */}
          <HStack gap={3} mb={6}>
            <Button leftIcon={<FiPlus />} variant='primary' size='md'>
              Create
            </Button>
            <Button leftIcon={<FiUpload />} variant='outline' size='md'>
              Upload
            </Button>
            <Button leftIcon={<FiFolder />} variant='outline' size='md'>
              New Folder
            </Button>
            <Button leftIcon={<FiVideo />} variant='outline' size='md'>
              New Render
            </Button>
          </HStack>

          {/* Simple tabs implementation */}
          <Box mb={6}>
            <HStack gap={6} borderBottom='1px' borderColor='gray.200' pb={3}>
              <Flex
                align='center'
                gap={2}
                cursor='pointer'
                color={activeTab === 'recent' ? 'teal.500' : 'gray.600'}
                borderBottom={activeTab === 'recent' ? '2px solid' : 'none'}
                borderColor='teal.500'
                pb={3}
                onClick={() => setActiveTab('recent')}
              >
                <FiClock />
                <Text
                  fontWeight={activeTab === 'recent' ? 'semibold' : 'normal'}
                >
                  Recent
                </Text>
              </Flex>
              <Flex
                align='center'
                gap={2}
                cursor='pointer'
                color={activeTab === 'starred' ? 'teal.500' : 'gray.600'}
                borderBottom={activeTab === 'starred' ? '2px solid' : 'none'}
                borderColor='teal.500'
                pb={3}
                onClick={() => setActiveTab('starred')}
              >
                <FiStar />
                <Text
                  fontWeight={activeTab === 'starred' ? 'semibold' : 'normal'}
                >
                  Starred
                </Text>
              </Flex>
              <Flex
                align='center'
                gap={2}
                cursor='pointer'
                color={activeTab === 'shared' ? 'teal.500' : 'gray.600'}
                borderBottom={activeTab === 'shared' ? '2px solid' : 'none'}
                borderColor='teal.500'
                pb={3}
                onClick={() => setActiveTab('shared')}
              >
                <FiShare2 />
                <Text
                  fontWeight={activeTab === 'shared' ? 'semibold' : 'normal'}
                >
                  Shared
                </Text>
              </Flex>
            </HStack>
          </Box>

          {/* Tab content */}
          {activeTab === 'recent' && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
              {sampleFiles.map((file, index) => (
                <FileCard key={index} {...file} />
              ))}
            </SimpleGrid>
          )}

          {activeTab === 'starred' && (
            <Text color='gray.500'>No starred files yet.</Text>
          )}

          {activeTab === 'shared' && (
            <Text color='gray.500'>No shared files yet.</Text>
          )}
        </Box>
      </Box>
    </Flex>
  );
}
