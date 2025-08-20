import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Showcase AR - Omnia Platform',
  description:
    'Descubre ejemplos interactivos de Realidad Aumentada para diferentes industrias. Muebles, arquitectura, inmobiliaria y productos de lujo.',
  keywords: [
    'AR',
    'Realidad Aumentada',
    'Showcase',
    'Muebles',
    'Arquitectura',
    'Inmobiliaria',
    'E-commerce',
  ],
  robots: 'noindex, nofollow', // Hidden from search engines since it's for sales
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
