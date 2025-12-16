import { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Custom hook for handling file uploads
 * Provides validation and progress tracking
 * 
 * @param {Object} options - Upload options
 * @returns {Object} Upload state and methods
 */
export const useUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    onSuccess,
    onError
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { showNotification } = useNotification();

  /**
   * Validate file before upload
   */
  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed');
    }

    return true;
  };

  /**
   * Upload file
   */
  const upload = async (file, uploadFunction) => {
    try {
      // Validate file
      validateFile(file);

      setUploading(true);
      setProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload with progress tracking
      const response = await uploadFunction(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      setUploadedFile(response.data);
      showNotification('File uploaded successfully', 'success');

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'File upload failed';
      showNotification(errorMessage, 'error');

      if (onError) {
        onError(error);
      }

      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  /**
   * Reset upload state
   */
  const reset = () => {
    setUploading(false);
    setProgress(0);
    setUploadedFile(null);
  };

  return {
    uploading,
    progress,
    uploadedFile,
    upload,
    reset,
    validateFile
  };
};

export default useUpload;
