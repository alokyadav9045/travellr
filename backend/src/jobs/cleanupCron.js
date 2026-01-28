const cron = require('node-cron');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const storageService = require('../services/storageService');
const cloudinary = require('cloudinary').v2;
const { env } = require('../config/env');

/**
 * Cleanup Cron Job
 * Runs weekly on Sunday at 2 AM
 */
const cleanupCron = cron.schedule('0 2 * * 0', async () => {
  console.log('Running weekly cleanup cron job...');
  
  try {
    await cleanExpiredTokens();
    await cleanOldNotifications();
    await cleanUnverifiedUsers();
    await cleanOrphanedFiles();
    
    console.log('Cleanup cron job completed successfully');
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
  }
}, {
  scheduled: false
});

/**
 * Clean expired email verification and password reset tokens
 */
async function cleanExpiredTokens() {
  try {
    const now = new Date();

    const result = await User.updateMany(
      {
        $or: [
          { emailVerificationExpires: { $lt: now } },
          { passwordResetExpires: { $lt: now } }
        ]
      },
      {
        $unset: {
          emailVerificationToken: '',
          emailVerificationExpires: '',
          passwordResetToken: '',
          passwordResetExpires: ''
        }
      }
    );

    console.log(`Cleaned ${result.modifiedCount} expired tokens`);
  } catch (error) {
    console.error('Error cleaning expired tokens:', error);
  }
}

/**
 * Clean old notifications (older than 90 days)
 */
async function cleanOldNotifications() {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await Notification.deleteMany({
      createdAt: { $lt: ninetyDaysAgo },
      isRead: true
    });

    console.log(`Cleaned ${result.deletedCount} old notifications`);
  } catch (error) {
    console.error('Error cleaning old notifications:', error);
  }
}

/**
 * Clean unverified users (older than 30 days)
 */
async function cleanUnverifiedUsers() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const unverifiedUsers = await User.find({
      isEmailVerified: false,
      createdAt: { $lt: thirtyDaysAgo }
    });

    for (const user of unverifiedUsers) {
      // Delete user avatar if exists
      if (user.avatar && user.avatar.publicId) {
        try {
          await storageService.deleteFile(user.avatar.publicId);
        } catch (error) {
          console.error(`Error deleting avatar for user ${user.email}:`, error);
        }
      }

      await user.deleteOne();
    }

    console.log(`Cleaned ${unverifiedUsers.length} unverified users`);
  } catch (error) {
    console.error('Error cleaning unverified users:', error);
  }
}

/**
 * Clean orphaned files from Cloudinary
 * Compares files in Cloudinary with files referenced in database
 */
async function cleanOrphanedFiles() {
  try {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      console.log('Cloudinary credentials not configured, skipping orphaned file cleanup');
      return;
    }

    // Get all user avatars
    const users = await User.find({ 'avatar.publicId': { $exists: true, $ne: null } }).select('avatar');
    const userAvatarIds = users.map(u => u.avatar.publicId).filter(Boolean);

    // Get all trip images
    const trips = await Trip.find({ 'images.publicId': { $exists: true, $ne: null } }).select('images');
    const tripImageIds = trips.flatMap(t => t.images.map(img => img.publicId)).filter(Boolean);

    // Combine all valid public IDs
    const validPublicIds = new Set([...userAvatarIds, ...tripImageIds]);

    // Get all files from Cloudinary in the travellr folder
    try {
      const result = await cloudinary.api.resources({
        resource_type: 'image',
        prefix: 'travellr/',
        max_results: 500
      });

      let deletedCount = 0;

      // Check each file and delete if not referenced in database
      for (const resource of result.resources) {
        const publicId = resource.public_id;
        
        if (!validPublicIds.has(publicId)) {
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            deletedCount++;
            console.log(`Deleted orphaned file: ${publicId}`);
          } catch (error) {
            console.error(`Error deleting orphaned file ${publicId}:`, error);
          }
        }
      }

      console.log(`Cleaned ${deletedCount} orphaned files from Cloudinary`);
    } catch (error) {
      console.error('Error accessing Cloudinary resources:', error);
    }
  } catch (error) {
    console.error('Error in orphaned file cleanup:', error);
  }
}

module.exports = { cleanupCron, cleanExpiredTokens, cleanOldNotifications, cleanUnverifiedUsers, cleanOrphanedFiles };
