import { supabase } from '@/integrations/supabase/client';

const STORAGE_BUCKET = 'project-files-private';

interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

export async function uploadOriginalFile(
  file: File,
  email: string,
  premiereVersion?: string
): Promise<UploadResult> {
  try {
    const signRes = await fetch('/api/premiere-rewind/sign-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fileName: file.name,
        fileSize: file.size,
        premiereVersion,
      }),
    });

    if (!signRes.ok) {
      const text = await signRes.text().catch(() => '');
      console.error('[storageUpload] sign-upload failed:', signRes.status, text);
      return { success: false, error: `sign failed (${signRes.status})` };
    }

    const { path, token } = await signRes.json();

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .uploadToSignedUrl(path, token, file, { upsert: false });

    if (uploadError) {
      console.error('[storageUpload] upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    console.log('[storageUpload] uploaded:', path);
    return { success: true, path };
  } catch (err) {
    console.error('[storageUpload] unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export function extractPremiereVersion(xmlContent: string): string | undefined {
  const match = xmlContent.match(/<Project[^>]*\sVersion="(\d+)"/);
  return match ? match[1] : undefined;
}
