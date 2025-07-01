import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { slug } = await params;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('omnia');
    const renders = db.collection('renders');

    // Find render by slug for user
    const render = await renders.findOne({
      slug,
      userId: session.user.id,
      status: 'active',
    });

    if (!render) {
      return NextResponse.json(
        {
          error: 'Modelo no encontrado o no tienes permisos para verlo',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      render: {
        ...render,
        _id: render._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error getting render:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
