#!/usr/bin/env node

/**
 * MongoDB Connection Helper
 * Attempts to connect to local MongoDB or provides instructions
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventDB';

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully at:', MONGODB_URI);
    return true;
  } catch (error) {
    console.log('\n⚠️  MongoDB Connection Failed');
    console.log('─'.repeat(50));
    console.log('Error:', error.message);
    console.log('\n📋 To connect MongoDB, you have these options:\n');
    console.log('Option 1: Install MongoDB Community');
    console.log('  1. Download from: https://www.mongodb.com/try/download/community');
    console.log('  2. Run the installer');
    console.log('  3. MongoDB will start automatically\n');
    console.log('Option 2: Start MongoDB manually');
    console.log('  1. Open MongoDB Compass (you already have it!)');
    console.log('  2. Click "Connect" button');
    console.log('  3. Keep it open while running the server\n');
    console.log('Option 3: Use MongoDB Atlas (Cloud - No Installation)');
    console.log('  1. Go to: https://www.mongodb.com/cloud/atlas');
    console.log('  2. Create free account & cluster');
    console.log('  3. Get connection string');
    console.log('  4. Run: set MONGODB_URI=mongodb+srv://... && npm start\n');
    console.log('─'.repeat(50));
    return false;
  }
}

module.exports = { connectMongoDB };

// If run directly
if (require.main === module) {
  connectMongoDB().then(success => {
    if (success) {
      mongoose.connection.close();
      console.log('\n✅ Connection test successful!');
    } else {
      console.log('\n❌ Please set up MongoDB and try again.');
    }
    process.exit(success ? 0 : 1);
  });
}
