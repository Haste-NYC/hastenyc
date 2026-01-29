import pako from 'pako';

/**
 * Encode string to UTF-16 Little Endian with BOM
 */
function encodeUtf16LE(str: string): Uint8Array {
  // 2 bytes BOM + 2 bytes per character
  const buffer = new ArrayBuffer(2 + str.length * 2);
  const view = new DataView(buffer);
  
  // UTF-16 LE BOM
  view.setUint8(0, 0xFF);
  view.setUint8(1, 0xFE);
  
  for (let i = 0; i < str.length; i++) {
    view.setUint16(2 + i * 2, str.charCodeAt(i), true); // true = little endian
  }
  
  return new Uint8Array(buffer);
}

/**
 * Encode string to UTF-16 Big Endian with BOM
 */
function encodeUtf16BE(str: string): Uint8Array {
  // 2 bytes BOM + 2 bytes per character
  const buffer = new ArrayBuffer(2 + str.length * 2);
  const view = new DataView(buffer);
  
  // UTF-16 BE BOM
  view.setUint8(0, 0xFE);
  view.setUint8(1, 0xFF);
  
  for (let i = 0; i < str.length; i++) {
    view.setUint16(2 + i * 2, str.charCodeAt(i), false); // false = big endian
  }
  
  return new Uint8Array(buffer);
}

export interface ConversionResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  newSize: number;
  error?: string;
}

export interface ConversionProgress {
  fileName: string;
  stage: 'decompressing' | 'modifying' | 'compressing' | 'complete' | 'error';
  progress: number;
}

/**
 * Converts a .prproj file by:
 * 1. Decompressing the gzip data
 * 2. Modifying the Project Version attribute to "1"
 * 3. Recompressing to gzip
 * 4. Returning the modified file as a Blob
 */
