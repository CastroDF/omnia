'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FiEye,
  FiArrowRight,
  FiHome,
  FiBox,
  FiShoppingBag,
  FiStar,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';

// Mock data for showcase examples
const showcaseExamples = [
  {
    id: 'furniture-sofa',
    name: 'Sofá Moderno Premium',
    description:
      'Sofá de lujo en cuero italiano con diseño contemporáneo. Perfecto para visualizar en tu sala de estar.',
    category: 'Muebles',
    icon: FiHome,
    badge: 'Mobiliario',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    image: '🛋️',
    features: ['Cuero italiano', 'Diseño moderno', 'Múltiples colores'],
    useCases: ['Tiendas de muebles', 'Decoración de interiores', 'E-commerce'],
    hasIOS: true,
    hasAndroid: true,
  },
  {
    id: 'plant-cutaway',
    name: 'Casa Planta Arquitectónica',
    description:
      'Modelo arquitectónico cortado que muestra el interior completo de una casa moderna de dos plantas.',
    category: 'Arquitectura',
    icon: FiHome,
    badge: 'Arquitectura',
    badgeColor: 'bg-green-500/20 text-green-400',
    image: '🏠',
    features: [
      'Vista interior completa',
      'Detalles arquitectónicos',
      'Múltiples niveles',
    ],
    useCases: ['Inmobiliarias', 'Arquitectos', 'Constructoras'],
    hasIOS: true,
    hasAndroid: false,
  },
  {
    id: 'building-tower',
    name: 'Torre Corporativa',
    description:
      'Rascacielos corporativo de 40 pisos con acabados de vidrio y acero. Ideal para presentaciones inmobiliarias.',
    category: 'Inmobiliaria',
    icon: BsBuilding,
    badge: 'Inmobiliaria',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    image: '🏢',
    features: ['40 pisos', 'Acabados premium', 'Entorno urbano'],
    useCases: ['Desarrolladores', 'Inversionistas', 'Marketing inmobiliario'],
    hasIOS: true,
    hasAndroid: true,
  },
  {
    id: 'luxury-watch',
    name: 'Reloj de Lujo Suizo',
    description:
      'Reloj de alta gama con mecanismo visible y acabados en oro. Perfecto para e-commerce de lujo.',
    category: 'Productos de Lujo',
    icon: FiShoppingBag,
    badge: 'E-commerce',
    badgeColor: 'bg-yellow-500/20 text-yellow-400',
    image: '⌚',
    features: ['Mecanismo visible', 'Acabados en oro', 'Animaciones'],
    useCases: ['Joyerías', 'E-commerce de lujo', 'Catálogos digitales'],
    hasIOS: false,
    hasAndroid: true,
  },
];

