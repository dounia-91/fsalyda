'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setUploadedUrl('');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadedUrl(data.url);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Tester l’upload vers S3</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Chargement...' : 'Uploader'}
      </button>

      {previewUrl && (
        <div className="mt-4">
          <p className="font-semibold">Aperçu du fichier :</p>
          {file?.type.startsWith('image/') && (
            <img src={previewUrl} alt="Aperçu" className="mt-2 max-w-full h-auto rounded shadow" />
          )}
          {file?.type.startsWith('audio/') && (
            <audio controls src={previewUrl} className="mt-2 w-full" />
          )}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-green-600">✅ Fichier envoyé avec succès :</p>
          <a href={uploadedUrl} target="_blank" className="underline text-blue-700">
            Voir le fichier
          </a>
        </div>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
