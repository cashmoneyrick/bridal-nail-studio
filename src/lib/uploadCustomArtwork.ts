import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/lib/logger";

/**
 * Uploads inspiration images from blob URLs to Supabase Storage
 * and returns the storage paths for database storage (not public URLs)
 * The bucket is now private - signed URLs must be generated when viewing
 */
export async function uploadInspirationImages(
  blobUrls: string[],
  orderId: string
): Promise<string[]> {
  const uploadedPaths: string[] = [];
  
  for (let i = 0; i < blobUrls.length; i++) {
    const blobUrl = blobUrls[i];
    
    // Skip if already a storage path (previously uploaded)
    if (!blobUrl.startsWith('blob:')) {
      uploadedPaths.push(blobUrl);
      continue;
    }
    
    try {
      // Fetch blob data from the object URL
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      // Generate unique filename with order ID folder
      const extension = blob.type.split('/')[1] || 'jpg';
      const filename = `${orderId}/${Date.now()}-${i}.${extension}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('custom-artwork')
        .upload(filename, blob, {
          contentType: blob.type,
          upsert: false,
        });
      
      if (error) {
        logError('Failed to upload image:', error);
        continue;
      }
      
      // Store the path, not a public URL (bucket is now private)
      // Signed URLs will be generated on-demand when viewing
      uploadedPaths.push(data.path);
    } catch (err) {
      logError('Error processing image upload:', err);
    }
  }
  
  return uploadedPaths;
}

/**
 * Generate a signed URL for viewing a stored image
 * @param path The storage path of the image
 * @param expiresIn Expiration time in seconds (default 1 hour)
 */
export async function getSignedImageUrl(
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('custom-artwork')
    .createSignedUrl(path, expiresIn);
  
  if (error) {
    logError('Failed to create signed URL:', error);
    return null;
  }
  
  return data.signedUrl;
}
