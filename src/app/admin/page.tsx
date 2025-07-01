'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white p-8'>
      <div className='container max-w-7xl mx-auto'>
        <div className='space-y-8'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-white'>
                Panel de Administración
              </h1>
              <p className='text-gray-400 mt-2'>
                Gestiona usuarios y permisos del sistema
              </p>
            </div>
            <div className='flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg'>
              <FiShield className='text-red-400' />
              <span className='text-red-400 font-medium'>Administrador</span>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='bg-gray-800 border-gray-700'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-gray-400 font-medium'>Total Usuarios</p>
                    <p className='text-2xl font-bold text-white'>
                      {users.length}
                    </p>
                  </div>
                  <div className='p-3 bg-blue-500/20 rounded-lg'>
                    <FiUsers className='text-blue-400 text-xl' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gray-800 border-gray-700'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-gray-400 font-medium'>
                      Usuarios Activos
                    </p>
                    <p className='text-2xl font-bold text-white'>
                      {users.filter(u => u.active).length}
                    </p>
                  </div>
                  <div className='p-3 bg-green-500/20 rounded-lg'>
                    <FiUserCheck className='text-green-400 text-xl' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gray-800 border-gray-700'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-gray-400 font-medium'>Administradores</p>
                    <p className='text-2xl font-bold text-white'>
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                  <div className='p-3 bg-red-500/20 rounded-lg'>
                    <FiStar className='text-red-400 text-xl' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className='bg-gray-800 border-gray-700'>
            <CardContent className='p-0'>
              <div className='p-6 border-b border-gray-700'>
                <h2 className='text-xl font-bold text-white'>
                  Gestión de Usuarios
                </h2>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-700'>
                      <th className='text-left p-4 text-gray-300 font-medium'>
                        Usuario
                      </th>
                      <th className='text-left p-4 text-gray-300 font-medium'>
                        Rol
                      </th>
                      <th className='text-left p-4 text-gray-300 font-medium'>
                        Estado
                      </th>
                      <th className='text-left p-4 text-gray-300 font-medium'>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr
                        key={user._id}
                        className='border-b border-gray-700 hover:bg-gray-750'
                      >
                        <td className='p-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold'>
                              {user.image ? (
                                <Image
                                  src={user.image}
                                  alt={user.name}
                                  className='w-full h-full rounded-full'
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                user.name?.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className='text-white font-semibold text-sm'>
                                {user.name}
                              </p>
                              <p className='text-gray-400 text-xs'>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className='p-4'>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {user.role === 'admin' ? (
                              <FiStar size={12} />
                            ) : (
                              <FiUser size={12} />
                            )}
                            {user.role === 'admin'
                              ? 'Administrador'
                              : 'Usuario'}
                          </span>
                        </td>
                        <td className='p-4'>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.active
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {user.active ? (
                              <FiUserCheck size={12} />
                            ) : (
                              <FiUserX size={12} />
                            )}
                            {user.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className='p-4'>
                          <div className='flex gap-2'>
                            <Button
                              size='sm'
                              variant={user.active ? 'outline' : 'default'}
                              onClick={() => toggleUserActive(user)}
                              disabled={updating === user._id}
                              className='text-xs'
                            >
                              {user.active ? (
                                <FiToggleRight className='mr-1' />
                              ) : (
                                <FiToggleLeft className='mr-1' />
                              )}
                              {user.active ? 'Desactivar' : 'Activar'}
                            </Button>

                            {user._id !== session?.user?.id && (
                              <Button
                                size='sm'
                                variant={
                                  user.role === 'admin'
                                    ? 'secondary'
                                    : 'outline'
                                }
                                onClick={() => toggleUserRole(user)}
                                disabled={updating === user._id}
                                className='text-xs'
                              >
                                {user.role === 'admin' ? (
                                  <FiUser className='mr-1' />
                                ) : (
                                  <FiStar className='mr-1' />
                                )}
                                {user.role === 'admin'
                                  ? 'Quitar Admin'
                                  : 'Hacer Admin'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
