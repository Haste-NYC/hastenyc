// NOTE: This module uploads user files to cloud storage.
// Only call with explicit user consent.
import { supabase } from '@/integrations/supabase/client';

// Shared private bucket for all customer project-file uploads (desktop app
// + website). Bucket-level public=false; RLS policies on storage.objects
// gate by `(storage.foldername(name))[1] = auth.uid()::text`, so the path
// must start with the user's id.
const STORAGE_BUCKET = 'project-files-private';

interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Uploads the original .prproj file to the shared private project-files
 * bucket. Files are stored under the user's ID for proper RLS access.
 */
export async function uploadOriginalFile(
  file: File,
  userId: string,
  premiereVersion?: string
): Promise<UploadResult> {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${userId}/${timestamp}_${sanitizedName}`;

    // Upload to storage bucket
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[storageUpload] Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Record metadata in database
    const { error: dbError } = await supabase
      .from('prproj_uploads')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_size: file.size,
        storage_path: storagePath,
        premiere_version: premiereVersion,
      });

    if (dbError) {
      console.error('[storageUpload] DB error:', dbError);
      // File was uploaded but metadata failed - still count as success
      // but log the issue
      return { 
        success: true, 
        path: storagePath,
        error: `File uploaded but metadata failed: ${dbError.message}` 
      };
    }

    console.log('[storageUpload] Successfully uploaded:', storagePath);
    return { success: true, path: storagePath };

  } catch (error) {
    console.error('[storageUpload] Unexpected error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Extracts the Premiere Pro version from decompressed XML content
 */
export function extractPremiereVersion(xmlContent: string): string | undefined {
  const match = xmlContent.match(/<Project[^>]*\sVersion="(\d+)"/);
  return match ? match[1] : undefined;
}
