import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import RenderViewerR3F from '@/components/RenderViewerR3F';

interface RenderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getRender(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db('omnia');
    const renders = db.collection('renders');

    const render = await renders.findOne({ slug, status: 'active' });
    
    if (!render) {
      return null;
    }

    return {
      _id: render._id.toString(),
      name: render.name,
      description: render.description,
      slug: render.slug,
      userId: render.userId,
      userEmail: render.userEmail,
      files: render.files,
      status: render.status,
      createdAt: render.createdAt.toISOString(),
      updatedAt: render.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching render:', error);
    return null;
  }
}

export async function generateMetadata({ params }: RenderPageProps) {
  const { slug } = await params;
  const render = await getRender(slug);
  
  if (!render) {
    return {
      title: 'Render no encontrado - Omnia'
    };
  }

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    title: `${render.name} - Omnia AR`,
    description: render.description || `Visualiza ${render.name} en realidad aumentada`,
    openGraph: {
      title: `${render.name} - Omnia AR`,
      description: render.description || `Visualiza ${render.name} en realidad aumentada`,
      type: 'website',
      images: [
        {
          url: '/omnia-og-image.jpg',
          width: 1200,
          height: 630,
          alt: render.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${render.name} - Omnia AR`,
      description: render.description || `Visualiza ${render.name} en realidad aumentada`,
    },
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default async function RenderPage({ params }: RenderPageProps) {
  const { slug } = await params;
  const render = await getRender(slug);

  if (!render) {
    notFound();
  }

  return <RenderViewerR3F render={render} />;
}
