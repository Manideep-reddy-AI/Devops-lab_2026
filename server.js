const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for demo mode
let mockEvents = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Tech Conference 2023",
    date: new Date("2023-11-25T09:00:00Z"),
    location: "New York",
    participants: ["John Doe", "Jane Smith", "Alice Brown"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "AI/ML Workshop",
    date: new Date("2023-12-05T10:00:00Z"),
    location: "San Francisco",
    participants: ["Michael Clark", "Emma Wilson", "David Lee"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Blockchain Summit",
    date: new Date("2024-01-15T08:30:00Z"),
    location: "London",
    participants: ["Liam Johnson", "Sophia Davis", "Jackson Martinez"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Data Science Bootcamp",
    date: new Date("2024-02-10T12:00:00Z"),
    location: "Toronto",
    participants: ["Isabella Garcia", "Ethan Moore", "Ava Rodriguez"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Cybersecurity Seminar",
    date: new Date("2024-03-03T14:00:00Z"),
    location: "Berlin",
    participants: ["James Taylor", "Mia Anderson", "Lucas Thomas"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let databaseMode = 'mock'; // Will switch to 'mongodb' when connected

// MongoDB Connection with error suppression for demo
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventDB';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log(`MongoDB connected`);
    databaseMode = 'mongodb';
  })
  .catch((err) => {
    console.log(`ℹ️  Demo Mode: Using in-memory storage (MongoDB not available)`);
  });

// Keep connection reference
const connection = mongoose.connection;
connection.on('connected', () => {
  console.log(`MongoDB connected`);
  databaseMode = 'mongodb';
});

connection.on('error', (err) => {
  console.log(`MongoDB error: ${err.message}`);
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  participants: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Event Model
const Event = mongoose.model('Event', eventSchema);

// POST /events - Create a new event
app.post('/events', async (req, res) => {
  try {
    const { title, date, location, participants } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, and location are required fields',
      });
    }

    if (databaseMode === 'mongodb') {
      // MongoDB mode
      const newEvent = new Event({
        title,
        date,
        location,
        participants: participants || [],
      });

      const savedEvent = await newEvent.save();

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: savedEvent,
      });
    } else {
      // Mock mode
      const newEvent = {
        _id: new mongoose.Types.ObjectId(),
        title,
        date: new Date(date),
        location,
        participants: participants || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockEvents.push(newEvent);

      res.status(201).json({
        success: true,
        message: 'Event created successfully (demo mode)',
        data: newEvent,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error creating event: ${error.message}`,
    });
  }
});

// GET /events - List events with pagination and search
app.get('/events', async (req, res) => {
  try {
    const { page = 1, limit = 10, title } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers',
      });
    }

    if (databaseMode === 'mongodb') {
      // MongoDB mode
      let filter = {};
      if (title) {
        filter.title = { $regex: title, $options: 'i' };
      }

      const skip = (pageNum - 1) * limitNum;

      const events = await Event.find(filter)
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      const totalEvents = await Event.countDocuments(filter);
      const totalPages = Math.ceil(totalEvents / limitNum);

      res.status(200).json({
        success: true,
        message: 'Events retrieved successfully',
        data: events,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalEvents,
          limit: limitNum,
        },
      });
    } else {
      // Mock mode
      let filteredEvents = mockEvents;

      if (title) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(title.toLowerCase())
        );
      }

      const totalEvents = filteredEvents.length;
      const skip = (pageNum - 1) * limitNum;
      const events = filteredEvents
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + limitNum);

      const totalPages = Math.ceil(totalEvents / limitNum);

      res.status(200).json({
        success: true,
        message: 'Events retrieved successfully (demo mode)',
        data: events,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalEvents,
          limit: limitNum,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error retrieving events: ${error.message}`,
    });
  }
});

// GET /events/:id - Get a single event
app.get('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    if (databaseMode === 'mongodb') {
      // MongoDB mode
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Event retrieved successfully',
        data: event,
      });
    } else {
      // Mock mode
      const event = mockEvents.find(e => e._id.toString() === id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Event retrieved successfully (demo mode)',
        data: event,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error retrieving event: ${error.message}`,
    });
  }
});

// PUT /events/:id - Update an event
app.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, location, participants } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = date;
    if (location !== undefined) updateData.location = location;
    if (participants !== undefined) updateData.participants = participants;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update',
      });
    }

    if (databaseMode === 'mongodb') {
      // MongoDB mode
      const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent,
      });
    } else {
      // Mock mode
      const eventIndex = mockEvents.findIndex(e => e._id.toString() === id);

      if (eventIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      const updatedEvent = {
        ...mockEvents[eventIndex],
        ...updateData,
        updatedAt: new Date()
      };

      mockEvents[eventIndex] = updatedEvent;

      res.status(200).json({
        success: true,
        message: 'Event updated successfully (demo mode)',
        data: updatedEvent,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error updating event: ${error.message}`,
    });
  }
});

// DELETE /events/:id - Delete an event
app.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    if (databaseMode === 'mongodb') {
      // MongoDB mode
      const deletedEvent = await Event.findByIdAndDelete(id);

      if (!deletedEvent) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
        data: deletedEvent,
      });
    } else {
      // Mock mode
      const eventIndex = mockEvents.findIndex(e => e._id.toString() === id);

      if (eventIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      const deletedEvent = mockEvents.splice(eventIndex, 1)[0];

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully (demo mode)',
        data: deletedEvent,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error deleting event: ${error.message}`,
    });
  }
});

// Health Check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
