const cloudinary = require('../config/cloudinary');
const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

class StorageService {
  /**
   * Upload single file to Cloudinary
   */
  async uploadFile(file, folder = 'general') {
    try {
      const fileContent = parser.format(path.extname(file.originalname).toString(), file.buffer);
      
      const result = await cloudinary.uploader.upload(fileContent.content, {
        folder: `travellr/${folder}`,
        resource_type: 'auto'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  /**
   * Upload multiple files to Cloudinary
   */
  async uploadMultipleFiles(files, folder = 'general') {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Delete multiple files from Cloudinary
   */
  async deleteMultipleFiles(publicIds) {
    try {
      const deletePromises = publicIds.map(publicId => this.deleteFile(publicId));
      return await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw error;
    }
  }

  /**
   * Upload trip images with optimizations
   */
  async uploadTripImages(files) {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileContent = parser.format(path.extname(file.originalname).toString(), file.buffer);
        
        const result = await cloudinary.uploader.upload(fileContent.content, {
          folder: 'travellr/trips',
          transformation: [
            { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        });

        return {
          url: result.secure_url,
          publicId: result.public_id
        };
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading trip images:', error);
      throw error;
    }
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file) {
    try {
      const fileContent = parser.format(path.extname(file.originalname).toString(), file.buffer);
      
      const result = await cloudinary.uploader.upload(fileContent.content, {
        folder: 'travellr/avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Upload vendor documents
   */
  async uploadDocument(file) {
    try {
      const fileContent = parser.format(path.extname(file.originalname).toString(), file.buffer);
      
      const result = await cloudinary.uploader.upload(fileContent.content, {
        folder: 'travellr/documents',
        resource_type: 'auto'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        name: file.originalname,
        format: result.format
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
}

module.exports = new StorageService();
