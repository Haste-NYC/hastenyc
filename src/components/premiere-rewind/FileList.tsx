import { CheckCircle2, XCircle, Loader2, FileVideo, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversionProgress, ConversionResult, formatFileSize } from '@/lib/premiere-rewind/prprojConverter';

interface FileItemProps {
  file: File;
  progress?: ConversionProgress;
  result?: ConversionResult;
  onDownload?: () => void;
}

function FileItem({ file, progress, result, onDownload }: FileItemProps) {
  const getStatusIcon = () => {
    if (result?.success) {
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    }
    if (result?.success === false) {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }
    if (progress && progress.stage !== 'complete' && progress.stage !== 'error') {
      return <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />;
    }
    return <FileVideo className="w-5 h-5 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (result?.success) {
      return `Ready • ${formatFileSize(result.newSize)}`;
    }
    if (result?.error) {
      return result.error;
    }
    if (progress) {
      switch (progress.stage) {
        case 'decompressing':
          return 'Decompressing...';
        case 'modifying':
          return 'Modifying header...';
        case 'compressing':
          return 'Compressing...';
        case 'complete':
          return 'Complete';
        case 'error':
          return 'Error';
        default:
          return 'Processing...';
      }
    }
    return `Waiting • ${formatFileSize(file.size)}`;
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg',
        'bg-card/50 border border-border',
        'transition-all duration-200',
        result?.success && 'border-success/30 bg-success/5',
        result?.success === false && 'border-destructive/30 bg-destructive/5'
      )}
    >
      <div className="flex-shrink-0">{getStatusIcon()}</div>

      <div className="flex-grow min-w-0">
        <p className="font-medium text-foreground truncate">{file.name}</p>
        <p
          className={cn(
            'text-sm',
            result?.error ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {getStatusText()}
        </p>
      </div>

      {progress && progress.stage !== 'complete' && progress.stage !== 'error' && (
        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      )}

      {result?.success && onDownload && (
        <button
          onClick={onDownload}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-amber-500/90 hover:bg-amber-500',
            'text-black text-sm font-medium',
            'transition-all'
          )}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      )}
    </div>
  );
}

interface FileListProps {
  files: File[];
  progressMap: Map<string, ConversionProgress>;
  resultMap: Map<string, { result: ConversionResult; blob: Blob }>;
  onDownload: (fileName: string) => void;
}

export function FileList({ files, progressMap, resultMap, onDownload }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Files ({files.length})
      </h3>
      {files.map((file) => (
        <FileItem
          key={file.name + file.lastModified}
          file={file}
          progress={progressMap.get(file.name)}
          result={resultMap.get(file.name)?.result}
          onDownload={
            resultMap.get(file.name)?.result.success
              ? () => onDownload(file.name)
              : undefined
          }
        />
      ))}
    </div>
  );
}
