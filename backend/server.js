import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import axios from 'axios';
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
import placeRouter from './routes/places.js';
import TripRouter from './routes/Trip.js'
import exploreRouter from './routes/explore.js'
import locationRouter from './routes/location.js'

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
app.get("/" , function (req , res) { res.send("hello")})
app.use('/api/places', placeRouter);
app.use('/api/trips' , TripRouter)
app.use('/api/explore' , exploreRouter)
app.use('/api/location', locationRouter)
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



// Itenary Planning

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.OPENROUTER_API_KEY;
const  GooglePlacesAPIKey = process.env.GOOGLE_PLACES_API_KEY;

app.post("/api/deepseek", async (req, res) => {
  try {
    const { place, interests, startDate, endDate, startTime, endTime } = req.body;

    // Validate request body
    if (!place || !interests || !startDate || !endDate || !startTime || !endTime) {
      console.error("🚨 Missing required fields in the request body.");
      return res.status(400).json({ error: "Missing required fields in the request body." });
    }

    console.log("📩 Request body:", req.body);

    // Step 1: Fetch places from Google Places API based on interests
    const placesList = await fetchPlacesFromGoogle(place, interests);

    if (!placesList || placesList.length === 0) {
      console.error("🚨 No places found for the given interests.");
      return res.status(400).json({ error: "No places found for the given interests." });
    }

    console.log("✅ Fetched places from Google Places API:", placesList);

    // Step 2: Generate itinerary using OpenRouter
    const totalPrompt = `Plan a detailed **${startDate} to ${endDate}-day itinerary** for **${place}**, considering:
        - Timings (**${startTime}** to **${endTime}**)
        - User interests (**${interests.join(", ")}**)
        - Seamless travel between locations
        - Food breaks with locations
        - Weather-based activity suggestions

        **Here are the places to consider:**
        ${placesList.map(p => p.name).join(", ")}

        **Return ONLY valid JSON in this exact format (NO extra text, NO explanations, JUST JSON):**
        [
        {
            "day": 1,
            "date": "YYYY-MM-DD",
            "activities": [
            {
                "time": "09:00",
                "place": "Place 1",
                "description": "Brief description of Place 1"
            },
            {
                "time": "11:00",
                "place": "Place 2",
                "description": "Brief description of Place 2"
            }
            ]
        }
        ]`;

    console.log("📝 Generated prompt for OpenRouter API:", totalPrompt);

    // Ensure the OpenRouter API key is set
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("🚨 OPENROUTER_API_KEY environment variable is not set.");
      return res.status(500).json({ error: "Internal Server Error: OPENROUTER_API_KEY is not configured." });
    }

    // Make a request to OpenRouter
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "https://globemate.com",
        "X-Title": process.env.SITE_NAME || "GlobeMate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
        messages: [
          {
            role: "user",
            content: totalPrompt,
          },
        ],
      }),
    });

    const responseData = await openRouterResponse.json();
    console.log("✅ Response from OpenRouter API:", responseData);

    const itineraryTextRaw = responseData.choices[0].message?.content.trim();

    // Extract JSON from the response if there's extra text
    const jsonStartIndex = itineraryTextRaw.indexOf("[");
    const jsonEndIndex = itineraryTextRaw.lastIndexOf("]") + 1;
    const jsonString = itineraryTextRaw.slice(jsonStartIndex, jsonEndIndex);

    // Ensure API response is JSON
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      console.error("🚨 API returned unexpected format:", itineraryTextRaw);
      return res.status(500).json({ error: "Invalid response from API", rawResponse: itineraryTextRaw });
    }

    let itineraryText;
    try {
      itineraryText = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("🚨 JSON Parsing Error:", parseError);
      return res.status(500).json({ error: "API returned invalid JSON", rawResponse: jsonString });
    }

    console.log("✅ Parsed itinerary:", itineraryText);

    // Send correctly formatted response
    res.json({ itinerary: itineraryText });

  } catch (error) {
    console.error("🚨 Error calling OpenRouter API:", error.message);
    if (error.response) {
      console.error("🚨 OpenRouter API response error:", error.response.data);
    }
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// New endpoint to fetch travel options (trains, buses, and flights)
app.post("/api/travel-options", async (req, res) => {
  try {
    const { source, destination, date } = req.body;

    // Validate input
    if (!source || !destination || !date) {
      return res.status(400).json({ error: "Missing required fields: source, destination, date" });
    }

    // Define the prompt for OpenRouter
    const prompt = `You are a travel assistant. Provide a list of trains, buses, and flights between ${source} and ${destination} on ${date}. 
    Return the results in the following JSON format:
    {
      "trains": [
        {
          "name": "Train Name",
          "departureTime": "HH:MM",
          "arrivalTime": "HH:MM",
          "duration": "Xh Ym"
        }
      ],
      "buses": [
        {
          "name": "Bus Name",
          "departureTime": "HH:MM",
          "arrivalTime": "HH:MM",
          "duration": "Xh Ym"
        }
      ],
      "flights": [
        {
          "name": "Flight Name",
          "departureTime": "HH:MM",
          "arrivalTime": "HH:MM",
          "duration": "Xh Ym",
          "airline": "Airline Name"
        }
      ]
    }`;

    // Call OpenRouter API
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "https://globemate.com",
        "X-Title": process.env.SITE_NAME || "GlobeMate",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-distill-llama-70b:free",
        "messages": [
          {
            "role": "system",
            "content": "You are a travel assistant. Provide a list of trains, buses, and flights between the given source and destination on the specified date."
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    const responseData = await openRouterResponse.json();
    console.log('OpenRouter Response:', responseData);

    // Handle OpenRouter API errors
    if (responseData.error) {
      console.error('OpenRouter API Error:', responseData.error);
      return res.status(500).json({ error: "OpenRouter API error" });
    }

    // Extract the response content
    const responseContent = responseData.choices?.[0]?.message?.content;
    console.log('OpenRouter Response Content:', responseContent);

    // Extract and parse the JSON portion
    const travelOptions = extractJSON(responseContent);
    if (!travelOptions) {
      return res.status(500).json({ error: "Failed to extract valid JSON from the response" });
    }

    // Return the travel options
    res.status(200).json({ travelOptions });
  } catch (error) {
    console.error('Error fetching travel options:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to fetch places from Google Places API
async function fetchPlacesFromGoogle(location, interests) {
  const baseUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const query = interests.map(interest => `${interest} in ${location}`).join(" OR ");

  try {
    const response = await axios.get(baseUrl, {
      params: {
        query: query,
        key: GooglePlacesAPIKey,
      },
    });

    return response.data.results.map(place => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      types: place.types,
    }));
  } catch (error) {
    console.error("🚨 Error fetching places from Google Places API:", error.message);
    return null;
  }
}


const extractJSON = (responseContent) => {
  try {
    const sanitized = responseContent.replace(/```json/g, '').replace(/```/g, '');
    const jsonStart = sanitized.indexOf('{');
    const jsonEnd = sanitized.lastIndexOf('}') + 1;
    return JSON.parse(sanitized.slice(jsonStart, jsonEnd));
  } catch (error) {
    console.error("JSON Extraction Error:", error);
    return null;
  }
};

// Unified travel planning function
async function getCompleteTravelPlan(params) {
  const { source, destination, date, interests, startDate, endDate, startTime, endTime } = params;
  
  // 1. Get travel options between locations
  const travelPrompt = `As a travel expert, provide REAL transportation options between ${source} and ${destination} on ${date}.
  Include trains, buses, and flights with real operator names and realistic timings.
  Return in this exact JSON format:
  {
    "transport": {
      "trains": [{ "name": "Train Name", "departure": "HH:MM", "arrival": "HH:MM", "duration": "Xh Ym" }],
      "buses": [{ "name": "Bus Name", "departure": "HH:MM", "arrival": "HH:MM", "duration": "Xh Ym" }],
      "flights": [{ "name": "Airline", "departure": "HH:MM", "arrival": "HH:MM", "duration": "Xh Ym" }]
    }
  }`;

  // 2. Generate detailed itinerary
  const itineraryPrompt = `Create a detailed ${endDate - startDate + 1}-day itinerary for ${destination} 
  from ${startDate} to ${endDate} with:
  - Daily activities from ${startTime} to ${endTime}
  - Interests: ${interests.join(', ')}
  - Meal breaks
  - Real attraction names
  Format:
  {
    "itinerary": [{
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {"time": "HH:MM", "place": "Name", "description": "Detailed activity", "type": "sightseeing/meal/etc"}
      ]
    }]
  }`;

  try {
    const [transportResponse, itineraryResponse] = await Promise.all([
      fetchOpenRouter(travelPrompt),
      fetchOpenRouter(itineraryPrompt)
    ]);

    return {
      transport: extractJSON(transportResponse.choices[0].message.content),
      itinerary: extractJSON(itineraryResponse.choices[0].message.content)
    };
  } catch (error) {
    console.error("Travel Planning Error:", error);
    throw new Error("Failed to generate travel plan");
  }
}

// Unified endpoint
app.post("/complete-plan", async (req, res) => {
  try {
    const requiredParams = [
      'source', 'destination', 'date', 
      'interests', 'startDate', 'endDate'
    ];
    
    const missing = requiredParams.filter(p => !req.body[p]);
    if (missing.length > 0) {
      return res.status(400).json({
        error: "Missing required parameters",
        missing,
        example: {
          source: "Mumbai",
          destination: "Goa",
          date: "2023-12-25",
          interests: ["beaches", "water sports"],
          startDate: "2023-12-25",
          endDate: "2023-12-28",
          startTime: "09:00",
          endTime: "20:00"
        }
      });
    }

    const plan = await getCompleteTravelPlan({
      ...req.body,
      startTime: req.body.startTime || '09:00',
      endTime: req.body.endTime || '20:00'
    });

    res.json({
      status: "success",
      plan: {
        source: req.body.source,
        destination: req.body.destination,
        ...plan
      }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      details: "Please check your parameters and try again"
    });
  }
});

// Helper function for OpenRouter API calls
async function fetchOpenRouter(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1-distill-llama-70b:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3 // For more consistent results
    })
  });

  if (!response.ok) throw new Error(`OpenRouter Error: ${response.statusText}`);
  return response.json();
}

app.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));
