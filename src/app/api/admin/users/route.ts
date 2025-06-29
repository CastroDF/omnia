import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all users (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const users = await usersCollection
      .find({})
      .project({
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        role: 1,
        active: 1,
        emailVerified: 1,
      })
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PATCH - Update user (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, updates } = await request.json();

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Validate updates - only allow role and active fields
    const allowedUpdates: Record<string, string | boolean> = {};
    if ('role' in updates && ['user', 'admin'].includes(updates.role)) {
      allowedUpdates.role = updates.role;
    }
    if ('active' in updates && typeof updates.active === 'boolean') {
      allowedUpdates.active = updates.active;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 },
      );
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: allowedUpdates },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, updated: allowedUpdates });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
