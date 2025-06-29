'use client';

import React from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  InputElement,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

interface SidebarLayoutProps {
  // Sidebar content
  sidebarTitle: string;
  sidebarSubtitle?: string;
  sidebarContent: React.ReactNode;

  // Main content
  children: React.ReactNode;

  // Search functionality
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Header actions
  headerActions?: React.ReactNode;
}

export default function SidebarLayout({
  sidebarTitle,
  sidebarSubtitle,
  sidebarContent,
  children,
  searchPlaceholder = 'Buscar...',
  searchValue = '',
  onSearchChange,
  headerActions,
}: SidebarLayoutProps) {
  return (
    <Flex h='100vh' bg='gray.900'>
      {/* Sidebar */}
      <Box w='280px' bg='gray.800' borderRight='1px' borderColor='gray.700'>
        <Box p={6}>
          <Heading size='lg' color='teal.400'>
            {sidebarTitle}
          </Heading>
          {sidebarSubtitle && (
            <Text fontSize='sm' color='gray.400' mt={1}>
              {sidebarSubtitle}
            </Text>
          )}
        </Box>

        {/* Sidebar content */}
        <Box px={4}>{sidebarContent}</Box>
      </Box>

      {/* Main content */}
      <Box flex={1}>
        {/* Header */}
        <Flex
          bg='gray.800'
          borderBottom='1px'
          borderColor='gray.700'
          px={6}
          py={4}
          align='center'
          justify='space-between'
        >
          {/* Search */}
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
              placeholder={searchPlaceholder}
              bg='gray.700'
              border='1px'
              borderColor='gray.600'
              color='white'
              pl={10}
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'teal.500' }}
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
            />
          </Box>

          {/* Header actions (if any) */}
          {headerActions && <Box>{headerActions}</Box>}
        </Flex>

        {/* Main content area */}
        <Box p={6}>{children}</Box>
      </Box>
    </Flex>
  );
}
