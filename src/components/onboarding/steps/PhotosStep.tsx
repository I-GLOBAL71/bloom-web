import React, { useState } from 'react';
import { Camera, Upload, X, Video, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../contexts/LanguageContext';
import { StepCard } from '../StepCard';
import { uploadFile } from '../../../lib/firebase/storage';

interface PhotosStepProps {
  onComplete: () => Promise<void>;
  initialPhotos: string[];
  initialVideo: File | null;
  onBack?: () => void;
}

export function PhotosStep({ onComplete, initialPhotos, initialVideo, onBack }: PhotosStepProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [photos, setPhotos] = useState<Array<{ file: File; preview: string }>>([]);
  const [video, setVideo] = useState<{ file: File; preview: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for photos

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > 6) {
      setError(t('errors.maxPhotos', 'Maximum 6 photos allowed'));
      return;
    }

    const newPhotos = Array.from(files).filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(t('errors.fileSize', { name: file.name, size: '5MB' }));
        return false;
      }
      return true;
    });

    if (newPhotos.length === 0) return;

    setError('');

    const photoPromises = newPhotos.map(file => {
      return new Promise<{ file: File; preview: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ file, preview: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    });

    const processedPhotos = await Promise.all(photoPromises);
    setPhotos(prev => [...prev, ...processedPhotos]);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError(t('errors.videoSize', 'Video must be less than 50MB'));
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideo({
        file,
        preview: reader.result as string
      });
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      // Marquer l'étape comme terminée sans téléverser les photos pour le moment
      console.log('Finalisation de l\'onboarding sans téléversement des photos');
      setError('');
      await onComplete();
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError(t('errors.unknownError'));
    }
  };

  const isRTL = ['ar', 'ur'].includes(currentLanguage);

  return (
    <StepCard
      icon={Camera}
      title={t('onboarding.steps.photos.title', 'Add your photos')}
      subtitle={t('onboarding.steps.photos.subtitle', 'Show your best side (Optional, Max: 6 photos)')}
      onBack={onBack}
    >
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-3">
          {photos.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url.preview}
                alt={t('onboarding.photoAlt', { number: index + 1 })}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {photos.length < 6 && (
            <label className="aspect-square border-2 border-dashed border-amber-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-300 transition-colors">
              <Camera className="w-6 h-6 text-amber-500 mb-2" />
              <span className="text-sm text-amber-600">{t('onboarding.addPhoto')}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Video upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {t('onboarding.addVideo')}
          </p>
          
          {video ? (
            <div className="relative rounded-lg overflow-hidden">
              <video
                src={video.preview}
                className="w-full h-48 object-cover"
                controls
              />
              <button
                onClick={() => setVideo(null)}
                className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="block w-full border-2 border-dashed border-amber-200 rounded-lg p-6 cursor-pointer hover:border-amber-300 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Video className="w-8 h-8 text-amber-500" />
                <span className="text-sm text-amber-600">{t('onboarding.clickToUploadVideo')}</span>
              </div>
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-rose-500 bg-rose-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {uploading && (
          <div className="text-sm text-amber-600 text-center">
            {t('common.uploading')}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-xl font-medium hover:from-amber-500 hover:to-rose-500 transition-colors disabled:opacity-50"
        >
          {t('onboarding.finish')}
        </button>
      </div>
    </StepCard>
  );
}
