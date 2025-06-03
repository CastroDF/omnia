import { IncomingForm } from 'formidable';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
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

async function uploadToS3(file: any, folder: string): Promise<string> {
  const fileStream = fs.createReadStream(file.filepath);
  const ext = path.extname(file.originalFilename);
  const key = `${folder}/${randomUUID()}${ext}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
    ACL: ObjectCannedACL.public_read,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true, maxFileSize: 10 * 1024 * 1024 }); // 10MB

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    const objFile = files.obj?.[0];
    const mtlFile = files.mtl?.[0];

    if (!objFile || !mtlFile) {
      return res.status(400).json({ error: 'Both .obj and .mtl files are required' });
    }

    try {
      const folder = `uploads/${Date.now()}`;
      const [objUrl, mtlUrl] = await Promise.all([
        uploadToS3(objFile, folder),
        uploadToS3(mtlFile, folder),
      ]);

      return res.status(200).json({ objUrl, mtlUrl });
    } catch (e) {
      console.error('Upload error:', e);
      return res.status(500).json({ error: 'Upload to S3 failed' });
    }
  });
}
