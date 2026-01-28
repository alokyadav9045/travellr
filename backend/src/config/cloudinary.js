const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const env = require('./env');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

const tripImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travellr/trips',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
    ],
    format: 'webp',
  },
});

const tripThumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travellr/trips/thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 300, crop: 'fill', quality: 'auto:good' },
    ],
    format: 'webp',
  },
});

const vendorDocStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travellr/vendor-docs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travellr/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face', quality: 'auto:good' },
    ],
    format: 'webp',
  },
});

const vendorLogoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travellr/vendor-logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    transformation: [
      { width: 500, height: 500, crop: 'limit', quality: 'auto:good' },
    ],
  },
});

module.exports = {
  cloudinary,
  tripImageStorage,
  tripThumbnailStorage,
  vendorDocStorage,
  avatarStorage,
  vendorLogoStorage,
};