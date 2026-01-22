# MongoDB Connection Guide

## Option 1: Use MongoDB Atlas (Cloud - Recommended, No Installation)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account
4. Create a free cluster
5. Get connection string (example):
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eventDB

6. Update your connection in server.js:
   Add to line 56:
   const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/eventDB';

7. Run:
   $env:MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/eventDB'
   npm start

## Option 2: Install MongoDB Community (Local)

1. Download from: https://www.mongodb.com/try/download/community
2. Choose Windows .msi installer
3. Run installer (use default paths)
4. After installation, MongoDB starts as Windows service automatically
5. Run: npm start

## Option 3: MongoDB with WSL2 (Windows Subsystem for Linux)

If you have WSL2 installed:
   wsl -d Ubuntu
   sudo apt update && sudo apt install -y mongodb
   mongod

Then in Windows terminal:
   npm start

## Current Status:
✅ API Server: Running on port 3000
⚠️  MongoDB: Not connected (using demo mode with mock data)

## To Test MongoDB Connection:
   node checkMongoDB.js

