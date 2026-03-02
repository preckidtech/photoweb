    /**
 * Senior Engineering: This utility handles the "Download All" logic (FR-101).
 * It uses a sequential "Trigger & Delay" pattern to bypass browser 
 * security blocks on bulk downloads.
 */

interface PhotoAsset {
  signedUrl: string;
  original_filename: string;
}

export async function downloadAllAssets(
  photos: PhotoAsset[], 
  onProgress: (count: number) => void
) {
  if (!photos || photos.length === 0) return;

  // We process files in a loop rather than all at once to maintain 
  // browser memory stability (NFR-202).
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];

    try {
      // 1. Fetch the file as a Blob to ensure the "Download" attribute works
      const response = await fetch(photo.signedUrl);
      const blob = await response.blob();
      
      // 2. Create a temporary 'Internal URL' for the Blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 3. Programmatically create an anchor element to trigger save
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = photo.original_filename || `photo_${i + 1}.jpg`;
      
      // 4. Append to document, trigger, and immediately cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 5. Revoke the Blob URL to prevent memory leaks
      window.URL.revokeObjectURL(blobUrl);

      // 6. Update the UI progress state
      onProgress(i + 1);

      // 7. Critical: Add a small delay (400ms) to prevent the browser 
      // from flagging this as a 'Multiple Download' security threat.
      await new Promise((resolve) => setTimeout(resolve, 400));
      
    } catch (error) {
      console.error(`Engineering Error: Failed to download asset ${i + 1}`, error);
    }
  }
}