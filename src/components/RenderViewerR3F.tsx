'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RenderData } from '@/types/render';
import { FiInstagram, FiTwitter, FiSmartphone } from 'react-icons/fi';
import QRCode from 'qrcode';

interface RenderViewerProps {
  render: RenderData;
}

// QR Code Component for Desktop Users
const QRCodeDisplay = ({ url, size = 120 }: { url: string; size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch(() => {
        setQrError(true);
      });
    }
  }, [url, size]);

  if (qrError) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <div
          className='bg-gray-200 rounded-lg p-4 flex items-center justify-center'
          style={{ width: size, height: size }}
        >
          <p className='text-xs text-gray-500 text-center'>QR no disponible</p>
        </div>
        <p className='text-xs text-gray-400 text-center max-w-32'>Copia el enlace manualmente</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <canvas ref={canvasRef} className='rounded-lg bg-white p-2' width={size} height={size} />
      <p className='text-xs text-gray-400 text-center max-w-32'>Escanea con tu móvil</p>
    </div>
  );
};

export default function RenderViewerR3F({ render }: RenderViewerProps) {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop' | 'unknown'>(
    'unknown',
  );
  const [arCapability, setARCapability] = useState<'available' | 'no-files' | 'not-supported'>(
    'not-supported',
  );

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
    <div className='min-h-screen bg-gray-900'>
      <div className='w-full p-0'>
        {/* Header */}
        <div className='bg-gray-800 border-b border-gray-700 p-3'>
          <div className='container max-w-7xl mx-auto'>
            <div className='flex items-start justify-between'>
              {/* Left side - Model info */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h1 className='text-base sm:text-lg font-bold text-white truncate'>
                    {render.name}
                  </h1>
                  <span className='text-xs bg-teal-600 text-white px-2 py-1 rounded flex-shrink-0'>
                    AR
                  </span>
                </div>
                {render.description && (
                  <p className='text-gray-400 text-xs sm:text-sm line-clamp-1'>
                    {render.description}
                  </p>
                )}
              </div>

              {/* Right side - Branding and social */}
              <div className='flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 flex-shrink-0'>
                {/* Social Media Icons - only show on larger screens */}
                <div className='hidden sm:flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-400 hover:text-white hover:bg-gray-700 p-2 h-8 w-8'
                    onClick={() => {}} // No functionality - just for demo
                  >
                    <FiInstagram size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-400 hover:text-white hover:bg-gray-700 p-2 h-8 w-8'
                    onClick={() => {}} // No functionality - just for demo
                  >
                    <FiTwitter size={16} />
                  </Button>
                </div>

                {/* Omnia Branding */}
                <div className='text-right'>
                  <p className='text-teal-400 font-bold text-sm'>Omnia</p>
                  <p className='text-gray-500 text-xs hidden sm:block'>AR Platform</p>
                </div>
              </div>
            </div>

            {/* Additional info and mobile social icons */}
            <div className='flex items-center justify-between mt-2'>
              <p className='text-gray-500 text-xs'>
                {new Date(render.createdAt).toLocaleDateString()} • {render.userEmail}
              </p>

              {/* Mobile social icons */}
              <div className='flex sm:hidden items-center gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-400 hover:text-white hover:bg-gray-700 p-1 h-6 w-6'
                  onClick={() => {}} // No functionality - just for demo
                >
                  <FiInstagram size={12} />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-400 hover:text-white hover:bg-gray-700 p-1 h-6 w-6'
                  onClick={() => {}} // No functionality - just for demo
                >
                  <FiTwitter size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Preview and Information */}
        <div className='container max-w-4xl mx-auto py-4 px-4 sm:py-8'>
          <div className='space-y-4 sm:space-y-6'>
            {/* Preview Card */}
            <Card className='bg-gray-800 border-gray-700'>
              <CardContent className='p-4 sm:p-8'>
                <div className='flex justify-center'>
                  <div className='space-y-4 text-center max-w-md w-full'>
                    {/* Model Preview Image */}
                    {render.files.previewImage ? (
                      <div className='relative w-full aspect-square max-w-sm sm:max-w-md mx-auto mb-2'>
                        <Image
                          src={render.files.previewImage.url}
                          alt={render.name}
                          fill
                          className='object-cover rounded-xl shadow-2xl border-2 border-gray-600/30'
                          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 400px, 500px'
                          priority
                        />
                        {/* AR Badge overlay */}
                        <div className='absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg'>
                          AR
                        </div>
                      </div>
                    ) : (
                      <div className='text-4xl sm:text-6xl mb-2'>🥽</div>
                    )}
                    <h2 className='text-lg sm:text-xl font-bold text-white'>
                      Experiencia AR Lista
                    </h2>
                    <p className='text-gray-300 text-sm sm:text-base'>
                      {deviceType === 'desktop'
                        ? 'Para usar AR, abre este enlace en tu móvil 📱'
                        : 'Este modelo está optimizado para Realidad Aumentada nativa en tu dispositivo.'}
                    </p>

                    {deviceType !== 'desktop' && arCapability === 'available' && (
                      <div className='bg-teal-900/30 border border-teal-600/50 rounded-lg p-3'>
                        <p className='text-teal-300 text-sm font-medium text-center'>
                          🎉 ¡Tu dispositivo soporta AR! Toca el botón para comenzar
                        </p>
                      </div>
                    )}

                    {deviceType === 'desktop' && (
                      <div className='bg-blue-900/30 border border-blue-600/50 rounded-lg p-4'>
                        <div className='flex flex-col items-center gap-3'>
                          <p className='text-blue-300 text-sm text-center font-medium'>
                            💻 Para usar AR en tu móvil:
                          </p>
                          <QRCodeDisplay url={window.location.href} size={100} />
                          <p className='text-blue-200 text-xs text-center'>
                            O envía este enlace a tu dispositivo móvil
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      variant={getARButtonVariant()}
                      size='lg'
                      className={`w-full sm:w-auto ${arCapability === 'available' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-300'}`}
                      onClick={handleARClick}
                    >
                      {getARButtonText()}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className='bg-gray-800 border-gray-700'>
              <CardContent className='p-4 sm:p-6'>
                {/* Model Image Header */}
                {render.files.previewImage && (
                  <div className='flex justify-center mb-6'>
                    <div className='relative w-24 h-24 sm:w-32 sm:h-32'>
                      <Image
                        src={render.files.previewImage.url}
                        alt={render.name}
                        fill
                        className='object-cover rounded-lg shadow-lg'
                        sizes='(max-width: 640px) 96px, 128px'
                      />
                    </div>
                  </div>
                )}
                <h3 className='text-lg font-bold mb-4 text-white'>Instrucciones para AR</h3>
                <div className='space-y-4 text-sm text-gray-300'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <h4 className='font-semibold text-teal-400 text-base'>📱 iPhone/iPad</h4>
                      <ul className='space-y-2 list-none space-y-1'>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>1.</span>
                          <span>Toca el botón &ldquo;Ver en AR&rdquo;</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>2.</span>
                          <span>Permite el acceso a la cámara</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>3.</span>
                          <span>Mueve el dispositivo para encontrar una superficie</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>4.</span>
                          <span>Toca para colocar el modelo</span>
                        </li>
                      </ul>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='font-semibold text-teal-400 text-base'>🤖 Android</h4>
                      <ul className='space-y-2 list-none'>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>1.</span>
                          <span>Toca el botón &ldquo;Ver en AR&rdquo;</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>2.</span>
                          <span>Se abrirá Google Scene Viewer</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>3.</span>
                          <span>Permite permisos de cámara</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-teal-400 text-xs'>4.</span>
                          <span>Apunta a una superficie plana</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* QR Code section for desktop users */}
                  {deviceType === 'desktop' && (
                    <div className='border-t border-gray-600 pt-4'>
                      <h4 className='font-semibold text-blue-400 mb-3 text-base flex items-center gap-2'>
                        <FiSmartphone size={16} />
                        Acceder desde móvil
                      </h4>
                      <div className='flex flex-col sm:flex-row items-center gap-4'>
                        <QRCodeDisplay url={window.location.href} size={80} />
                        <div className='flex-1 text-center sm:text-left'>
                          <p className='text-gray-300 text-sm mb-2'>
                            Escanea este código QR con tu móvil para acceder directamente a la
                            experiencia AR.
                          </p>
                          <p className='text-gray-400 text-xs'>
                            Compatible con cualquier app de cámara o escáner QR
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className='border-t border-gray-600 pt-4'>
                    <h4 className='font-semibold text-teal-400 mb-3 text-base'>
                      💡 Consejos para mejor experiencia
                    </h4>
                    <ul className='space-y-2 list-none'>
                      <li className='flex items-start gap-2'>
                        <span className='text-yellow-400'>•</span>
                        <span>Usa buena iluminación</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-yellow-400'>•</span>
                        <span>Busca superficies planas como mesas o suelo</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-yellow-400'>•</span>
                        <span>Mantén el dispositivo estable mientras se carga</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-yellow-400'>•</span>
                        <span>Si no funciona, recarga la página e intenta nuevamente</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Info Card */}
            <Card className='bg-gray-800 border-gray-700'>
              <CardContent className='p-4 sm:p-6'>
                <h3 className='text-lg font-bold mb-4 text-white'>Información del Modelo</h3>
                <div className='space-y-3 text-sm text-gray-300'>
                  {/* Model Info */}
                  <div className='space-y-2'>
                    <div className='flex flex-col sm:flex-row sm:justify-between'>
                      <span className='font-semibold text-gray-200'>Nombre:</span>
                      <span className='text-white'>{render.name}</span>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:justify-between'>
                      <span className='font-semibold text-gray-200'>Slug:</span>
                      <span className='text-gray-300 font-mono text-xs'>{render.slug}</span>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:justify-between'>
                      <span className='font-semibold text-gray-200'>Creado:</span>
                      <span>{new Date(render.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Compatibility Info */}
                  <div className='border-t border-gray-600 pt-3 space-y-2'>
                    <h4 className='font-semibold text-gray-200 text-base mb-2'>
                      Compatibilidad AR:
                    </h4>
                    <div className='flex flex-col sm:flex-row sm:justify-between'>
                      <span className='font-semibold text-gray-200'>iOS (.usdz):</span>
                      <span>
                        {render.files.usdz ? (
                          <span className='text-green-400 font-medium'>✅ Disponible</span>
                        ) : (
                          <span className='text-red-400 font-medium'>❌ No disponible</span>
                        )}
                      </span>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:justify-between'>
                      <span className='font-semibold text-gray-200'>Android (.glb):</span>
                      <span>
                        {render.files.glb ? (
                          <span className='text-green-400 font-medium'>✅ Disponible</span>
                        ) : (
                          <span className='text-red-400 font-medium'>❌ No disponible</span>
                        )}
                      </span>
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
