'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RenderData } from '@/types/render';
import {
  FiArrowLeft,
  FiSmartphone,
  FiTablet,
  FiCheckCircle,
  FiAlertTriangle,
  FiUpload,
  FiTrash2,
  FiFile,
  FiInfo,
} from 'react-icons/fi';

export default function EditRenderPage() {
  const [render, setRender] = useState<RenderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [usdzFile, setUsdzFile] = useState<File | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);

  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const fetchRender = useCallback(async () => {
    try {
      const response = await fetch(`/api/renders/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar el modelo');
      }

      setRender(data.render);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchRender();
    }
  }, [slug, fetchRender]);

  const handleUploadFiles = async () => {
    if (!usdzFile && !glbFile) {
      setError('Selecciona al menos un archivo para subir');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();

      if (usdzFile) {
        formData.append('usdzFile', usdzFile);
      }

      if (glbFile) {
        formData.append('glbFile', glbFile);
      }

      const response = await fetch(`/api/renders/${slug}/files`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir archivos');
      }

      setSuccess('Archivos subidos exitosamente');
      setUsdzFile(null);
      setGlbFile(null);

      await fetchRender();
    } catch (error) {
      console.error('Error:', error);
      setError(
        error instanceof Error ? error.message : 'Error al subir archivos',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileType: 'usdz' | 'glb') => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el archivo ${fileType.toUpperCase()}?`,
      )
    ) {
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/renders/${slug}/files/${fileType}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar archivo');
      }

      setSuccess(`Archivo ${fileType.toUpperCase()} eliminado exitosamente`);

      await fetchRender();
    } catch (error) {
      console.error('Error:', error);
      setError(
        error instanceof Error ? error.message : 'Error al eliminar archivo',
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500'></div>
      </div>
    );
  }

  if (error && !render) {
    return (
      <div className='min-h-screen bg-gray-900 p-4'>
        <div className='container max-w-4xl mx-auto py-10'>
          <div className='p-4 bg-red-900/20 border border-red-500/30 rounded-lg'>
            <p className='text-red-400'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!render) {
    return (
      <div className='min-h-screen bg-gray-900 p-4'>
        <div className='container max-w-4xl mx-auto py-10'>
          <p className='text-gray-400'>Modelo no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900'>
      <div className='container max-w-4xl mx-auto py-6 px-4'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='space-y-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/dashboard/renders')}
              className='text-gray-300 hover:text-white hover:bg-gray-700'
            >
              <FiArrowLeft className='mr-2' size={16} />
              Volver a Mis Modelos
            </Button>

            <div>
              <h1 className='text-2xl sm:text-3xl font-bold mb-2 text-white'>
                Editar Archivos AR
              </h1>
              <h2 className='text-lg text-teal-400 font-semibold'>
                {render.name}
              </h2>
              {render.description && (
                <p className='text-gray-300 mt-1'>{render.description}</p>
              )}
            </div>
          </div>

          {/* Status messages */}
          {error && (
            <div className='p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3'>
              <FiAlertTriangle
                className='text-red-400 flex-shrink-0 mt-0.5'
                size={16}
              />
              <p className='text-red-400'>{error}</p>
            </div>
          )}

          {success && (
            <div className='p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-start gap-3'>
              <FiCheckCircle
                className='text-green-400 flex-shrink-0 mt-0.5'
                size={16}
              />
              <p className='text-green-400'>{success}</p>
            </div>
          )}

          {/* Current Files */}
          <Card className='bg-gray-800 border-gray-700'>
            <CardHeader>
              <h3 className='text-xl font-bold text-white'>
                Archivos Actuales
              </h3>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* iOS File */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-lg font-semibold text-teal-400 flex items-center gap-2'>
                    <FiSmartphone size={20} />
                    iOS (.usdz)
                  </h4>
                  {render.files.usdz && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteFile('usdz')}
                      disabled={uploading}
                      className='border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
                    >
                      <FiTrash2 className='mr-1' size={14} />
                      Eliminar
                    </Button>
                  )}
                </div>

                {render.files.usdz ? (
                  <div className='p-4 bg-green-900/20 border border-green-500/30 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <FiCheckCircle className='text-green-400' size={20} />
                      <div>
                        <p className='font-semibold text-green-400'>
                          Archivo disponible
                        </p>
                        <p className='text-sm text-green-300'>
                          {render.files.usdz.originalName}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <FiAlertTriangle className='text-yellow-400' size={20} />
                      <div>
                        <p className='text-yellow-400 font-medium'>
                          No hay archivo .usdz (requerido para iOS AR)
                        </p>
                        <p className='text-sm text-yellow-300'>
                          Sube un archivo .usdz para habilitar AR en
                          dispositivos iOS
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Android File */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-lg font-semibold text-teal-400 flex items-center gap-2'>
                    <FiTablet size={20} />
                    Android (.glb)
                  </h4>
                  {render.files.glb && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteFile('glb')}
                      disabled={uploading}
                      className='border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
                    >
                      <FiTrash2 className='mr-1' size={14} />
                      Eliminar
                    </Button>
                  )}
                </div>

                {render.files.glb ? (
                  <div className='p-4 bg-green-900/20 border border-green-500/30 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <FiCheckCircle className='text-green-400' size={20} />
                      <div>
                        <p className='font-semibold text-green-400'>
                          Archivo disponible
                        </p>
                        <p className='text-sm text-green-300'>
                          {render.files.glb.originalName}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <FiAlertTriangle className='text-yellow-400' size={20} />
                      <div>
                        <p className='text-yellow-400 font-medium'>
                          No hay archivo .glb (requerido para Android AR)
                        </p>
                        <p className='text-sm text-yellow-300'>
                          Sube un archivo .glb para habilitar AR en dispositivos
                          Android
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload New Files */}
          <Card className='bg-gray-800 border-gray-700'>
            <CardHeader>
              <h3 className='text-xl font-bold text-white'>
                Subir Nuevos Archivos
              </h3>
              <p className='text-gray-400'>
                Sube archivos para actualizar o añadir compatibilidad AR
              </p>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* iOS Upload */}
              <div className='space-y-3'>
                <h4 className='text-lg font-semibold text-teal-400 flex items-center gap-2'>
                  <FiSmartphone size={20} />
                  Archivo iOS (.usdz)
                </h4>
                <div className='space-y-2'>
                  <Input
                    type='file'
                    accept='.usdz'
                    onChange={e => setUsdzFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                    className='bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-gray-200 file:border-0 file:rounded file:px-3 file:py-1'
                  />
                  {usdzFile && (
                    <div className='flex items-center gap-2 text-sm text-green-400'>
                      <FiFile size={14} />
                      <span>Seleccionado: {usdzFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Android Upload */}
              <div className='space-y-3'>
                <h4 className='text-lg font-semibold text-teal-400 flex items-center gap-2'>
                  <FiTablet size={20} />
                  Archivo Android (.glb)
                </h4>
                <div className='space-y-2'>
                  <Input
                    type='file'
                    accept='.glb,.gltf'
                    onChange={e => setGlbFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                    className='bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-gray-200 file:border-0 file:rounded file:px-3 file:py-1'
                  />
                  {glbFile && (
                    <div className='flex items-center gap-2 text-sm text-green-400'>
                      <FiFile size={14} />
                      <span>Seleccionado: {glbFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUploadFiles}
                disabled={uploading || (!usdzFile && !glbFile)}
                className='w-full bg-teal-600 hover:bg-teal-700 text-white h-12'
              >
                {uploading ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <FiUpload className='mr-2' size={16} />
                    Subir Archivos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className='bg-gray-800 border-gray-700'>
            <CardHeader>
              <h3 className='text-xl font-bold text-white'>Instrucciones</h3>
            </CardHeader>
            <CardContent className='space-y-4 text-sm text-gray-300'>
              <div>
                <h4 className='font-semibold text-teal-400 flex items-center gap-2 mb-2'>
                  <FiSmartphone size={16} />
                  Archivo .usdz (iOS)
                </h4>
                <ul className='space-y-1 ml-6'>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Formato nativo de Apple para AR</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Compatible con iPhone y iPad</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Se abre automáticamente con AR Quick Look</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Tamaño recomendado: menor a 25MB</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className='font-semibold text-teal-400 flex items-center gap-2 mb-2'>
                  <FiTablet size={16} />
                  Archivo .glb (Android)
                </h4>
                <ul className='space-y-1 ml-6'>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Formato GLTF binario</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Compatible con Scene Viewer de Google</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Funciona en la mayoría de dispositivos Android</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-teal-400 mt-1'>•</span>
                    <span>Tamaño recomendado: menor a 15MB</span>
                  </li>
                </ul>
              </div>

              <div className='p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg'>
                <h4 className='font-semibold text-blue-400 flex items-center gap-2 mb-2'>
                  <FiInfo size={16} />
                  Consejo
                </h4>
                <p className='text-blue-300'>
                  Para máxima compatibilidad, sube ambos formatos. Esto
                  permitirá que tu modelo funcione en AR tanto en iOS como en
                  Android.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
