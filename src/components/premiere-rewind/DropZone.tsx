import { useCallback, useRef, useState } from 'react';
import { Upload, FileVideo, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  onOversizedFiles?: (files: File[]) => void;
  isProcessing: boolean;
}

export function DropZone({ onFilesSelected, onOversizedFiles, isProcessing }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterAndValidateFiles = useCallback((fileList: File[]) => {
    const prprojFiles = fileList.filter((file) => file.name.endsWith('.prproj'));
    const validFiles = prprojFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    const oversizedFiles = prprojFiles.filter((file) => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
      onOversizedFiles?.(oversizedFiles);
    }
    
    return validFiles;
  }, [onOversizedFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (isProcessing) return;

      const validFiles = filterAndValidateFiles(Array.from(e.dataTransfer.files));

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [onFilesSelected, isProcessing, filterAndValidateFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const validFiles = filterAndValidateFiles(Array.from(e.target.files));
        if (validFiles.length > 0) {
          onFilesSelected(validFiles);
        }
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [onFilesSelected, filterAndValidateFiles]
  );

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-2xl mx-auto',
        'gradient-border cursor-pointer',
        'transition-all duration-300 ease-out',
        isDragActive && 'drop-zone-active scale-[1.02]',
        isProcessing && 'opacity-50 cursor-not-allowed'
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'py-16 px-8 rounded-lg',
          'bg-card/50 backdrop-blur-sm',
          'transition-all duration-300'
        )}
      >
        <div
          className={cn(
            'w-20 h-20 rounded-full',
            'flex items-center justify-center',
            'bg-gradient-to-br from-primary/20 to-accent/20',
            'mb-6 transition-transform duration-300',
            isDragActive && 'scale-110 animate-pulse-glow'
          )}
        >
          {isDragActive ? (
            <FileVideo className="w-10 h-10 text-primary" />
          ) : (
            <Upload className="w-10 h-10 text-primary" />
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {isDragActive ? 'Drop your files here' : 'Drag & Drop .prproj files'}
        </h3>

        <p className="text-muted-foreground text-sm mb-6 text-center max-w-md">
          Drop your Premiere Pro project files here, or click to browse.
          <br />
          Supports multiple files at once.
        </p>

        <button
          type="button"
          disabled={isProcessing}
          className={cn(
            'flex items-center gap-2 px-6 py-3',
            'rounded-lg font-medium text-sm',
            'bg-gradient-to-r from-primary to-accent',
            'text-primary-foreground',
            'hover:opacity-90 transition-opacity',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'glow'
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <FolderOpen className="w-4 h-4" />
          Browse Files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".prproj"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
}
