import {
  IncomingForm,
  File as FormidableFile,
  Fields,
  Files,
} from 'formidable';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadToS3(
  file: FormidableFile,
  folder: string,
): Promise<string> {
  const fileStream = fs.createReadStream(file.filepath);
  const ext = path.extname(file.originalFilename || '');
  const key = `${folder}/${randomUUID()}${ext}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype || 'application/octet-stream',
    ACL: ObjectCannedACL.public_read,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    }); // 10MB

    const data = await new Promise<{ fields: Fields; files: Files }>(
      (resolve, reject) => {
        form.parse(
          req as unknown as Parameters<typeof form.parse>[0],
          (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
          },
        );
      },
    );

    const objFile = Array.isArray(data.files.obj)
      ? data.files.obj[0]
      : data.files.obj;
    const mtlFile = Array.isArray(data.files.mtl)
      ? data.files.mtl[0]
      : data.files.mtl;

    if (!objFile || !mtlFile) {
      return NextResponse.json(
        { error: 'Both .obj and .mtl files are required' },
        { status: 400 },
      );
    }

    const folder = `uploads/${Date.now()}`;
    const [objUrl, mtlUrl] = await Promise.all([
      uploadToS3(objFile, folder),
      uploadToS3(mtlFile, folder),
    ]);

    return NextResponse.json({ objUrl, mtlUrl }, { status: 200 });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload to S3 failed' }, { status: 500 });
  }
}
