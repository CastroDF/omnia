import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('omnia');
    const renders = db.collection('renders');

    // Get user renders
    const userRenders = await renders
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      renders: userRenders,
    });
  } catch (error) {
    console.error('Error fetching renders:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
