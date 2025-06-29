'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Flex, VStack, Text, Heading, Badge } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { Button } from '@/ui/button/Button';
import { Table, TableColumn, TableData } from '@/ui/table/Table';
import { Card } from '@/ui/card/Card';
import {
  FiUsers,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
  FiUserCheck,
  FiUserX,
  FiStar,
  FiUser,
} from 'react-icons/fi';

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  active: boolean;
  emailVerified?: Date;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [session, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error('Error loading users:', data.error);
        alert(
          'Error al cargar usuarios: ' + (data.error || 'Error desconocido'),
        );
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    setUpdating(userId);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, updates }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setUsers(
          users.map(user =>
            user._id === userId ? { ...user, ...updates } : user,
          ),
        );

        alert('Usuario actualizado exitosamente');
      } else {
        console.error('Error updating user:', data.error);
        alert(
          'Error al actualizar usuario: ' + (data.error || 'Error desconocido'),
        );
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Error de conexión');
    } finally {
      setUpdating(null);
    }
  };

  const toggleUserActive = (user: User) => {
    updateUser(user._id, { active: !user.active });
  };

  const toggleUserRole = (user: User) => {
    updateUser(user._id, {
      role: user.role === 'admin' ? 'user' : 'admin',
    });
  };

  const columns = [
    {
      key: 'user',
      header: 'Usuario',
      width: '2fr',
      render: (_value: unknown, user: User) => (
        <Flex align='center' gap={3}>
          <Avatar.Root size='sm' bg='teal.500'>
            <Avatar.Fallback>{user.name?.charAt(0)}</Avatar.Fallback>
            {user.image && <Avatar.Image src={user.image} />}
          </Avatar.Root>
          <Box>
            <Text color='white' fontWeight='semibold' fontSize='sm'>
              {user.name}
            </Text>
            <Text color='gray.400' fontSize='xs'>
              {user.email}
            </Text>
          </Box>
        </Flex>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      width: '150px',
      render: (_value: unknown, user: User) => (
        <Badge
          colorPalette={user.role === 'admin' ? 'red' : 'blue'}
          size='sm'
          display='flex'
          alignItems='center'
          gap={1}
          w='fit-content'
        >
          {user.role === 'admin' ? <FiStar size={12} /> : <FiUser size={12} />}
          {user.role === 'admin' ? 'Administrador' : 'Usuario'}
        </Badge>
      ),
    },
    {
      key: 'active',
      header: 'Estado',
      width: '120px',
      render: (_value: unknown, user: User) => (
        <Badge
          colorPalette={user.active ? 'green' : 'gray'}
          size='sm'
          display='flex'
          alignItems='center'
          gap={1}
          w='fit-content'
        >
          {user.active ? <FiUserCheck size={12} /> : <FiUserX size={12} />}
          {user.active ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '200px',
      render: (_value: unknown, user: User) => (
        <Flex gap={2}>
          <Button
            size='sm'
            variant={user.active ? 'outline' : 'primary'}
            leftIcon={user.active ? <FiToggleRight /> : <FiToggleLeft />}
            onClick={() => toggleUserActive(user)}
            loading={updating === user._id}
            disabled={updating === user._id}
          >
            {user.active ? 'Desactivar' : 'Activar'}
          </Button>

          {user._id !== session?.user?.id && (
            <Button
              size='sm'
              variant={user.role === 'admin' ? 'secondary' : 'outline'}
              leftIcon={user.role === 'admin' ? <FiUser /> : <FiStar />}
              onClick={() => toggleUserRole(user)}
              loading={updating === user._id}
              disabled={updating === user._id}
            >
              {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  if (session?.user?.role !== 'admin') {
    return (
      <Box
        minH='100vh'
        bg='gray.900'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Card.Root bg='red.900' borderColor='red.700' maxW='md'>
          <Card.Body textAlign='center'>
            <FiShield size={48} color='red' />
            <Heading size='lg' color='red.300' mt={4}>
              Acceso Denegado
            </Heading>
            <Text color='red.200' mt={2}>
              No tienes permisos para acceder a esta página.
            </Text>
            <Button mt={4} variant='outline' onClick={() => router.push('/')}>
              Volver al Inicio
            </Button>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box minH='100vh' bg='gray.900'>
      {/* Header */}
      <Box bg='gray.800' borderBottom='1px' borderColor='gray.700' py={6}>
        <Box maxW='7xl' mx='auto' px={6}>
          <Flex align='center' justify='space-between'>
            <Box>
              <Flex align='center' gap={3}>
                <Box p={3} bg='red.800' borderRadius='full'>
                  <FiShield size={24} color='white' />
                </Box>
                <Box>
                  <Heading size='xl' color='white'>
                    Panel de Administración
                  </Heading>
                  <Text color='gray.400' mt={1}>
                    Gestión de usuarios y permisos del sistema
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Button variant='outline' onClick={() => router.push('/dashboard')}>
              Volver al Dashboard
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* Main content */}
      <Box maxW='7xl' mx='auto' p={6}>
        <VStack gap={6} align='start'>
          {/* Stats */}
          <Flex gap={4} w='full'>
            <Card.Root bg='gray.800' borderColor='gray.700' flex={1}>
              <Card.Body>
                <Flex align='center' gap={3}>
                  <Box p={2} bg='blue.800' borderRadius='lg'>
                    <FiUsers size={20} color='white' />
                  </Box>
                  <Box>
                    <Text color='white' fontWeight='semibold' fontSize='lg'>
                      {users.length}
                    </Text>
                    <Text color='gray.400' fontSize='sm'>
                      Total de Usuarios
                    </Text>
                  </Box>
                </Flex>
              </Card.Body>
            </Card.Root>

            <Card.Root bg='gray.800' borderColor='gray.700' flex={1}>
              <Card.Body>
                <Flex align='center' gap={3}>
                  <Box p={2} bg='green.800' borderRadius='lg'>
                    <FiUserCheck size={20} color='white' />
                  </Box>
                  <Box>
                    <Text color='white' fontWeight='semibold' fontSize='lg'>
                      {users.filter(u => u.active).length}
                    </Text>
                    <Text color='gray.400' fontSize='sm'>
                      Usuarios Activos
                    </Text>
                  </Box>
                </Flex>
              </Card.Body>
            </Card.Root>

            <Card.Root bg='gray.800' borderColor='gray.700' flex={1}>
              <Card.Body>
                <Flex align='center' gap={3}>
                  <Box p={2} bg='red.800' borderRadius='lg'>
                    <FiStar size={20} color='white' />
                  </Box>
                  <Box>
                    <Text color='white' fontWeight='semibold' fontSize='lg'>
                      {users.filter(u => u.role === 'admin').length}
                    </Text>
                    <Text color='gray.400' fontSize='sm'>
                      Administradores
                    </Text>
                  </Box>
                </Flex>
              </Card.Body>
            </Card.Root>
          </Flex>

          {/* Users table */}
          <Box w='full'>
            <Box mb={4}>
              <Heading size='lg' color='white' mb={2}>
                Gestión de Usuarios
              </Heading>
              <Text color='gray.400'>
                Administra los roles y estados de los usuarios del sistema
              </Text>
            </Box>

            <Table
              columns={columns as unknown as TableColumn[]}
              data={users as unknown as TableData[]}
              loading={loading}
              emptyMessage='No hay usuarios registrados'
            />
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
