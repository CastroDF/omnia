import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export interface TableColumn {
  key: string;
  header: string;
  render?: (value: React.ReactNode, row: TableData) => React.ReactNode;
  width?: string;
}

export interface TableData {
  [key: string]: React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: TableData[];
  loading?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
}) => {
  if (loading) {
    return (
      <Box
        bg='gray.800'
        borderRadius='lg'
        border='1px'
        borderColor='gray.700'
        p={8}
        textAlign='center'
      >
        <Text color='gray.400'>Cargando...</Text>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        bg='gray.800'
        borderRadius='lg'
        border='1px'
        borderColor='gray.700'
        p={8}
        textAlign='center'
      >
        <Text color='gray.400'>{emptyMessage}</Text>
      </Box>
    );
  }

  return (
    <Box
      bg='gray.800'
      borderRadius='lg'
      border='1px'
      borderColor='gray.700'
      overflow='hidden'
    >
      {/* Header */}
      <Box
        bg='gray.700'
        borderBottom='1px'
        borderColor='gray.600'
        display='grid'
        gridTemplateColumns={columns.map(col => col.width || '1fr').join(' ')}
        gap={4}
        p={4}
      >
        {columns.map(column => (
          <Text
            key={column.key}
            fontWeight='semibold'
            color='gray.200'
            fontSize='sm'
            textTransform='uppercase'
            letterSpacing='wider'
          >
            {column.header}
          </Text>
        ))}
      </Box>

      {/* Body */}
      <Box>
        {data.map((row, index) => (
          <Box
            key={index}
            display='grid'
            gridTemplateColumns={columns
              .map(col => col.width || '1fr')
              .join(' ')}
            gap={4}
            p={4}
            borderBottom={index < data.length - 1 ? '1px' : 'none'}
            borderColor='gray.700'
            _hover={{ bg: 'gray.750' }}
            transition='background 0.2s'
          >
            {columns.map(column => (
              <Box key={column.key} display='flex' alignItems='center'>
                {column.render ? (
                  column.render(row[column.key], row)
                ) : (
                  <Text color='gray.300' fontSize='sm'>
                    {row[column.key] || '-'}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
