import { useEffect, useState } from 'react';

interface ARCompatibilityResult {
  deviceType: 'ios' | 'android' | 'desktop' | 'unknown';
  isARSupported: boolean;
  supportMessage: string;
}

export const useARCompatibility = (): ARCompatibilityResult => {
  const [deviceType, setDeviceType] = useState<
    'ios' | 'android' | 'desktop' | 'unknown'
  >('unknown');
  const [isARSupported, setIsARSupported] = useState<boolean>(false);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;

      // Detect iOS
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        setDeviceType('ios');
        setIsARSupported(true);
        return;
      }

      // Detect Android
      if (/Android/.test(userAgent)) {
        setDeviceType('android');
        setIsARSupported(true);
        return;
      }

      // Desktop or other devices
      setDeviceType('desktop');
      setIsARSupported(false);
    };

    detectDevice();
  }, []);

  const getSupportMessage = (): string => {
    switch (deviceType) {
      case 'ios':
      case 'android':
        return 'Dispositivo compatible con AR';
      case 'desktop':
        return 'Abrí esta página en tu celular';
      default:
        return 'Navegador no compatible';
    }
  };

  return {
    deviceType,
    isARSupported,
    supportMessage: getSupportMessage(),
  };
};
