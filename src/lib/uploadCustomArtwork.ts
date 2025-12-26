import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads inspiration images from blob URLs to Supabase Storage
 * and returns the public URLs for database storage
 */
export async function uploadInspirationImages(
  blobUrls: string[],
  orderId: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];
  
  for (let i = 0; i < blobUrls.length; i++) {
    const blobUrl = blobUrls[i];
    
    // Skip if already a Supabase URL (previously uploaded)
    if (!blobUrl.startsWith('blob:')) {
      uploadedUrls.push(blobUrl);
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
        console.error('Failed to upload image:', error);
        continue;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('custom-artwork')
        .getPublicUrl(data.path);
      
      uploadedUrls.push(urlData.publicUrl);
    } catch (err) {
      console.error('Error processing image upload:', err);
    }
  }
  
  return uploadedUrls;
}
