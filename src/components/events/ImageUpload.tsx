import React, { useState } from 'react';
import { Upload, Trash2, AlertCircle } from 'lucide-react';
import { uploadFile } from '../../lib/firebase/storage';

interface ImageUploadProps {
  onChange: (imageUrl: string | undefined) => void;
  currentImage?: string;
}

export function ImageUpload({ onChange, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(undefined);

      const path = `events/covers/${Date.now()}_${file.name}`;
      const imageUrl = await uploadFile(file, path);
      onChange(imageUrl);
    } catch (err) {
      setError('Échec du téléchargement de l\'image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {currentImage ? (
        <div className="relative aspect-video w-full">
          <img
            src={currentImage}
            alt="Image de couverture"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="block aspect-video w-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500">
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            {uploading ? 'Téléchargement...' : 'Ajouter une image de couverture'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}