const multer = require('multer');
const { tripImageStorage, vendorDocStorage, avatarStorage } = require('../config/cloudinary');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Generic multer middlewares for different upload types
const uploadImages = multer({
  storage: tripImageStorage,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadVendorDocs = multer({
  storage: vendorDocStorage,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = { uploadImages, uploadAvatar, uploadVendorDocs };
