const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Middleware for user authentication
const Usermodel = require('../models/User'); // User model for saving preferences

// Google Places API key
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Helper function to extract interests from query
function extractInterests(query) {
  const keywords = ['restaurant', 'park', 'museum', 'cafe', 'bar', 'shopping', 'hotel'];
  return keywords.filter(keyword => query.toLowerCase().includes(keyword));
}

// Helper function to map interests to Google Place types
function mapInterestsToPlaceTypes(interests) {
  const typeMapping = {
    restaurant: 'restaurant',
    park: 'park',
    museum: 'museum',
    cafe: 'cafe',
    bar: 'bar',
    shopping: 'shopping_mall',
    hotel: 'lodging',
  };
  return interests.map(interest => typeMapping[interest] || 'tourist_attraction');
}

// Fetch places from Google Places API
async function fetchPlacesFromGoogle(coordinates, radius, type) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
  const response = await axios.get(url);
  return response.data.results;
}

// Route to fetch nearby places
router.get('/nearby', verifyToken, async (req, res) => {
  try {
    const { lat, lng, query, radius = 5000 } = req.query;
    console.log('Incoming request:', { lat, lng, query, radius });

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Latitude and longitude coordinates are required',
        example: 'GET /api/places/nearby?lat=48.8566&lng=2.3522&query=restaurants',
      });
    }

    // Parse coordinates and radius
    const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const searchRadius = Math.min(Math.max(Number(radius) || 5000, 1000), 50000);

    // Extract interests and map to Google Place types
    let interests = [];
    let searchTypes = ['tourist_attraction']; // Default type
    if (query) {
      interests = extractInterests(query);
      searchTypes = mapInterestsToPlaceTypes(interests);
    }

    // Fetch places from Google Places API
    const placeResults = await Promise.allSettled(
      searchTypes.map(type => fetchPlacesFromGoogle(coordinates, searchRadius, type))
    );

    // Combine and deduplicate results
    const allPlaces = placeResults.reduce((acc, result) => {
      if (result.status === 'fulfilled') {
        return [...acc, ...result.value];
      }
      return acc;
    }, []);

    // Remove duplicates based on place_id
    const uniquePlaces = Array.from(new Map(allPlaces.map(place => [place.place_id, place])).values());

    // Add distance information to each place
    const places = uniquePlaces.map(place => {
      const placeLocation = place.geometry.location;
      const distance = calculateDistance(
        coordinates.lat,
        coordinates.lng,
        placeLocation.lat,
        placeLocation.lng
      );
      return {
        ...place,
        distance: {
          km: distance.toFixed(1),
          formatted: distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`,
        },
      };
    });

    // Sort by rating (descending) and distance (ascending)
    places.sort((a, b) => {
      if (b.rating === a.rating) {
        return parseFloat(a.distance.km) - parseFloat(b.distance.km);
      }
      return b.rating - a.rating;
    });

    // Save user interests to their history
    if (req.userId && interests.length > 0) {
      const user = await Usermodel.findOne({ _id: req.userId });
      if (user) {
        for (const interest of interests) {
          const existingEntry = user.history.find(h => h.tag === interest);
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            user.history.push({ tag: interest, count: 1 });
          }
        }
        await user.save();
      }
    }

    // Return results
    res.json({
      results: places,
      metadata: {
        query: query,
        searchTypes: searchTypes,
        radius: searchRadius,
        totalResults: places.length,
        location: coordinates,
      },
    });
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({
      error: 'Failed to fetch nearby places',
      details: error.message,
    });
  }
});

module.exports = router;