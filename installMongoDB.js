#!/usr/bin/env node

/**
 * MongoDB Setup Script for Windows
 * Downloads and installs MongoDB Community Server
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MONGO_URL = 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi';
const DOWNLOAD_PATH = path.join(process.env.TEMP, 'mongodb-7.0.5.msi');

console.log('🚀 MongoDB Installation Script\n');
console.log('Step 1: Downloading MongoDB Community Server...');
console.log(`Download URL: ${MONGO_URL}\n`);

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      const len = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        const percent = Math.round((downloaded / len) * 100);
        process.stdout.write(`\rDownloading: ${percent}%`);
      });

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('\n✅ Download completed!\n');
        resolve();
      });
    }).on('error', reject);
  });
}

async function install() {
  try {
    await downloadFile(MONGO_URL, DOWNLOAD_PATH);

    console.log('Step 2: Installing MongoDB...');
    console.log(`Installer: ${DOWNLOAD_PATH}\n`);

    // Run MSI installer
    execSync(`msiexec.exe /i "${DOWNLOAD_PATH}" /quiet /norestart ADDLOCAL=all`, {
      stdio: 'inherit',
    });

    console.log('\n✅ MongoDB installation completed!');
    console.log('\nStep 3: Starting MongoDB service...');

    // Wait for service to be available
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
      execSync('net start MongoDB', { stdio: 'inherit' });
      console.log('✅ MongoDB service started!\n');
    } catch (e) {
      console.log('⚠️  MongoDB service may already be running\n');
    }

    console.log('📋 Next Steps:');
    console.log('1. Run: node checkMongoDB.js (to verify connection)');
    console.log('2. Run: node insertEvents.js (to load sample data)');
    console.log('3. Run: npm start (to start the server)\n');
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.log('\n📖 Manual Installation:');
    console.log('Visit: https://www.mongodb.com/try/download/community');
    console.log('Download the .msi file for Windows');
    console.log('Run the installer and follow the prompts\n');
    process.exit(1);
  }
}

install();
