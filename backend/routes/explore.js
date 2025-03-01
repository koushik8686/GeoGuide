import express from 'express';
import Usermodel from '../models/Usermodel.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
 
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


const router = express.Router();

router.get('/nearby/:location', verifyToken, async (req, res) => {
    try {
      const { location } = req.params;
  
      // Fetch the user
      const user = await Usermodel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract user history
      const userHistory = user.history;
  
      // Step 1: Send user history to the recommendation server
      const recommendationResponse = await axios.post("http://localhost:5000/recommend_tags", {
        user_id: req.userId,
        history: userHistory,
        top_n: 6, // Request 6 recommendations
      });
  
      // Step 2: Get recommended tags from the response
      const { recommendations } = recommendationResponse.data;
      console.log('Recommended tags:', recommendations);
  
      // Step 3: Fetch nearby places for each recommended tag
      const nearbyPlacesPromises = recommendations.map(async (tag) => {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
          params: {
            location: location, // Use the provided location
            radius: 5000, // Search within 5km
            type: tag, // Use the recommended tag as the place type
            key: process.env.GOOGLE_PLACES_API_KEY, // Your Google Places API key
          },
        });
        return {
          tag,
          places: response.data.results,
        };
      });
  
      // Wait for all API calls to complete
      const nearbyPlaces = await Promise.all(nearbyPlacesPromises);
      
      // Step 4: Transform nearbyPlaces into an object grouped by tag
      const groupedPlaces = nearbyPlaces.reduce((acc, { tag, places }) => {
        acc[tag] = places; // Group places by tag
        return acc;
      }, {});
      console.log(groupedPlaces)
      // Step 5: Format the response
      const response = {
        user_id: req.userId,
        recommended_tags: recommendations,
        nearby_places: groupedPlaces, // Use the grouped places object
      };
  
      // Send the response
      res.json(response);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      res.status(500).json({
        error: 'Failed to fetch nearby places',
        details: error.message,
      });
    }
  });

export default router;