import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // Nouvelle version du SDK
// Si vous utilisez l'ancienne version, ce serait : const AWS = require('aws-sdk');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file'); // 'file' doit correspondre au nom de votre champ dans le FormData du frontend

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    // Récupérer les variables d'environnement
    const AWS_REGION = process.env.AWS_REGION!; // ! assure TypeScript que la variable existe
    const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

    // Initialiser le client S3
    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: { // Les clés sont automatiquement prises des variables d'env si elles sont définies
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Convertir le Blob en Buffer si nécessaire (pour stream ou read)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // Nécessite 'buffer' (install 'npm i buffer' si node < 16) ou Node.js >= 16

    // Générer un nom de fichier unique pour éviter les conflits
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`; // Ex: 16788888888-mon_image.png
    const fileType = file.type || 'application/octet-stream'; // Obtenez le type MIME du fichier

    // Paramètres pour l'upload S3
    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName, // Nom du fichier sur S3
      Body: buffer, // Le contenu binaire du fichier
      ContentType: fileType, // Type MIME du fichier (ex: 'image/png', 'audio/mpeg')
      ACL: 'public-read', // Rendre le fichier lisible publiquement (pour la visualisation directe, à revoir pour la sécurité en prod)
    };

    // Exécuter la commande d'upload
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construire l'URL du fichier uploadé
    const uploadedUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;

    console.log('Fichier téléversé avec succès sur S3 ! URL :', uploadedUrl); // Log pour débogage

    // Renvoie l'URL réelle du fichier uploadé
    return NextResponse.json({ url: uploadedUrl }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors du téléversement sur S3 ou serveur :', error);
    // Retourne un message d'erreur plus détaillé en mode développement si besoin
    return NextResponse.json({ error: `Erreur serveur lors de l'upload: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
  }
}
