import axios from 'axios';

const API_KEY = 'ssEXKinayR4qlcHzGLYRPhnP1loziwMi';
const API_URL = 'https://pastebin.com/api/api_post.php';

/**
 * Creates a paste on Pastebin.com
 * 
 * @param text The text content to save
 * @param title Optional title for the paste
 * @returns The URL of the created paste, or null if creation failed
 */
export async function createPaste(
  text: string,
  title = `Transcript - ${new Date().toLocaleDateString()}`
): Promise<string | null> {
  if (!text.trim()) {
    console.error('Cannot create a paste with empty content');
    return null;
  }

  const data = new URLSearchParams({
    api_dev_key: API_KEY,
    api_option: 'paste',
    api_paste_code: text,
    api_paste_private: '0', // Public
    api_paste_name: title,
    api_paste_expire_date: '1M', // 1 month
    api_paste_format: 'text'
  });

  try {
    console.log('Uploading content to Pastebin...');
    
    const response = await axios.post(API_URL, data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Paste URL:', response.data);

    if (response.data && typeof response.data === 'string') {
      return response.data;
    } else {
      throw new Error('Invalid response from Pastebin');
    }
  } catch (error) {
    console.error('Error creating paste:', error);
    return null;
  }
} 