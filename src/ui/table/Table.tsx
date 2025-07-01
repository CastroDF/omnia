import React from 'react';
import { cn } from '@/lib/utils';

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
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className,
}) => {
  if (loading) {
    return (
      <div
        className={cn(
          'bg-gray-800 rounded-lg border border-gray-700 p-8 text-center',
          className,
        )}
      >
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400'></div>
          <span className='ml-3 text-gray-400'>Cargando...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'bg-gray-800 rounded-lg border border-gray-700 p-8 text-center',
          className,
        )}
      >
        <p className='text-gray-400'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-gray-800 rounded-lg border border-gray-700 overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div
        className='bg-gray-700 border-b border-gray-600 grid gap-4 p-4'
        style={{
          gridTemplateColumns: columns.map(col => col.width || '1fr').join(' '),
        }}
      >
        {columns.map(column => (
          <span
            key={column.key}
            className='font-semibold text-gray-200 text-sm uppercase tracking-wider'
          >
            {column.header}
          </span>
        ))}
      </div>

      {/* Body */}
      <div>
        {data.map((row, index) => (
          <div
            key={index}
            className={cn(
              'grid gap-4 p-4 hover:bg-gray-750 transition-colors duration-200',
              index < data.length - 1 ? 'border-b border-gray-700' : '',
            )}
            style={{
              gridTemplateColumns: columns
                .map(col => col.width || '1fr')
                .join(' '),
            }}
          >
            {columns.map(column => (
              <div key={column.key} className='flex items-center'>
                {column.render ? (
                  column.render(row[column.key], row)
                ) : (
                  <span className='text-gray-300 text-sm'>
                    {row[column.key] || '-'}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
