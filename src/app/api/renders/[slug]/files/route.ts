import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(
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

    // Parse form data
    const formData = await request.formData();
    const usdzFile = formData.get('usdzFile') as File | null;
    const glbFile = formData.get('glbFile') as File | null;

    if (!usdzFile && !glbFile) {
      return NextResponse.json(
        {
          error: 'Se requiere al menos un archivo: USDZ o GLB',
        },
        { status: 400 },
      );
    }

    // Validate file types
    const validUsdzTypes = ['model/vnd.usdz+zip', 'application/octet-stream'];
    const validGlbTypes = ['model/gltf-binary', 'application/octet-stream'];

    if (
      usdzFile &&
      !validUsdzTypes.includes(usdzFile.type) &&
      !usdzFile.name.endsWith('.usdz')
    ) {
      return NextResponse.json(
        { error: 'El archivo USDZ debe tener extensión .usdz' },
        { status: 400 },
      );
    }

    if (
      glbFile &&
      !validGlbTypes.includes(glbFile.type) &&
      !glbFile.name.endsWith('.glb')
    ) {
      return NextResponse.json(
        { error: 'El archivo GLB debe tener extensión .glb' },
        { status: 400 },
      );
    }

    // Connect to MongoDB and find render
    const client = await clientPromise;
    const db = client.db('omnia');
    const renders = db.collection('renders');

    const render = await renders.findOne({
      slug,
      userId: session.user.id,
      status: 'active',
    });

    if (!render) {
      return NextResponse.json(
        {
          error: 'Modelo no encontrado o no tienes permisos',
        },
        { status: 404 },
      );
    }

    const uploadPromises = [];
    const newFiles: Record<
      string,
      {
        key: string;
        url: string;
        originalName: string;
      }
    > = { ...render.files };

    // Upload USDZ file if exists
    if (usdzFile) {
      const usdzBuffer = Buffer.from(await usdzFile.arrayBuffer());
      const usdzKey = `renders/${slug}/${usdzFile.name}`;

      uploadPromises.push(
        s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: usdzKey,
            Body: usdzBuffer,
            ContentType: 'model/vnd.usdz+zip',
          }),
        ),
      );

      newFiles.usdz = {
        key: usdzKey,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${usdzKey}`,
        originalName: usdzFile.name,
      };
    }

    // Upload GLB file if exists
    if (glbFile) {
      const glbBuffer = Buffer.from(await glbFile.arrayBuffer());
      const glbKey = `renders/${slug}/${glbFile.name}`;

      uploadPromises.push(
        s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: glbKey,
            Body: glbBuffer,
            ContentType: 'model/gltf-binary',
          }),
        ),
      );

      newFiles.glb = {
        key: glbKey,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${glbKey}`,
        originalName: glbFile.name,
      };
    }

    // Upload all files to S3
    await Promise.all(uploadPromises);

    // Update document in MongoDB
    await renders.updateOne(
      { slug, userId: session.user.id },
      {
        $set: {
          files: newFiles,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: 'Archivos subidos exitosamente',
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
