import express from 'express';
import Trip from '../models/TripModel.js';
import User from '../models/Usermodel.js';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.js';

const router = express.Router();

// Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// Create a new trip
router.post("/creates", verifyToken, async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log
    console.log("User from token:", req.userId); // Debug log

    const { tripName, tripStartTime, StartLocation, type, EndLocation, tripEndTime, budget } = req.body;
    
    if (!tripName || !tripStartTime || !StartLocation || !EndLocation || !budget) {
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { tripName, tripStartTime, StartLocation, EndLocation, budget }
      });
    }

    // Create new trip
    const newTrip = new Trip({
      user: req.userId,
      tripName,
      tripStartTime,
      StartLocation,
      EndLocation,
      budget: Number(budget),
      trip_type: type,
      tripEndTime,
      transactions: []
    });

    console.log("New trip object:", newTrip); // Debug log

    const savedTrip = await newTrip.save();
    console.log("Saved trip:", savedTrip); // Debug log

    // Update user's trips array
    await User.findByIdAndUpdate(
      req.userId,
      { current_trip: savedTrip._id },
      { $push: { trips: savedTrip._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Trip created successfully",
      trip: savedTrip
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ 
      message: "Failed to create trip",
      error: error.message 
    });
  }
});

router.get("/create" , function (req , res) { res.send("hello")}) 

// Get current trip
router.get("/current", verifyToken, async (req, res) => {
  try {
    const currentTrip = await Trip.findOne({ 
      user: req.userId,
      tripEndTime: { $gte: new Date() }
    }).sort({ tripStartTime: 1 });
    
    if (!currentTrip) {
      return res.status(404).json({ message: "No active trip found" });
    }

    res.json(currentTrip);
  } catch (error) {
    console.error("Error fetching current trip:", error);
    res.status(500).json({ message: "Failed to fetch current trip" });
  }
});

export default router;