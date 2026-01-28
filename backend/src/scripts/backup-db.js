/**
 * Database Backup Script
 * Creates automated backups of MongoDB database
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../../backups');
const MONGO_URI = process.env.MONGO_URI;
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '7');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Create database backup
 */
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

  console.log('🔄 Starting database backup...');
  console.log(`📁 Backup location: ${backupPath}`);

  return new Promise((resolve, reject) => {
    const command = `mongodump --uri="${MONGO_URI}" --out="${backupPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Backup failed:', error.message);
        reject(error);
        return;
      }

      if (stderr) {
        console.log('⚠️ Warnings:', stderr);
      }

      console.log('✅ Backup completed successfully!');
      console.log(`📦 Backup size: ${getDirectorySize(backupPath)} MB`);
      resolve(backupPath);
    });
  });
}

/**
 * Get directory size in MB
 */
function getDirectorySize(dirPath) {
  let totalSize = 0;

  const files = fs.readdirSync(dirPath, { recursive: true, withFileTypes: true });
  
  files.forEach(file => {
    if (file.isFile()) {
      const fullPath = path.join(file.path || dirPath, file.name);
      totalSize += fs.statSync(fullPath).size;
    }
  });

  return (totalSize / (1024 * 1024)).toFixed(2);
}

/**
 * Clean old backups
 */
function cleanOldBackups() {
  console.log('🧹 Cleaning old backups...');

  const now = Date.now();
  const cutoffTime = now - (RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const backups = fs.readdirSync(BACKUP_DIR);
  let deletedCount = 0;

  backups.forEach(backup => {
    const backupPath = path.join(BACKUP_DIR, backup);
    const stats = fs.statSync(backupPath);

    if (stats.isDirectory() && stats.mtimeMs < cutoffTime) {
      console.log(`🗑️ Deleting old backup: ${backup}`);
      fs.rmSync(backupPath, { recursive: true, force: true });
      deletedCount++;
    }
  });

  console.log(`✅ Cleaned ${deletedCount} old backup(s)`);
}

/**
 * List all backups
 */
function listBackups() {
  console.log('📋 Available backups:');

  const backups = fs.readdirSync(BACKUP_DIR);
  
  if (backups.length === 0) {
    console.log('No backups found');
    return;
  }

  backups.forEach(backup => {
    const backupPath = path.join(BACKUP_DIR, backup);
    const stats = fs.statSync(backupPath);
    const size = getDirectorySize(backupPath);
    const date = stats.mtime.toLocaleString();

    console.log(`\n📦 ${backup}`);
    console.log(`   Size: ${size} MB`);
    console.log(`   Date: ${date}`);
  });
}

/**
 * Restore from backup
 */
async function restoreBackup(backupName) {
  const backupPath = path.join(BACKUP_DIR, backupName);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup not found: ${backupName}`);
  }

  console.log('🔄 Starting database restore...');
  console.log(`📁 Restoring from: ${backupPath}`);

  return new Promise((resolve, reject) => {
    const command = `mongorestore --uri="${MONGO_URI}" --drop "${backupPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Restore failed:', error.message);
        reject(error);
        return;
      }

      if (stderr) {
        console.log('⚠️ Warnings:', stderr);
      }

      console.log('✅ Restore completed successfully!');
      resolve();
    });
  });
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'create':
        await createBackup();
        cleanOldBackups();
        break;

      case 'list':
        listBackups();
        break;

      case 'restore':
        const backupName = args[1];
        if (!backupName) {
          console.error('❌ Please specify backup name');
          process.exit(1);
        }
        await restoreBackup(backupName);
        break;

      case 'clean':
        cleanOldBackups();
        break;

      default:
        console.log(`
Database Backup Utility
=======================

Usage:
  npm run backup:create  - Create new backup
  npm run backup:list    - List all backups
  npm run backup:restore <name> - Restore from backup
  npm run backup:clean   - Clean old backups

Examples:
  npm run backup:create
  npm run backup:list
  npm run backup:restore backup-2024-01-01T10-00-00
        `);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createBackup,
  restoreBackup,
  listBackups,
  cleanOldBackups
};
