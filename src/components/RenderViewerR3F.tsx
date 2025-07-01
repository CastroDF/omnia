'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RenderData } from '@/types/render';

interface RenderViewerProps {
  render: RenderData;
}

export default function RenderViewerR3F({ render }: RenderViewerProps) {
  const [deviceType, setDeviceType] = useState<
    'ios' | 'android' | 'desktop' | 'unknown'
  >('unknown');
  const [arCapability, setARCapability] = useState<
    'available' | 'no-files' | 'not-supported'
  >('not-supported');

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;

      // Detect iOS
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        setDeviceType('ios');
        // AR available if .usdz file exists
        if (render.files.usdz) {
          setARCapability('available');
        } else {
          setARCapability('no-files');
        }
        return;
      }

      // Detect Android
      if (/Android/.test(userAgent)) {
        setDeviceType('android');
        // AR available if .glb file exists
        if (render.files.glb) {
          setARCapability('available');
        } else {
          setARCapability('no-files');
        }
        return;
      }

      // Desktop or other devices
      setDeviceType('desktop');
      setARCapability('not-supported');
    };

    detectDevice();
  }, [render.files]);

  const getARButtonText = () => {
    switch (deviceType) {
      case 'ios':
        return arCapability === 'available'
          ? '🥽 Ver en AR (iOS)'
          : '📱 AR no disponible (falta .usdz)';
      case 'android':
        return arCapability === 'available'
          ? '🥽 Ver en AR (Android)'
          : '📱 AR no disponible (falta .glb)';
      case 'desktop':
        return '💻 AR solo en móviles';
      default:
        return 'AR No Disponible';
    }
  };

  const getARButtonVariant = () => {
    return arCapability === 'available' ? 'default' : 'secondary';
  };

  const handleARClick = () => {
    if (arCapability !== 'available') {
      let message = '';

      switch (deviceType) {
        case 'ios':
          message =
            '📱 AR para iOS requiere archivo .usdz\n\n💡 Pide al creador que suba un archivo .usdz para usar AR nativo en iPhone/iPad';
          break;
        case 'android':
          message =
            '🤖 AR para Android requiere archivo .glb\n\n💡 Pide al creador que suba un archivo .glb para usar AR nativo en Android';
          break;
        case 'desktop':
          message =
            '📱 AR nativo solo está disponible en dispositivos móviles\n\n✅ Para usar AR:\n• Abre este enlace en tu iPhone/Android\n• El creador debe haber subido archivos .usdz/.glb';
          break;
        default:
          message = '🚫 Tu dispositivo no soporta AR nativo';
      }

      alert(message);
      return;
    }

    // AR available - create native links
    if (deviceType === 'ios' && render.files.usdz) {
      // iOS: use Quick Look with rel="ar"
      const link = document.createElement('a');
      link.href = render.files.usdz.url;
      link.rel = 'ar';
      link.download = render.files.usdz.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (deviceType === 'android' && render.files.glb) {
      // Android: use Scene Viewer with intent://
      const fallbackUrl = encodeURIComponent(window.location.href);
      const modelUrl = encodeURIComponent(render.files.glb.url);

      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar_preferred&title=${encodeURIComponent(render.name)}&browser_fallback_url=${fallbackUrl}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallbackUrl};end`;

      window.location.href = intentUrl;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='w-full p-0'>
        {/* Header */}
        <div className='bg-white border-b border-gray-200 p-4'>
          <div className='container max-w-7xl mx-auto'>
            <div className='space-y-3'>
              <div>
                <h1 className='text-xl md:text-2xl font-bold mb-1'>
                  {render.name}
                </h1>
                {render.description && (
                  <p className='text-gray-600 text-sm md:text-lg'>
                    {render.description}
                  </p>
                )}
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  variant={getARButtonVariant()}
                  size='sm'
                  className='md:text-base'
                  onClick={handleARClick}
                >
                  {getARButtonText()}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='md:text-base'
                  onClick={() => window.location.reload()}
                >
                  Reiniciar
                </Button>
              </div>

              <p className='text-xs text-gray-500'>
                {new Date(render.createdAt).toLocaleDateString()} •{' '}
                {render.userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Preview and Information */}
        <div className='container max-w-4xl mx-auto py-8'>
          <div className='space-y-6'>
            {/* Preview Card */}
            <Card>
              <CardContent className='p-8'>
                <div className='flex justify-center'>
                  <div className='space-y-4 text-center max-w-md'>
                    <div className='text-6xl'>🥽</div>
                    <h2 className='text-xl font-bold'>Experiencia AR Lista</h2>
                    <p className='text-gray-600'>
                      Este modelo está optimizado para Realidad Aumentada nativa
                      en tu dispositivo móvil.
                    </p>

                    <Button
                      variant={getARButtonVariant()}
                      size='lg'
                      onClick={handleARClick}
                    >
                      {getARButtonText()}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-bold mb-4'>
                  Instrucciones para AR
                </h3>
                <div className='space-y-4 text-sm text-gray-600'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <h4 className='font-semibold text-gray-900'>
                        📱 iPhone/iPad
                      </h4>
                      <ul className='space-y-1 list-disc list-inside'>
                        <li>Toca el botón &ldquo;Ver en AR&rdquo;</li>
                        <li>Permite el acceso a la cámara</li>
                        <li>
                          Mueve el dispositivo para encontrar una superficie
                        </li>
                        <li>Toca para colocar el modelo</li>
                      </ul>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='font-semibold text-gray-900'>
                        🤖 Android
                      </h4>
                      <ul className='space-y-1 list-disc list-inside'>
                        <li>Toca el botón &ldquo;Ver en AR&rdquo;</li>
                        <li>Se abrirá Google Scene Viewer</li>
                        <li>Permite permisos de cámara</li>
                        <li>Apunta a una superficie plana</li>
                      </ul>
                    </div>
                  </div>

                  <div className='border-t pt-4'>
                    <h4 className='font-semibold text-gray-900 mb-2'>
                      💡 Consejos para mejor experiencia
                    </h4>
                    <ul className='space-y-1 list-disc list-inside'>
                      <li>Usa buena iluminación</li>
                      <li>Busca superficies planas como mesas o suelo</li>
                      <li>Mantén el dispositivo estable mientras se carga</li>
                      <li>
                        Si no funciona, recarga la página e intenta nuevamente
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Info Card */}
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-bold mb-4'>
                  Información del Modelo
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div className='space-y-2'>
                    <div>
                      <span className='font-semibold'>Nombre:</span>{' '}
                      {render.name}
                    </div>
                    <div>
                      <span className='font-semibold'>Slug:</span> {render.slug}
                    </div>
                    <div>
                      <span className='font-semibold'>Creado:</span>{' '}
                      {new Date(render.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div>
                      <span className='font-semibold'>iOS (.usdz):</span>{' '}
                      {render.files.usdz ? (
                        <span className='text-green-600'>✅ Disponible</span>
                      ) : (
                        <span className='text-red-600'>❌ No disponible</span>
                      )}
                    </div>
                    <div>
                      <span className='font-semibold'>Android (.glb):</span>{' '}
                      {render.files.glb ? (
                        <span className='text-green-600'>✅ Disponible</span>
                      ) : (
                        <span className='text-red-600'>❌ No disponible</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