const ShowcaseExample = ({
  example,
  onViewAR,
}: {
  example: (typeof showcaseExamples)[0];
  onViewAR: (id: string) => void;
}) => {
  const isFullyCompatible = example.hasIOS && example.hasAndroid;

  return (
    <Card className='bg-gray-800 border-gray-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-teal-500'>
      <div className='relative aspect-[4/3] overflow-hidden rounded-t-xl'>
        <div className='w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative'>
          <div className='text-6xl mb-4'>{example.image}</div>

          {/* AR Compatibility indicators */}
          <div className='absolute top-3 right-3 flex gap-1'>
            {example.hasIOS && (
              <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500 text-white'>
                📱 iOS
              </span>
            )}
            {example.hasAndroid && (
              <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500 text-white'>
                🤖 Android
              </span>
            )}
          </div>

          {/* Status indicator */}
          <div className='absolute top-3 left-3'>
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                isFullyCompatible
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-black'
              }`}
            >
              {isFullyCompatible ? 'AR Completo' : 'Parcial'}
            </span>
          </div>

          {/* Category badge */}
          <div className='absolute bottom-3 left-3'>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${example.badgeColor}`}
            >
              {example.badge}
            </span>
          </div>
        </div>
      </div>

      <CardContent className='p-6'>
        <div className='space-y-4'>
          {/* Header */}
          <div className='flex items-start gap-3'>
            <example.icon className='text-teal-400' size={24} />
            <div className='flex-1'>
              <h3 className='font-bold text-lg text-white line-clamp-1'>
                {example.name}
              </h3>
              <p className='text-sm text-gray-400 line-clamp-2 mt-1'>
                {example.description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className='text-xs font-semibold text-teal-400 mb-2'>
              CARACTERÍSTICAS:
            </h4>
            <div className='flex flex-wrap gap-1'>
              {example.features.map((feature, index) => (
                <span
                  key={index}
                  className='inline-flex items-center px-2 py-1 rounded text-xs bg-gray-700 text-gray-300'
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className='text-xs font-semibold text-teal-400 mb-2'>
              CASOS DE USO:
            </h4>
            <div className='flex flex-wrap gap-1'>
              {example.useCases.map((useCase, index) => (
                <span
                  key={index}
                  className='inline-flex items-center px-2 py-1 rounded text-xs bg-teal-900/30 text-teal-300 border border-teal-600/30'
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          {/* Action button */}
          <Button
            onClick={() => onViewAR(example.id)}
            className='w-full bg-teal-600 hover:bg-teal-700 text-white'
          >
            <FiEye className='mr-2' />
            Ver en AR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ShowcasePage() {
  const handleViewAR = (id: string) => {
    // In a real implementation, this would navigate to the AR view
    alert(
      `Vista AR para: ${showcaseExamples.find(e => e.id === id)?.name}\n\nEn un entorno real, esto abriría la experiencia AR.`,
    );
  };

  const stats = [
    {
      label: 'Casos de Uso',
      value: '20+',
      icon: 'FiTrendingUp',
      color: 'text-teal-400',
    },
    {
      label: 'Industrias',
      value: '8+',
      icon: 'BsBuilding',
      color: 'text-blue-400',
    },
    {
      label: 'Clientes Satisfechos',
      value: '50+',
      icon: 'FiUsers',
      color: 'text-green-400',
    },
    {
      label: 'Modelos Alojados',
      value: '200+',
      icon: 'FiBox',
      color: 'text-purple-400',
    },
  ];

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'FiTrendingUp':
        return <FiTrendingUp className={className} />;
      case 'BsBuilding':
        return <BsBuilding className={className} />;
      case 'FiUsers':
        return <FiUsers className={className} />;
      case 'FiBox':
        return <FiBox className={className} />;
      default:
        return <FiTrendingUp className={className} />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      {/* Header */}
      <div className='bg-gray-800 border-b border-gray-700'>
        <div className='container max-w-7xl mx-auto px-4 py-8'>
          <div className='text-center space-y-4'>
            <h1 className='text-3xl md:text-4xl font-bold text-white'>
              Showcase <span className='text-teal-400'>Omnia AR</span>
            </h1>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Descubre el poder de la Realidad Aumentada para tu negocio con
              estos ejemplos interactivos
            </p>
            <div className='flex items-center justify-center gap-2 text-sm text-gray-400'>
              <span>Plataforma AR profesional para empresas</span>
              <span className='w-2 h-2 bg-teal-400 rounded-full'></span>
              <span>Sin instalación requerida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='container max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-12'>
          {stats.map((stat, index) => (
            <Card key={index} className='bg-gray-800 border-gray-700'>
              <CardContent className='p-4 text-center'>
                <div className='flex justify-center mb-2'>
                  {getIcon(stat.icon, stat.color)}
                </div>
                <div className='text-2xl font-bold text-white'>
                  {stat.value}
                </div>
                <div className='text-xs text-gray-400'>{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Examples Grid */}
        <div className='space-y-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-white mb-2'>
              Ejemplos Interactivos
            </h2>
            <p className='text-gray-400'>
              Explora cómo diferentes industrias utilizan nuestra tecnología AR
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {showcaseExamples.map(example => (
              <ShowcaseExample
                key={example.id}
                example={example}
                onViewAR={handleViewAR}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-16 text-center'>
          <Card className='bg-gradient-to-r from-teal-900/50 to-blue-900/50 border-teal-600/30'>
            <CardContent className='p-8'>
              <div className='space-y-4'>
                <h3 className='text-2xl font-bold text-white'>
                  ¿Listo para transformar tu negocio?
                </h3>
                <p className='text-gray-300 max-w-md mx-auto'>
                  Únete a las empresas que ya están revolucionando sus ventas
                  con Realidad Aumentada
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Button
                    size='lg'
                    className='bg-teal-600 hover:bg-teal-700 text-white'
                    onClick={() =>
                      window.open('mailto:contacto@omnia-ar.com', '_blank')
                    }
                  >
                    Contactar Ventas
                    <FiArrowRight className='ml-2' />
                  </Button>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                    onClick={() =>
                      window.open('https://demo.omnia-ar.com', '_blank')
                    }
                  >
                    Ver Demo Completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className='mt-12 pt-8 border-t border-gray-700 text-center'>
          <div className='flex items-center justify-center gap-2 text-teal-400 mb-2'>
            <FiStar className='fill-current' />
            <span className='font-bold text-lg'>Omnia</span>
            <span className='text-gray-400 text-sm'>AR Platform</span>
          </div>
          <p className='text-gray-500 text-sm'>
            Plataforma líder en Realidad Aumentada para empresas
          </p>
        </div>
      </div>
    </div>
  );
}
