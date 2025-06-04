import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import formidable from 'formidable';
import fs from 'fs';
import slugify from 'slugify';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Parsear form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';

    // Archivos principales para AR nativo
    const usdzFile = formData.get('usdzFile') as File | null;
    const glbFile = formData.get('glbFile') as File | null;

    if (!usdzFile && !glbFile) {
      return NextResponse.json(
        {
          error: 'Se requiere al menos un archivo: USDZ (iOS) o GLB (Android)',
        },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 },
      );
    }

    // Validar tipos de archivo
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

    // Generar slug único
    const timestamp = Date.now();
    const baseSlug = slugify(name, { lower: true, strict: true });
    const slug = `${baseSlug}-${timestamp}`;

    const uploadPromises = [];
    const files: any = {};

    // Subir archivo USDZ si existe (para iOS AR)
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

      files.usdz = {
        key: usdzKey,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${usdzKey}`,
        originalName: usdzFile.name,
      };
    }

    // Subir archivo GLB si existe (para Android AR)
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

      files.glb = {
        key: glbKey,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${glbKey}`,
        originalName: glbFile.name,
      };
    }

    // Subir todos los archivos a S3
    await Promise.all(uploadPromises);

    // Guardar en MongoDB
    const client = await clientPromise;
    const db = client.db('omnia');
    const renders = db.collection('renders');

    const renderDoc = {
      name,
      description,
      slug,
      userId: session.user.id,
      userEmail: session.user.email,
      files,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await renders.insertOne(renderDoc);

    return NextResponse.json({
      success: true,
      render: {
        id: result.insertedId,
        slug,
        name,
        description,
        publicUrl: `${process.env.NEXTAUTH_URL}/render/${slug}`,
      },
    });
  } catch (error) {
    console.error('Error uploading render:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
