import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { DropZone } from '@/components/premiere-rewind/DropZone';
import { FileList } from '@/components/premiere-rewind/FileList';
import { EmailGateDialog } from '@/components/premiere-rewind/EmailGateDialog';
import {
  convertPrprojFile,
  downloadBlob,
  formatFileSize,
  ConversionProgress,
  ConversionResult,
} from '@/lib/premiere-rewind/prprojConverter';
import { uploadOriginalFile } from '@/lib/premiere-rewind/storageUpload';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PremiereRewind = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMap, setProgressMap] = useState<Map<string, ConversionProgress>>(
    new Map()
  );
  const [resultMap, setResultMap] = useState<
    Map<string, { result: ConversionResult; blob: Blob }>
  >(new Map());

  // Email gate state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<string | null>(null);
  const [pendingDownloadAll, setPendingDownloadAll] = useState(false);

  const hasProvidedEmail = () => {
    return !!localStorage.getItem('prproj_email');
  };

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    // Add new files to the list
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const newFiles = selectedFiles.filter((f) => !existingNames.has(f.name));
      return [...prev, ...newFiles];
    });

    setIsProcessing(true);

    // Process each file
    for (const file of selectedFiles) {
      const updateProgress = (progress: ConversionProgress) => {
        setProgressMap((prev) => new Map(prev).set(file.name, progress));
      };

      // Convert the file (also extracts version for upload metadata)
      const { blob, result, premiereVersion } = await convertPrprojFile(file, updateProgress);

      setResultMap((prev) => new Map(prev).set(file.name, { result, blob }));

      // Upload original file to storage (in background, anonymous)
      if (result.success) {
        uploadOriginalFile(file, 'anonymous', premiereVersion)
          .then((uploadResult) => {
            if (uploadResult.success) {
              console.log('[PremiereRewind] Original file uploaded:', uploadResult.path);
            } else {
              console.error('[PremiereRewind] Upload failed:', uploadResult.error);
            }
          })
          .catch((err) => {
            console.error('[PremiereRewind] Upload error:', err);
          });
      }

      // Show success message
      if (result.success) {
        if (hasProvidedEmail()) {
          downloadBlob(blob, result.fileName);
          toast.success(`Downgraded: ${result.fileName}`, {
            description: `Original: ${formatFileSize(result.originalSize)} → New: ${formatFileSize(result.newSize)}`,
          });
        } else {
          toast.success(`Ready: ${result.fileName}`, {
            description: 'Click download to get your file.',
          });
        }
      } else {
        toast.error(`Failed: ${file.name}`, {
          description: result.error,
        });
      }
    }

    setIsProcessing(false);
  }, []);

  const handleOversizedFiles = useCallback((oversizedFiles: File[]) => {
    const fileNames = oversizedFiles.map(f => f.name).join(', ');
    const sizes = oversizedFiles.map(f => formatFileSize(f.size)).join(', ');
    toast.error(`File(s) too large: ${fileNames}`, {
      description: `Maximum file size is 100MB. Files are ${sizes}.`,
    });
  }, []);

  const executeDownload = useCallback((fileName: string) => {
    const data = resultMap.get(fileName);
    if (data && data.result.success) {
      downloadBlob(data.blob, data.result.fileName);
    }
  }, [resultMap]);

  const executeDownloadAll = useCallback(() => {
    resultMap.forEach((data) => {
      if (data.result.success) {
        downloadBlob(data.blob, data.result.fileName);
      }
    });
  }, [resultMap]);

  const handleDownload = useCallback(
    (fileName: string) => {
      if (hasProvidedEmail()) {
        executeDownload(fileName);
      } else {
        setPendingDownload(fileName);
        setPendingDownloadAll(false);
        setEmailDialogOpen(true);
      }
    },
    [executeDownload]
  );

  const handleDownloadAll = useCallback(() => {
    if (hasProvidedEmail()) {
      executeDownloadAll();
    } else {
      setPendingDownload(null);
      setPendingDownloadAll(true);
      setEmailDialogOpen(true);
    }
  }, [executeDownloadAll]);

  const handleEmailSubmitted = useCallback(() => {
    if (pendingDownloadAll) {
      executeDownloadAll();
    } else if (pendingDownload) {
      executeDownload(pendingDownload);
    }
    setPendingDownload(null);
    setPendingDownloadAll(false);
  }, [pendingDownload, pendingDownloadAll, executeDownload, executeDownloadAll]);

  const successCount = Array.from(resultMap.values()).filter(
    (d) => d.result.success
  ).length;

  const pendingFileName = pendingDownload
    ? resultMap.get(pendingDownload)?.result.fileName || pendingDownload
    : 'your files';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Premiere Rewind - Version Rollback for .prproj Files"
        description="Open newer Premiere Pro projects in older versions. Drag and drop your .prproj files for instant version rollback. Free, fast, and secure."
        canonical="/premiere-rewind"
      />
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 py-12">
        <div className="text-center mb-12 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Premiere Pro Project Tool
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-2 font-bold">
            <span className="gradient-text">Premiere Rewind</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground mb-6">
            version rollback for .prproj files
          </p>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Open newer Premiere Pro projects in older versions.
            Simply drag and drop your .prproj files and we'll handle the rest.
          </p>
        </div>

        <DropZone
          onFilesSelected={handleFilesSelected}
          onOversizedFiles={handleOversizedFiles}
          isProcessing={isProcessing}
        />

        <FileList
          files={files}
          progressMap={progressMap}
          resultMap={resultMap}
          onDownload={handleDownload}
        />

        {successCount > 1 && (
          <button
            onClick={handleDownloadAll}
            className={cn(
              'mt-6 flex items-center gap-2 px-6 py-3',
              'rounded-lg font-medium',
              'bg-secondary text-secondary-foreground',
              'hover:bg-secondary/80 transition-colors'
            )}
          >
            <Download className="w-4 h-4" />
            Download All ({successCount})
          </button>
        )}

        <div className="mt-16 text-center max-w-xl">
          <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 rounded-lg bg-card/30">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 font-semibold">
                1
              </div>
              <p className="text-muted-foreground">
                Analyzes your project
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card/30">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 font-semibold">
                2
              </div>
              <p className="text-muted-foreground">
                Makes it compatible with older versions
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card/30">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 font-semibold">
                3
              </div>
              <p className="text-muted-foreground">
                Downloads the converted file
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <EmailGateDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onEmailSubmitted={handleEmailSubmitted}
        fileName={pendingFileName}
      />
    </div>
  );
};

export default PremiereRewind;
