const session = require('express-session');
const MongoStore = require('connect-mongo');

function buildSessionMiddleware() {
  return session({
    secret: process.env.SESSION_SECRET || 'secret',
    name: process.env.SESSION_NAME || 'sid',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  });
}

module.exports = { buildSessionMiddleware };
