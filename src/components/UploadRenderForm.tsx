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
  FiFile,
  FiX,
} from 'react-icons/fi';

interface UploadResponse {
  success: boolean;
  slug?: string;
  error?: string;
}

// Custom file upload component
interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept: string;
  selectedFile: File | null;
  label: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  description: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  selectedFile,
  label,
  icon,
  badge,
  badgeColor,
  description,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className='bg-gray-700 border-gray-600 w-full transition-all duration-200 hover:border-gray-500'>
      <CardContent className='p-3 sm:p-4'>
        <div className='space-y-3'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0'>
            <div className='flex items-center gap-2'>
              {icon}
              <span className='font-semibold text-white text-sm sm:text-base'>{label}</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}
              >
                {badge}
              </span>
            </div>
          </div>

          {/* File upload area */}
          <div className='space-y-2'>
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className='border-2 border-dashed border-gray-500 rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-200 hover:border-teal-500 hover:bg-gray-600/30 group'
              >
                <FiUpload
                  size={20}
                  className='mx-auto text-gray-400 group-hover:text-teal-400 transition-colors'
                />
                <p className='mt-2 text-white font-medium text-sm'>Seleccionar archivo</p>
                <p className='text-xs text-gray-400 mt-1'>Arrastra aquí o haz clic</p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='mt-2 border-gray-500 text-gray-300 hover:bg-teal-600 hover:border-teal-600 hover:text-white text-xs w-full sm:w-auto'
                  onClick={e => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <FiFile className='mr-1' size={14} />
                  Elegir archivo
                </Button>
              </div>
            ) : (
              <div className='bg-gray-600 rounded-lg p-3 border border-gray-500'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0'>
                  <div className='flex items-center gap-2'>
                    <FiCheckCircle className='text-green-400' size={16} />
                    <div className='min-w-0 flex-1'>
                      <p className='text-white font-medium text-sm truncate'>{selectedFile.name}</p>
                      <p className='text-gray-400 text-xs'>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={handleRemoveFile}
                    className='text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8 p-0 self-end sm:self-center'
                  >
                    <FiX size={14} />
                  </Button>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type='file'
              accept={accept}
              onChange={handleFileChange}
              className='hidden'
            />

            {/* Description */}
            <p className='text-xs text-gray-400 leading-relaxed'>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function UploadRenderForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [usdzFile, setUsdzFile] = useState<File | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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

    if (imageFile) {
      formData.append('imageFile', imageFile);
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
        setImageFile(null);
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
    <div className='space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto'>
      {/* Main form card */}
      <Card className='bg-gray-800 border-gray-700 shadow-2xl'>
        <CardContent className='p-4 sm:p-6'>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4 sm:space-y-6'>
              {/* Basic information section */}
              <div className='w-full'>
                <h2 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2'>
                  📝 <span>Información del Modelo</span>
                </h2>

                <div className='grid gap-3 sm:gap-4'>
                  <div className='w-full'>
                    <label className='block font-medium mb-2 text-gray-200 text-sm'>
                      Nombre del modelo *
                    </label>
                    <Input
                      type='text'
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder='Ej: Audi R8 2024'
                      className='bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 h-10 text-sm transition-all duration-200'
                      required
                    />
                  </div>

                  <div className='w-full'>
                    <label className='block font-medium mb-2 text-gray-200 text-sm'>
                      Descripción
                    </label>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder='Describe tu modelo 3D...'
                      className='bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none transition-all duration-200'
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* File upload sections */}
              <div className='w-full'>
                <h2 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2'>
                  🥽 <span>Archivos AR</span>
                </h2>

                <div className='space-y-3 sm:space-y-4'>
                  {/* USDZ File Upload */}
                  <FileUpload
                    onFileSelect={setUsdzFile}
                    accept='.usdz'
                    selectedFile={usdzFile}
                    label='Archivo USDZ'
                    icon={<FiSmartphone size={24} className='text-blue-400' />}
                    badge='iOS AR'
                    badgeColor='bg-blue-500/20 text-blue-400'
                    description='Compatible con iPhone y iPad (iOS 12+). Tamaño máximo: 50MB. Formato optimizado para dispositivos Apple con soporte AR nativo.'
                  />

                  {/* GLB File Upload */}
                  <FileUpload
                    onFileSelect={setGlbFile}
                    accept='.glb'
                    selectedFile={glbFile}
                    label='Archivo GLB'
                    icon={<FiTablet size={24} className='text-green-400' />}
                    badge='Android AR'
                    badgeColor='bg-green-500/20 text-green-400'
                    description='Compatible con Android 8.0+ y Chrome. Tamaño máximo: 50MB. Formato estándar para realidad aumentada en dispositivos Android.'
                  />
                </div>
              </div>

              {/* Image upload section */}
              <div className='w-full'>
                <h2 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2'>
                  🖼️ <span>Imagen de Vista Previa</span>
                  <span className='text-xs bg-gray-600 px-2 py-1 rounded text-gray-300'>
                    Opcional
                  </span>
                </h2>

                <FileUpload
                  onFileSelect={setImageFile}
                  accept='image/*'
                  selectedFile={imageFile}
                  label='Imagen del Modelo'
                  icon={<FiFile size={24} className='text-purple-400' />}
                  badge='Vista Previa'
                  badgeColor='bg-purple-500/20 text-purple-400'
                  description='Imagen que se mostrará en el dashboard. Formato: JPG, PNG, WebP. Tamaño máximo: 10MB. Recomendado: 1200x800px.'
                />
              </div>

              {/* Upload button and progress */}
              <div className='w-full pt-2'>
                {!isUploading && !result && (
                  <Button
                    type='submit'
                    className='w-full bg-teal-600 hover:bg-teal-700 text-white h-10 text-sm sm:text-base'
                    disabled={!name.trim() || (!usdzFile && !glbFile)}
                  >
                    <FiUpload className='mr-2' size={16} />
                    Subir Modelo AR
                  </Button>
                )}

                {isUploading && (
                  <div className='space-y-2'>
                    <div className='w-full bg-gray-700 rounded-full h-2'>
                      <div
                        className='bg-teal-600 h-2 rounded-full transition-all duration-300'
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
                    className={`p-3 sm:p-4 rounded-lg ${
                      result.success
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      {result.success ? (
                        <FiCheckCircle className='text-green-400' size={16} />
                      ) : (
                        <FiAlertCircle className='text-red-400' size={16} />
                      )}
                      <span
                        className={`font-semibold text-sm ${
                          result.success ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {result.success ? '¡Éxito!' : 'Error'}
                      </span>
                    </div>

                    {result.success && result.slug ? (
                      <div className='mt-2 space-y-2'>
                        <p className='text-green-100 text-sm'>
                          Tu modelo AR fue subido correctamente y está listo para usar.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-2'>
                          <Button
                            size='sm'
                            onClick={() => router.push(`/render/${result.slug}`)}
                            className='bg-green-600 hover:bg-green-700 w-full sm:w-auto'
                          >
                            Ver en AR
                            <FiArrowRight className='ml-1' size={14} />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => router.push('/dashboard/renders')}
                            className='border-green-500 text-green-400 hover:bg-green-500/10 w-full sm:w-auto'
                          >
                            Ir a Mis Renders
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className='text-red-100 mt-2 text-sm'>{result.error}</p>
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
