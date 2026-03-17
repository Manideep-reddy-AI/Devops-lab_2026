require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const dashboardController = require('./controllers/dashboardController');
const { isAuthenticated } = require('./middleware/auth');

const app = express();

// Connect to MongoDB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override (for PUT/DELETE from forms)
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_change_in_production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Flash messages
app.use(flash());

// Make session & flash available to all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/papers', paperRoutes);
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);

// Dashboard (protected)
app.get('/dashboard', isAuthenticated, dashboardController.getDashboard);

// Root redirect
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/auth/login');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html><head>
      <title>404 — ResearchHub</title>
      <link rel="stylesheet" href="/css/style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    </head>
    <body class="auth-body">
      <div class="auth-container" style="text-align:center">
        <div class="auth-card">
          <i class="fas fa-file-circle-question" style="font-size:4rem;color:var(--primary);margin-bottom:1rem"></i>
          <h1 style="font-size:5rem;font-weight:900;color:var(--primary)">404</h1>
          <p style="color:var(--text-muted);margin-bottom:1.5rem">Page not found.</p>
          <a href="/" class="btn btn-primary"><i class="fas fa-home"></i> Go Home</a>
        </div>
      </div>
    </body></html>
  `);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    req.flash('error', 'File too large. Max size is 20MB for PDFs, 5MB for images.');
    return res.redirect('back');
  }
  if (err.message === 'Only PDF files are allowed!' || err.message === 'Only image files are allowed!') {
    req.flash('error', err.message);
    return res.redirect('back');
  }
  res.status(500).send(`
    <!DOCTYPE html>
    <html><head>
      <title>Server Error — ResearchHub</title>
      <link rel="stylesheet" href="/css/style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    </head>
    <body class="auth-body">
      <div class="auth-container" style="text-align:center">
        <div class="auth-card">
          <i class="fas fa-triangle-exclamation" style="font-size:3rem;color:var(--danger);margin-bottom:1rem"></i>
          <h1 style="font-size:3rem;font-weight:900;color:var(--danger)">500</h1>
          <p style="color:var(--text-muted);margin-bottom:1.5rem">Internal Server Error.</p>
          <a href="/" class="btn btn-primary"><i class="fas fa-home"></i> Go Home</a>
        </div>
      </div>
    </body></html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 ResearchHub running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