export async function convertPrprojFile(
  file: File,
  onProgress?: (progress: ConversionProgress) => void
): Promise<{ blob: Blob; result: ConversionResult; premiereVersion?: string }> {
  const fileName = file.name;
  const originalSize = file.size;

  try {
    // Stage 1: Read and decompress
    onProgress?.({ fileName, stage: 'decompressing', progress: 10 });
    
    const arrayBuffer = await file.arrayBuffer();
    const compressedData = new Uint8Array(arrayBuffer);
    
    onProgress?.({ fileName, stage: 'decompressing', progress: 30 });
    
    // Validate gzip header before decompression
    const isValidGzip = compressedData[0] === 0x1f && compressedData[1] === 0x8b;
    if (!isValidGzip) {
      throw new Error('Invalid file format. This does not appear to be a valid .prproj file.');
    }

    let decompressedData: Uint8Array;
    try {
      decompressedData = pako.inflate(compressedData);
    } catch (e) {
      throw new Error('Failed to decompress file. Make sure this is a valid .prproj file.');
    }

    onProgress?.({ fileName, stage: 'modifying', progress: 50 });

    // Stage 2: Convert to string and modify XML
    // Premiere Pro files can be UTF-8 or UTF-16 encoded
    let xmlContent: string;
    let originalEncoding: 'utf-8' | 'utf-16le' | 'utf-16be' = 'utf-8';
    
    // Check for BOM to determine encoding
    // UTF-16 LE BOM: 0xFF 0xFE
    // UTF-16 BE BOM: 0xFE 0xFF
    // UTF-8 BOM: 0xEF 0xBB 0xBF
    if (decompressedData[0] === 0xFF && decompressedData[1] === 0xFE) {
      // UTF-16 Little Endian
      originalEncoding = 'utf-16le';
      console.log('[prprojConverter] Detected UTF-16 LE encoding');
      const decoder = new TextDecoder('utf-16le');
      xmlContent = decoder.decode(decompressedData);
    } else if (decompressedData[0] === 0xFE && decompressedData[1] === 0xFF) {
      // UTF-16 Big Endian
      originalEncoding = 'utf-16be';
      console.log('[prprojConverter] Detected UTF-16 BE encoding');
      const decoder = new TextDecoder('utf-16be');
      xmlContent = decoder.decode(decompressedData);
    } else {
      // UTF-8 (with or without BOM)
      originalEncoding = 'utf-8';
      console.log('[prprojConverter] Using UTF-8 encoding');
      const decoder = new TextDecoder('utf-8');
      xmlContent = decoder.decode(decompressedData);
    }
    
    console.log('[prprojConverter] XML length:', xmlContent.length);
    console.log('[prprojConverter] First 500 chars:', xmlContent.substring(0, 500));

    // Find and replace the Project Version attribute
    // Pattern matches: <Project ... Version="XX" ...>
    const projectVersionRegex = /(<Project[^>]*\sVersion=")(\d+)(")/g;
    
    const projectMatch = xmlContent.match(projectVersionRegex);
    console.log('[prprojConverter] Project Version matches found:', projectMatch);
    
    if (!projectMatch) {
      // Log first 2000 chars of XML to debug
      console.log('[prprojConverter] XML start (first 2000 chars):', xmlContent.substring(0, 2000));
      throw new Error('Could not find Project Version in the file. This may not be a valid Premiere Pro project file.');
    }
    
    // Extract the original version before replacing
    let originalPremiereVersion: string | undefined;
    
    // Replace ALL Project Version attributes with "1" using a function to avoid ambiguity
    const originalXml = xmlContent;
    let replacementCount = 0;
    xmlContent = xmlContent.replace(projectVersionRegex, (match, prefix, version, suffix) => {
      console.log('[prprojConverter] Replacing Project Version:', version, '-> 1');
      console.log('[prprojConverter] Full match:', match);
      if (!originalPremiereVersion) {
        originalPremiereVersion = version;
      }
      replacementCount++;
      return prefix + '1' + suffix;
    });
    
    console.log('[prprojConverter] Total replacements made:', replacementCount);
    console.log('[prprojConverter] XML changed:', originalXml !== xmlContent);
    
    // Verify the replacement worked
    if (originalXml === xmlContent) {
      console.error('[prprojConverter] WARNING: XML content was not modified!');
    }

    // Also modify the PremiereData Version if present
    const premiereDataRegex = /(<PremiereData[^>]*\sVersion=")(\d+)(")/g;
    xmlContent = xmlContent.replace(premiereDataRegex, (match, prefix, version, suffix) => {
      console.log('[prprojConverter] Replacing PremiereData Version:', version, '-> 1');
      return prefix + '1' + suffix;
    });

    onProgress?.({ fileName, stage: 'compressing', progress: 70 });

    // Stage 3: Re-encode with original encoding and compress
    let modifiedData: Uint8Array;
    
    if (originalEncoding === 'utf-16le') {
      // Re-encode as UTF-16 LE with BOM
      modifiedData = encodeUtf16LE(xmlContent);
      console.log('[prprojConverter] Re-encoding as UTF-16 LE');
    } else if (originalEncoding === 'utf-16be') {
      // Re-encode as UTF-16 BE with BOM
      modifiedData = encodeUtf16BE(xmlContent);
      console.log('[prprojConverter] Re-encoding as UTF-16 BE');
    } else {
      // UTF-8
      const encoder = new TextEncoder();
      modifiedData = encoder.encode(xmlContent);
      console.log('[prprojConverter] Re-encoding as UTF-8');
    }
    
    onProgress?.({ fileName, stage: 'compressing', progress: 85 });
    
    const recompressedData = pako.gzip(modifiedData);

    // Create blob for download
    const convertedBlob = new Blob([recompressedData], { type: 'application/octet-stream' });

    onProgress?.({ fileName, stage: 'complete', progress: 100 });

    return {
      blob: convertedBlob,
      result: {
        success: true,
        fileName: fileName.replace('.prproj', '_downgraded.prproj'),
        originalSize,
        newSize: convertedBlob.size,
      },
      premiereVersion: originalPremiereVersion,
    };
  } catch (error) {
    onProgress?.({ fileName, stage: 'error', progress: 0 });
    
    return {
      blob: new Blob(),
      result: {
        success: false,
        fileName,
        originalSize,
        newSize: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
    };
  }
}

/**
 * Triggers a download for the given blob
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format bytes to human readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
