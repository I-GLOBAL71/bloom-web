import React, { useState } from 'react';
import { X, Upload, Trash2, AlertCircle } from 'lucide-react';
import { uploadFile } from '../../lib/firebase/storage';

interface PhotoUploadProps {
  currentPhotos: string[];
  onClose: () => void;
  onSave: (photos: string[]) => Promise<void>;
}

export function PhotoUpload({ currentPhotos, onClose, onSave }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(currentPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setUploading(true);
      setError(undefined);

      const newPhotos = await Promise.all(
        Array.from(files).map(async (file) => {
          const path = `users/photos/${Date.now()}_${file.name}`;
          return await uploadFile(file, path);
        })
      );

      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (err) {
      setError('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (photos.length === 0) {
      setError('At least one photo is required');
      return;
    }

    try {
      setUploading(true);
      await onSave(photos);
    } catch (err) {
      setError('Failed to save photos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Photos</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-4">
            {photos.map((url, index) => (
              <div key={url} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => setPhotos(prev => prev.filter(p => p !== url))}
                  className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {photos.length < 6 && (
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}