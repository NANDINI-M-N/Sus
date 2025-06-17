/**
 * Utility for saving transcript content locally
 */

/**
 * Saves text content to a local file
 * 
 * @param text The text content to save
 * @param filename Optional filename (defaults to transcript_[timestamp].txt)
 * @returns Promise that resolves when the file is saved
 */
export function saveTranscriptToFile(
  text: string,
  filename = `transcript_${Date.now()}.txt`
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!text.trim()) {
        console.error('Cannot save empty content');
        resolve(false);
        return;
      }

      // Create a blob from the text
      const blob = new Blob([text], { type: 'text/plain' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve(true);
      }, 100);
    } catch (error) {
      console.error('Error saving transcript:', error);
      resolve(false);
    }
  });
} 