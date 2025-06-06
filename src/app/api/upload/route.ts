import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    // === Ajoutez cette ligne pour le débogage ===
    console.log('AWS_REGION depuis process.env :', process.env.AWS_REGION);
    console.log('S3_BUCKET_NAME depuis process.env :', process.env.S3_BUCKET_NAME);
    console.log('AWS_ACCESS_KEY_ID (partiel) depuis process.env :', process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + '...');
    // ===========================================

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    const AWS_REGION = process.env.AWS_REGION!;
    const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // ... le reste de votre code pour l'upload S3

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
