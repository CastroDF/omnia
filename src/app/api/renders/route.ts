import { NextRequest, NextResponse } from 'next/server';
import { Render } from '@/lib/models/Render';
import dbConnect from '@/lib/mongodb';
import slugify from 'slugify';

export async function GET() {
  await dbConnect();

  const renders = await Render.find().sort({ createdAt: -1 });

  return NextResponse.json(renders);
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();

  const { title, objUrl, mtlUrl, userId } = body;

  if (!title || !objUrl || !mtlUrl || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const slug = slugify(title, { lower: true, strict: true });

  const render = await Render.create({
    title,
    slug,
    objUrl,
    mtlUrl,
    userId,
  });

  return NextResponse.json(render);
};
