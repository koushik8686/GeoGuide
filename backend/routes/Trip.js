import express from 'express';
import Trip from '../models/TripModel.js';
import User from '../models/Usermodel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.cookies.jwt_token;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
console.log(decoded)
  req.userId = decoded.id;
  next();
};

// Create a new trip
router.post("/create", verifyToken, async (req, res) => {
  try {
    
    const { tripName, tripStartTime, StartLocation, type, EndLocation, tripEndTime, budget } = req.body;
    
    if (!tripName || !tripStartTime || !StartLocation || !EndLocation || !budget) {
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { tripName, tripStartTime, StartLocation, EndLocation, budget }
      });
    }
console.log(req.userId)
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

    // Update user's trips array and current trip
    await User.findByIdAndUpdate(
      req.userId,
      { 
        current_trip: savedTrip._id,
        $push: { trips: savedTrip._id }
      },
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

router.get("/create", function (req, res) { 
  res.send("hello");
});

// Get current trip
router.get("/current", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const currentTrip = await Trip.findById(user.current_trip);

    if (!currentTrip) {
      return res.status(404).json({ message: "No active trip found" });
    }

    res.json(currentTrip);
  } catch (error) {
    console.error("Error fetching current trip:", error);
    res.status(500).json({ message: "Failed to fetch current trip" });
  }
});

// Complete current trip
router.post("/complete/:tripId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip._id.toString() !== user.current_trip?.toString()) {
      return res.status(403).json({ message: "This is not your current trip" });
    }

    // Update trip status
    trip.status = 'completed';
    trip.completedDate = new Date();
    await trip.save();

    // Remove current trip reference from user
    user.current_trip = null;
    await user.save();

    res.json({ message: "Trip completed successfully", trip });
  } catch (error) {
    console.error("Error completing trip:", error);
    res.status(500).json({ message: "Failed to complete trip" });
  }
});

router.get("/user/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const trips = await Trip.find({ user: user._id });

    res.json(trips);
  } catch (error) {
    console.error("Error fetching user tours:", error);
    res.status(500).json({ message: "Failed to fetch user tours" });
  }
});

export default router;