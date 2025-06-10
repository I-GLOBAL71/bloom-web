import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileUpload({ onFileSelect, accept = '*/*', maxSize = 10 }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string>('');

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }
      setError('');
      onFileSelect(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-pink-50 transition-colors relative"
        title="Attach file"
      >
        <Paperclip className="w-5 h-5 text-pink-500" />
      </button>
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-50 text-red-600 text-sm rounded-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}