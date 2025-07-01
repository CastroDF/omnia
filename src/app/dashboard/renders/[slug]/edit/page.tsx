'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RenderData } from '@/types/render';

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
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500'></div>
      </div>
    );
  }

  if (error && !render) {
    return (
      <div className='container max-w-4xl mx-auto py-10'>
        <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-red-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (!render) {
    return (
      <div className='container max-w-4xl mx-auto py-10'>
        <p className='text-gray-600'>Modelo no encontrado</p>
      </div>
    );
  }

  return (
    <div className='container max-w-4xl mx-auto py-10'>
      <div className='space-y-8'>
        {/* Header */}
        <div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push('/dashboard/renders')}
            className='mb-4'
          >
            ← Volver a Mis Modelos
          </Button>

          <h1 className='text-3xl font-bold mb-2'>Editar Archivos AR</h1>
          <h2 className='text-lg text-gray-600'>{render.name}</h2>
          {render.description && (
            <p className='text-md text-gray-500'>{render.description}</p>
          )}
        </div>

        {/* Status messages */}
        {error && (
          <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {success && (
          <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-green-600'>{success}</p>
          </div>
        )}

        {/* Current Files */}
        <Card>
          <CardHeader>
            <h3 className='text-xl font-bold'>Archivos Actuales</h3>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* iOS File */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-lg font-semibold'>📱 iOS (.usdz)</h4>
                {render.files.usdz && (
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDeleteFile('usdz')}
                    disabled={uploading}
                  >
                    Eliminar
                  </Button>
                )}
              </div>

              {render.files.usdz ? (
                <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-semibold text-green-800'>
                        ✅ Archivo disponible
                      </p>
                      <p className='text-sm text-green-600'>
                        {render.files.usdz.originalName}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
                  <p className='text-yellow-800'>
                    ❌ No hay archivo .usdz (requerido para iOS AR)
                  </p>
                  <p className='text-sm text-yellow-600'>
                    Sube un archivo .usdz para habilitar AR en dispositivos iOS
                  </p>
                </div>
              )}
            </div>

            {/* Android File */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-lg font-semibold'>🤖 Android (.glb)</h4>
                {render.files.glb && (
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDeleteFile('glb')}
                    disabled={uploading}
                  >
                    Eliminar
                  </Button>
                )}
              </div>

              {render.files.glb ? (
                <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-semibold text-green-800'>
                        ✅ Archivo disponible
                      </p>
                      <p className='text-sm text-green-600'>
                        {render.files.glb.originalName}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
                  <p className='text-yellow-800'>
                    ❌ No hay archivo .glb (requerido para Android AR)
                  </p>
                  <p className='text-sm text-yellow-600'>
                    Sube un archivo .glb para habilitar AR en dispositivos
                    Android
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload New Files */}
        <Card>
          <CardHeader>
            <h3 className='text-xl font-bold'>Subir Nuevos Archivos</h3>
            <p className='text-gray-600'>
              Sube archivos para actualizar o añadir compatibilidad AR
            </p>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* iOS Upload */}
            <div className='space-y-3'>
              <h4 className='text-lg font-semibold'>📱 Archivo iOS (.usdz)</h4>
              <div className='space-y-2'>
                <Input
                  type='file'
                  accept='.usdz'
                  onChange={e => setUsdzFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                />
                {usdzFile && (
                  <p className='text-sm text-gray-600'>
                    Seleccionado: {usdzFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Android Upload */}
            <div className='space-y-3'>
              <h4 className='text-lg font-semibold'>
                🤖 Archivo Android (.glb)
              </h4>
              <div className='space-y-2'>
                <Input
                  type='file'
                  accept='.glb,.gltf'
                  onChange={e => setGlbFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                />
                {glbFile && (
                  <p className='text-sm text-gray-600'>
                    Seleccionado: {glbFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUploadFiles}
              disabled={uploading || (!usdzFile && !glbFile)}
              className='w-full'
            >
              {uploading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Subiendo...
                </>
              ) : (
                'Subir Archivos'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h3 className='text-xl font-bold'>Instrucciones</h3>
          </CardHeader>
          <CardContent className='space-y-4 text-sm text-gray-600'>
            <div>
              <h4 className='font-semibold text-gray-900'>
                📱 Archivo .usdz (iOS)
              </h4>
              <ul className='list-disc list-inside space-y-1 mt-2'>
                <li>Formato nativo de Apple para AR</li>
                <li>Compatible con iPhone y iPad</li>
                <li>Se abre automáticamente con AR Quick Look</li>
                <li>Tamaño recomendado: menor a 25MB</li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold text-gray-900'>
                🤖 Archivo .glb (Android)
              </h4>
              <ul className='list-disc list-inside space-y-1 mt-2'>
                <li>Formato GLTF binario</li>
                <li>Compatible con Scene Viewer de Google</li>
                <li>Funciona en la mayoría de dispositivos Android</li>
                <li>Tamaño recomendado: menor a 15MB</li>
              </ul>
            </div>

            <div className='p-4 bg-blue-50 border border-blue-200 rounded-md'>
              <h4 className='font-semibold text-blue-900'>💡 Consejo</h4>
              <p className='text-blue-700 mt-1'>
                Para máxima compatibilidad, sube ambos formatos. Esto permitirá
                que tu modelo funcione en AR tanto en iOS como en Android.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
