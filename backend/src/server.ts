import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import config from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { csrfSync } from "csrf-sync";
import MongoStore from "connect-mongo";

const app = express();

// --- Connect to MongoDB ---
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Core Middlewares ---
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration to allow credentials from the frontend
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// --- Session Management ---
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.mongoUri }), // RESTORE THIS LINE
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // true only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ← THIS IS KEY
      domain: "localhost", // Explicitly set domain for localhost development
    },
  })
);

// 2. Configure csrf-sync
const {
  generateToken,
  csrfSynchronisedProtection,
  storeTokenInState,
  getTokenFromState,
} = csrfSync({
  getTokenFromState: (req) => req.session.csrfToken,
  storeTokenInState: (req, token) => {
    req.session.csrfToken = token;
  },
  // Expect token in the 'X-CSRF-Token' header by default
});

// 3. Middleware to generate a token for GET requests and expose an endpoint
app.use((req, res, next) => {
  // Generate a token if one doesn't exist for the session
  if (!req.session.csrfToken) {
    storeTokenInState(req, generateToken(req));
  }
  next();
});

// 4. Apply CSRF protection to all routes after this point

app.get("/save-session", (req, res) => {
  req.session.checking = "adarsh shanu";
  res.send("session stored" + " " + req.session.checking);
});
app.get("/check-working", (req, res) => {
  if (req.session.checking) res.send(req.session.checking);
  else res.send("session not stored");
});

// Route to send the token to the client
app.get("/api/csrf-token", (req, res) => {
  // Send the token value which is stored in the session
  res.json({ csrfToken: req.session.csrfToken });
});

app.get("/", (req, res) => {
  res.send("server is running...");
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use(csrfSynchronisedProtection);
app.use("/api/users", userRoutes);

// --- Global Error Handler ---
// This must be the last middleware
app.use(errorHandler);

// --- Start Server ---
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
