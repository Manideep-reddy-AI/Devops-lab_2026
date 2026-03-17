const session = require("express-session");
const MongoStore = require("connect-mongo");

function buildSessionMiddleware() {
  const mongoUrl = process.env.MONGODB_URI;
  if (!mongoUrl) throw new Error("Missing MONGODB_URI for session store.");

  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET in environment.");

  const sessionName = process.env.SESSION_NAME || "fw.sid";

  return session({
    name: sessionName,
    secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7 // 7 days
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  });
}

module.exports = { buildSessionMiddleware };

