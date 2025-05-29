'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : '');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

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
    } catch {
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
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Chargement...' : 'Uploader'}
      </button>

      {previewUrl && file?.type.startsWith('image/') && (
        <img src={previewUrl} alt="preview" className="mt-4 rounded shadow" />
      )}

      {previewUrl && file?.type.startsWith('audio/') && (
        <audio controls src={previewUrl} className="mt-4 w-full" />
      )}

      {uploadedUrl && (
        <p className="mt-4 text-green-600">
          Fichier envoyé ! <a href={uploadedUrl} className="underline text-blue-600" target="_blank">Voir</a>
        </p>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
