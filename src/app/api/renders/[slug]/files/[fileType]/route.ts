import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; fileType: string } },
) {
  try {
    // Verificar autenticación
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { slug, fileType } = await params;

    // Validar tipo de archivo
    if (fileType !== 'usdz' && fileType !== 'glb') {
      return NextResponse.json(
        {
          error: 'Tipo de archivo no válido. Usa "usdz" o "glb"',
        },
        { status: 400 },
      );
    }

    // Conectar a MongoDB y buscar el render
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

    // Verificar que el archivo existe
    const fileData = render.files[fileType];
    if (!fileData) {
      return NextResponse.json(
        {
          error: `Archivo ${fileType.toUpperCase()} no encontrado`,
        },
        { status: 404 },
      );
    }

    // Eliminar archivo de S3
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: fileData.key,
        }),
      );
    } catch (s3Error) {
      console.error('Error deleting from S3:', s3Error);
      // Continuar aunque haya error en S3 para limpiar la base de datos
    }

    // Actualizar el documento en MongoDB
    const updateQuery: any = {
      $unset: {},
      $set: { updatedAt: new Date() },
    };
    updateQuery.$unset[`files.${fileType}`] = '';

    await renders.updateOne({ slug, userId: session.user.id }, updateQuery);

    return NextResponse.json({
      success: true,
      message: `Archivo ${fileType.toUpperCase()} eliminado exitosamente`,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
