import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import jwt from 'jsonwebtoken';
import { generateToken } from './utils/jwt.js';
import { authMiddleware } from './middleware/auth.js';
import authRoutes from "./auth.js";
import TransactionRoutes from "./Transactions.js";
import User from "./models/Usermodel.js";
import Notification from "./models/Notification.js";
import Transaction from "./models/Transaction.js";
import Event from "./models/CalenderEvents.js";

dotenv.config();

const app = express();
app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // Logs requests

// Mount authentication routes
app.use('/auth', authRoutes);
app.use('/', TransactionRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Get user info from Google
const getGoogleUserInfo = async (accessToken) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

// Get current user
app.get("/auth/user", authMiddleware, async (req, res) => {
  try {
    res.json({ 
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Google OAuth routes
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events",
      "email",
      "profile"
    ],
    prompt: 'consent'
  });
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  try {
    console.log("OAuth Callback - Redirecting to: http://localhost:3000/user");
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    
    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);
    if (!googleUser) {
      throw new Error('Failed to get user info from Google');
    }

    // Find or create user
    let user = await User.findOne({ googleId: googleUser.id });
    if (!user) {
      user = new User({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } else {
      user.accessToken = tokens.access_token;
      if (tokens.refresh_token) {
        user.refreshToken = tokens.refresh_token;
      }
      user.picture = googleUser.picture;
    }
    await user.save();

    // Generate JWT
    const jwtToken = generateToken(user);

    // Set JWT in cookie
    res.cookie('jwt_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log("OAuth Callback - JWT Token Generated:", jwtToken);
    res.redirect("http://localhost:5173/user");
  } catch (error) {
    console.error("❌ Error in Google OAuth callback:", error);
    res.redirect("http://localhost:5173/auth/error");
  }
});

// Calendar events
app.get("/calendar/events", authMiddleware, async (req, res) => {
  try {
    oauth2Client.setCredentials({ access_token: req.user.accessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const eventsResponse = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = eventsResponse.data.items;
    
    // Store events in MongoDB
    for (const event of events) {
      await Event.findOneAndUpdate(
        { eventId: event.id },
        {
          googleId: req.user.googleId,
          eventId: event.id,
          summary: event.summary || "No Title",
          description: event.description || "No Description",
          location: event.location || "No Location",
          startTime: event.start.dateTime || event.start.date,
          endTime: event.end.dateTime || event.end.date,
        },
        { upsert: true, new: true }
      );
    }

    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
});

// Sign out
app.post('/auth/signout', (req, res) => {
  res.clearCookie('jwt_token');
  res.json({ message: 'Signed out successfully' });
});

app.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));
