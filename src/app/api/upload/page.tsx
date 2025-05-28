'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUrl(null);
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
        setUrl(data.url);
      } else {
        alert(`Erreur : ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur d’upload', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4">Téléverser un fichier</h1>

      <input
        type="file"
        accept="image/*,audio/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && file?.type.startsWith('image') && (
        <img src={preview} alt="Preview" className="mb-4 rounded" />
      )}

      {preview && file?.type.startsWith('audio') && (
        <audio controls className="mb-4 w-full">
          <source src={preview} />
          Votre navigateur ne supporte pas l’audio.
        </audio>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Téléversement...' : 'Téléverser'}
      </button>

      {url && (
        <div className="mt-4">
          <p className="text-green-600">Fichier envoyé avec succès !</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Voir le fichier
          </a>
        </div>
      )}
    </div>
  );
}
