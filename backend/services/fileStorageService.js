const admin = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class FileStorageService {
  constructor() {
    try {
      this.bucket = admin.storage().bucket();
    } catch (error) {
      console.warn('⚠️  Firebase Storage not initialized. File upload features will be disabled.');
      this.bucket = null;
    }
  }

  /**
   * Upload resume to Firebase Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {String} fileName - Original file name
   * @param {String} userId - User ID for folder organization
   * @returns {Object} { fileName, fileUrl }
   */
  async uploadResume(fileBuffer, fileName, userId) {
    if (!this.bucket) {
      throw new Error('Firebase Storage not configured. Please set up Firebase credentials.');
    }
    
    try {
      // Generate unique file name
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `resumes/${userId}/${uuidv4()}.${fileExtension}`;

      // Create file reference
      const file = this.bucket.file(uniqueFileName);

      // Upload file
      await file.save(fileBuffer, {
        metadata: {
          contentType: this.getContentType(fileExtension),
          metadata: {
            originalName: fileName,
            uploadedBy: userId,
            uploadedAt: new Date().toISOString()
          }
        }
      });

      // Make file accessible (private by default, will use signed URLs)
      const fileUrl = `gs://${this.bucket.name}/${uniqueFileName}`;

      return {
        fileName: uniqueFileName,
        fileUrl: fileUrl
      };
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw new Error('Failed to upload resume');
    }
  }

  /**
   * Delete resume from Firebase Storage
   * @param {String} fileUrl - File URL to delete (gs:// format)
   * @returns {Boolean} Success status
   */
  async deleteResume(fileUrl) {
    if (!this.bucket) {
      throw new Error('Firebase Storage not configured. Please set up Firebase credentials.');
    }
    
    try {
      // Extract file path from gs:// URL
      const filePath = fileUrl.replace(`gs://${this.bucket.name}/`, '');
      
      const file = this.bucket.file(filePath);
      await file.delete();
      
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw new Error('Failed to delete resume');
    }
  }

  /**
   * Generate signed URL for resume download
   * @param {String} fileUrl - File URL (gs:// format)
   * @returns {String} Signed URL valid for 1 hour
   */
  async getSignedUrl(fileUrl) {
    if (!this.bucket) {
      throw new Error('Firebase Storage not configured. Please set up Firebase credentials.');
    }
    
    try {
      // Extract file path from gs:// URL
      const filePath = fileUrl.replace(`gs://${this.bucket.name}/`, '');
      
      const file = this.bucket.file(filePath);
      
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000 // 1 hour
      });
      
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  /**
   * Get content type based on file extension
   * @param {String} extension - File extension
   * @returns {String} Content type
   */
  getContentType(extension) {
    const contentTypes = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword'
    };
    
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Validate file type
   * @param {String} mimetype - File mimetype
   * @returns {Boolean} Is valid
   */
  isValidFileType(mimetype) {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    return allowedTypes.includes(mimetype);
  }

  /**
   * Validate file size
   * @param {Number} size - File size in bytes
   * @returns {Boolean} Is valid
   */
  isValidFileSize(size) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return size <= maxSize;
  }
}

module.exports = new FileStorageService();
