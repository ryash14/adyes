/**
 * Firebase Storage — profile photos, resumes, message attachments
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

class StorageService {
  /**
   * Core upload method
   */
  async _upload(bucket, path, file, onProgress) {
    try {
      const storageRef = ref(storage, `${bucket}/${path}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
          },
          (error) => {
            console.error('[Storage] Upload error:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (err) {
      console.error('[Storage] Upload error:', err);
      throw err;
    }
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(userId, file, onProgress) {
    if (!file?.type?.startsWith('image/')) return { url: null, error: 'Please choose an image file' };
    if (file.size > 5 * 1024 * 1024) return { url: null, error: 'Image must be under 5MB' };

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${userId}/profile-${Date.now()}.${ext}`;
      const url = await this._upload('avatars', path, file, onProgress);
      return { url, error: null };
    } catch (error) {
      return { url: null, error: this._friendlyError(error) };
    }
  }

  /**
   * Upload resume (PDF / DOC / DOCX)
   */
  async uploadResume(userId, file, onProgress) {
    if (!file) return { url: null, name: null, error: 'No file selected' };
    if (file.size > 5 * 1024 * 1024) return { url: null, name: null, error: 'Resume must be under 5MB' };

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      return { url: null, name: null, error: 'Resume must be a PDF or Word document' };
    }

    try {
      const safeName = file.name.replace(/[^\w.-]+/g, '-');
      const path = `${userId}/resume-${Date.now()}-${safeName}`;
      const url = await this._upload('resumes', path, file, onProgress);
      return { url, name: file.name, error: null };
    } catch (error) {
      return { url: null, name: null, error: this._friendlyError(error) };
    }
  }

  /**
   * Upload message attachment
   */
  async uploadMessageAttachment(userId, file, onProgress) {
    if (!file) return { data: null, error: 'No file selected' };
    if (file.size > 10 * 1024 * 1024) return { data: null, error: 'File must be under 10MB' };

    try {
      const safeName = file.name.replace(/[^\w.-]+/g, '-');
      const path = `${userId}/${Date.now()}-${safeName}`;
      const url = await this._upload('messages', path, file, onProgress);
      return {
        data: { url, name: file.name, type: file.type, size: file.size },
        error: null,
      };
    } catch (error) {
      return { data: null, error: this._friendlyError(error) };
    }
  }

  /** Convert errors to friendly messages */
  _friendlyError(error) {
    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('bucket not found') || msg.includes('not exist')) {
      return 'Storage bucket not configured. Please check your storage settings.';
    }
    if (msg.includes('unauthorized') || msg.includes('policy') || msg.includes('permission_denied')) {
      return 'Permission denied. You do not have access to upload here.';
    }
    return error?.message || 'Upload failed. Please try again.';
  }
}

export const storageService = new StorageService();
export default storageService;
