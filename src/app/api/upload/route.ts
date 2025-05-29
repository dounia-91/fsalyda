import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    // Ici tu ferais l'upload vers S3 par ex.
    // Exemple factice :
    const fakeUploadedUrl = 'https://exemple.com/mon-fichier.jpg';

    // Renvoie URL uploadée
    return NextResponse.json({ url: fakeUploadedUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
