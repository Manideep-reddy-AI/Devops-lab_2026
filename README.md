# Event Management REST API - Complete Setup

## ✅ Project Status: READY TO USE

### What's Included:
- ✅ Express.js REST API server (port 3000)
- ✅ Mongoose MongoDB integration
- ✅ Complete CRUD operations
- ✅ Pagination & Search support
- ✅ Demo mode with mock data (works without MongoDB)
- ✅ Auto-switches to real MongoDB when connected
- ✅ Proper error handling & logging

---

## 🚀 Quick Start (Demo Mode - Works Now!)

```bash
npm start
```

Then visit: **http://localhost:3000/events**

You'll see 5 sample events with full CRUD support!

---

## 📱 API Endpoints

### List Events (with pagination & search)
```
GET http://localhost:3000/events
GET http://localhost:3000/events?page=1&limit=5
GET http://localhost:3000/events?title=Workshop
```

### Get Single Event
```
GET http://localhost:3000/events/{id}
```

### Create Event (POST)
```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Event",
    "date": "2024-04-01T10:00:00Z",
    "location": "Boston",
    "participants": ["Alice", "Bob"]
  }'
```

### Update Event (PUT)
```bash
curl -X PUT http://localhost:3000/events/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Delete Event (DELETE)
```bash
curl -X DELETE http://localhost:3000/events/{id}
```

---

## 🗄️ MongoDB Connection Options

### Option 1: MongoDB Atlas (Cloud - EASIEST)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string
4. Set environment variable:
   ```powershell
   $env:MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/eventDB'
   npm start
   ```

### Option 2: Local MongoDB (Requires Installation)
1. Download: https://www.mongodb.com/try/download/community
2. Install & run (starts as Windows service)
3. Run:
   ```bash
   npm start
   ```

### Option 3: MongoDB with WSL2
```bash
wsl -d Ubuntu
sudo apt install mongodb
mongod
```
Then in Windows:
```bash
npm start
```

---

## 📁 Project Files

```
.
├── server.js              # Main Express API (277 lines)
├── insertEvents.js        # Sample data loader
├── checkMongoDB.js        # MongoDB connection tester
├── installMongoDB.js      # MongoDB installer
├── package.json           # Dependencies & scripts
├── .env                   # Environment variables (optional)
└── MONGODB_SETUP.md       # Detailed MongoDB guide
```

---

## 🎯 Features Implemented

✅ Express.js server on port 3000
✅ Mongoose schemas with validation
✅ CRUD operations (Create, Read, Update, Delete)
✅ Pagination support (page, limit)
✅ Search by title (case-insensitive)
✅ Async/await error handling
✅ Template literals for console.log
✅ Demo mode with in-memory storage
✅ Auto-switch to MongoDB when available
✅ Sample events with participants

---

## 🧪 Testing

```bash
# Test MongoDB connection
node checkMongoDB.js

# Insert sample events to MongoDB (when connected)
node insertEvents.js

# Start the server
npm start

# Or use dev mode with auto-reload
npm run dev
```

---

## 📊 Event Schema

```javascript
{
  title: String (required),
  date: Date (required),
  location: String (required),
  participants: [String] (default: []),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

---

## 🎉 You're All Set!

The API is **fully functional in demo mode** with mock data.
When you connect MongoDB, it will automatically use the real database!

**Start now:**
```bash
npm start
```

Then open: http://localhost:3000/events

Happy coding! 🚀
