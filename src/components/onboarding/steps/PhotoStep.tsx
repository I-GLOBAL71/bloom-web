import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, Video } from 'lucide-react';
import { VideoRecorder } from './VideoRecorder';

interface ExtendedOnboardingStepProps {
  onNext: (value: any) => void;
  onBack: () => void;
  data?: any;
  isFirstStep?: boolean;
}

interface Media {
  type: 'photo' | 'video';
  url: string;
  file?: Blob;
}

export function PhotoStep({ onNext, onBack, data = [], isFirstStep }: ExtendedOnboardingStepProps) {
  const [mediaFiles, setMediaFiles] = useState<Media[]>(data);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const maxFiles = 6;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    for (const file of validFiles) {
      if (mediaFiles.length >= maxFiles) break;
      
      try {
        const base64 = await readFileAsBase64(file);
        setMediaFiles(prev => [...prev, { type: 'photo', url: base64 }]);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoRecorded = async (videoBlob: Blob) => {
    const videoUrl = URL.createObjectURL(videoBlob);
    setMediaFiles(prev => [...prev, { type: 'video', url: videoUrl, file: videoBlob }]);
    setShowVideoRecorder(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaFiles.length > 0) {
      onNext(mediaFiles);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ajoutez vos plus belles photos</h2>
        <p className="text-gray-600">
          Choisissez jusqu'à {maxFiles} photos ou une courte vidéo de présentation
        </p>
      </div>

      {showVideoRecorder ? (
        <div className="space-y-4">
          <VideoRecorder onVideoRecorded={handleVideoRecorded} />
          <motion.button
            type="button"
            onClick={() => setShowVideoRecorder(false)}
            className="w-full px-4 py-2 border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Annuler
          </motion.button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {mediaFiles.map((media, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  {media.type === 'photo' ? (
                    <img
                      src={media.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover rounded-xl"
                      controls
                    />
                  )}
                  <motion.button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    onClick={() => removeMedia(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}

              {mediaFiles.length < maxFiles && !showVideoRecorder && (
                <>
                  <motion.label
                    className="aspect-square border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ImagePlus className="w-8 h-8 text-pink-400" />
                    <span className="text-sm text-gray-600">Ajouter une photo</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                  </motion.label>

                  {mediaFiles.length === 0 && (
                    <motion.button
                      type="button"
                      onClick={() => setShowVideoRecorder(true)}
                      className="aspect-square border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Video className="w-8 h-8 text-pink-400" />
                      <span className="text-sm text-gray-600">Enregistrer une vidéo</span>
                    </motion.button>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="text-sm text-gray-500 text-center">
            <p>Photos : JPG, PNG (max 5 MB)</p>
            <p>Vidéo : 30 secondes maximum</p>
          </div>

          <motion.button
            type="submit"
            className="w-full px-8 py-4 bg-pink-500 text-white rounded-full text-lg hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={mediaFiles.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Terminer
          </motion.button>

          {!isFirstStep && (
            <motion.button
              type="button"
              onClick={onBack}
              className="w-full px-8 py-4 border-2 border-pink-500 text-pink-500 rounded-full text-lg hover:bg-pink-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Retour
            </motion.button>
          )}
        </>
      )}
    </form>
  );
}