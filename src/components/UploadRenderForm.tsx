'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FiUpload,
  FiSmartphone,
  FiTablet,
  FiCheckCircle,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';

interface UploadResponse {
  success: boolean;
  slug?: string;
  error?: string;
}

export default function UploadRenderForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [usdzFile, setUsdzFile] = useState<File | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usdzFile && !glbFile) {
      setResult({
        success: false,
        error: 'Se requiere al menos un archivo: USDZ (iOS) o GLB (Android)',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (usdzFile) {
      formData.append('usdzFile', usdzFile);
    }

    if (glbFile) {
      formData.append('glbFile', glbFile);
    }

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, slug: data.slug });
        setName('');
        setDescription('');
        setUsdzFile(null);
        setGlbFile(null);
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch {
      setResult({ success: false, error: 'Error al subir archivos' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <div className='space-y-6 w-full'>
      {/* Main form card */}
      <Card className='bg-gray-800 border-gray-700 w-full'>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit}>
            <div className='space-y-6'>
              {/* Basic information section */}
              <div className='w-full'>
                <h2 className='text-lg font-semibold text-white mb-4'>
                  📝 Información del Modelo
                </h2>

                <div className='space-y-4'>
                  <div className='w-full'>
                    <label className='block font-semibold mb-2 text-gray-300'>
                      Nombre del modelo *
                    </label>
                    <Input
                      type='text'
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder='Ej: Audi R8 2024'
                      className='bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500'
                      required
                    />
                  </div>

                  <div className='w-full'>
                    <label className='block font-semibold mb-2 text-gray-300'>
                      Descripción
                    </label>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder='Describe tu modelo 3D...'
                      className='bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 resize-none'
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* File upload sections */}
              <div className='w-full'>
                <h2 className='text-lg font-semibold text-white mb-4'>
                  🥽 Archivos AR
                </h2>

                <div className='space-y-4'>
                  {/* USDZ File Upload */}
                  <Card className='bg-gray-700 border-gray-600 w-full'>
                    <CardContent className='p-4'>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between w-full'>
                          <div className='flex items-center gap-3'>
                            <FiSmartphone size={20} className='text-teal-400' />
                            <span className='font-semibold text-white'>
                              Archivo USDZ
                            </span>
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400'>
                              iOS AR
                            </span>
                          </div>
                        </div>

                        <div className='w-full'>
                          <Input
                            type='file'
                            accept='.usdz'
                            onChange={e =>
                              setUsdzFile(e.target.files?.[0] || null)
                            }
                            className='bg-gray-800 border-gray-500 text-white file:bg-gray-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm'
                          />
                        </div>

                        {usdzFile && (
                          <div className='flex items-center gap-2 text-green-400 text-sm'>
                            <FiCheckCircle size={16} />
                            <span>{usdzFile.name}</span>
                          </div>
                        )}

                        <p className='text-xs text-gray-400'>
                          Compatible con iPhone y iPad (iOS 12+). Tamaño máximo:
                          50MB
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* GLB File Upload */}
                  <Card className='bg-gray-700 border-gray-600 w-full'>
                    <CardContent className='p-4'>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between w-full'>
                          <div className='flex items-center gap-3'>
                            <FiTablet size={20} className='text-teal-400' />
                            <span className='font-semibold text-white'>
                              Archivo GLB
                            </span>
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400'>
                              Android AR
                            </span>
                          </div>
                        </div>

                        <div className='w-full'>
                          <Input
                            type='file'
                            accept='.glb'
                            onChange={e =>
                              setGlbFile(e.target.files?.[0] || null)
                            }
                            className='bg-gray-800 border-gray-500 text-white file:bg-gray-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm'
                          />
                        </div>

                        {glbFile && (
                          <div className='flex items-center gap-2 text-green-400 text-sm'>
                            <FiCheckCircle size={16} />
                            <span>{glbFile.name}</span>
                          </div>
                        )}

                        <p className='text-xs text-gray-400'>
                          Compatible con Android 8.0+ y Chrome. Tamaño máximo:
                          50MB
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Upload button and progress */}
              <div className='w-full pt-4'>
                {!isUploading && !result && (
                  <Button
                    type='submit'
                    size='lg'
                    className='w-full bg-teal-600 hover:bg-teal-700 text-white'
                    disabled={!name.trim() || (!usdzFile && !glbFile)}
                  >
                    <FiUpload className='mr-2' />
                    Subir Modelo AR
                  </Button>
                )}

                {isUploading && (
                  <div className='space-y-3'>
                    <div className='w-full bg-gray-700 rounded-full h-3'>
                      <div
                        className='bg-teal-600 h-3 rounded-full transition-all duration-300'
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className='text-center text-white text-sm'>
                      Subiendo archivos... {uploadProgress}%
                    </p>
                  </div>
                )}

                {result && !isUploading && (
                  <div
                    className={`p-4 rounded-lg ${
                      result.success
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      {result.success ? (
                        <FiCheckCircle className='text-green-400' />
                      ) : (
                        <FiAlertCircle className='text-red-400' />
                      )}
                      <span
                        className={`font-semibold ${
                          result.success ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {result.success ? '¡Éxito!' : 'Error'}
                      </span>
                    </div>

                    {result.success && result.slug ? (
                      <div className='mt-3 space-y-3'>
                        <p className='text-green-100'>
                          Tu modelo AR fue subido correctamente y está listo
                          para usar.
                        </p>
                        <div className='flex gap-2'>
                          <Button
                            onClick={() =>
                              router.push(`/render/${result.slug}`)
                            }
                            className='bg-green-600 hover:bg-green-700'
                          >
                            Ver en AR
                            <FiArrowRight className='ml-2' />
                          </Button>
                          <Button
                            variant='outline'
                            onClick={() => router.push('/dashboard/renders')}
                            className='border-green-500 text-green-400 hover:bg-green-500/10'
                          >
                            Ir a Mis Renders
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className='text-red-100 mt-2'>{result.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
