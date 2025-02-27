const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Map user-friendly terms to Google Places types
const placeTypeMap = {
    'restaurant': ['restaurant'],
    'food': ['restaurant', 'cafe', 'bakery'],
    'cafe': ['cafe'],
    'coffee': ['cafe'],
    'bar': ['bar', 'night_club'],
    'nightlife': ['bar', 'night_club'],
    'shopping': ['shopping_mall', 'store', 'clothing_store', 'department_store'],
    'mall': ['shopping_mall'],
    'store': ['store', 'clothing_store', 'department_store'],
    'attraction': ['tourist_attraction', 'amusement_park', 'museum', 'art_gallery'],
    'museum': ['museum'],
    'park': ['park', 'amusement_park'],
    'beach': ['natural_feature', 'beach'],
    'nature': ['natural_feature', 'park'],
    'gym': ['gym'],
    'fitness': ['gym'],
    'spa': ['spa', 'beauty_salon'],
    'salon': ['beauty_salon', 'hair_care'],
    'hospital': ['hospital', 'doctor'],
    'medical': ['hospital', 'doctor', 'pharmacy'],
    'pharmacy': ['pharmacy'],
    'airport': ['airport'],
    'bank': ['bank', 'atm'],
    'atm': ['atm'],
    'supermarket': ['supermarket', 'grocery_or_supermarket'],
    'grocery': ['supermarket', 'grocery_or_supermarket'],
    'cinema': ['movie_theater'],
    'movie': ['movie_theater'],
    'entertainment': ['movie_theater', 'amusement_park', 'bowling_alley', 'casino'],
    'gas': ['gas_station'],
    'petrol': ['gas_station'],
    'hotel': ['lodging'],
    'accommodation': ['lodging'],
    'default': ['tourist_attraction', 'restaurant', 'shopping_mall']
};

// Natural language keywords to place types mapping
const keywordToType = {
    'eat': 'restaurant',
    'dining': 'restaurant',
    'drink': 'bar',
    'stay': 'hotel',
    'sleep': 'hotel',
    'shop': 'shopping',
    'buy': 'shopping',
    'visit': 'attraction',
    'see': 'attraction',
    'explore': 'attraction',
    'relax': 'spa',
    'exercise': 'gym',
    'workout': 'gym',
    'watch': 'cinema',
    'movie': 'cinema',
    'groceries': 'supermarket',
    'medicine': 'pharmacy',
    'doctor': 'hospital',
    'withdraw': 'bank',
    'cash': 'atm',
    'fuel': 'gas'
};

router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, query, radius = 5000 } = req.query;

        // Log the incoming request
        console.log('Incoming request:', { lat, lng, query, radius });

        // Validate coordinates
        if (!lat || !lng) {
            console.error('Missing latitude or longitude');
            return res.status(400).json({
                error: 'Latitude and longitude coordinates are required',
                example: 'GET /api/places/nearby?lat=48.8566&lng=2.3522&query=restaurants',
            });
        }

        const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };

        // Validate radius (between 1km and 50km)
        const searchRadius = Math.min(Math.max(Number(radius) || 5000, 1000), 50000);

        // Process the search query to determine place types
        let searchTypes = ['tourist_attraction']; // default type
        if (query) {
            const normalizedQuery = query.toLowerCase().trim();

            // First check for direct matches in placeTypeMap
            if (placeTypeMap[normalizedQuery]) {
                searchTypes = placeTypeMap[normalizedQuery];
            } else {
                // Check for keywords in the query
                for (const [keyword, type] of Object.entries(keywordToType)) {
                    if (normalizedQuery.includes(keyword)) {
                        searchTypes = placeTypeMap[type];
                        break;
                    }
                }
            }
        }

        // Log the search parameters
        console.log('Search parameters:', { coordinates, searchRadius, searchTypes, query });

        // Make parallel requests for each place type
        const placePromises = searchTypes.map((placeType) =>
            axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
                params: {
                    location: `${coordinates.lat},${coordinates.lng}`,
                    radius: searchRadius,
                    type: placeType,
                    keyword: query, // Include the original query as a keyword for better results
                    key: process.env.GOOGLE_PLACES_API_KEY,
                    rankby: 'prominence', // Changed from 'rating' to 'prominence' for better results
                },
            })
        );
       console.log('url : ' , `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${searchRadius}&type=${searchTypes.join('|')}&keyword=${query}&key=${process.env.GOOGLE_PLACES_API_KEY}&rankby=prominence`)
        const responses = await Promise.all(placePromises);

        // Log the responses from Google Places API

        // Combine and deduplicate results
        const allPlaces = responses.reduce((acc, response) => {
            const results = response.data.results || [];
            return [...acc, ...results];
        }, []);

        // Remove duplicates based on place_id
        const uniquePlaces = Array.from(new Map(allPlaces.map((place) => [place.place_id, place])).values());

        // Add distance information to each place
        const places = uniquePlaces.map((place) => {
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

        // Log the final results

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



// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
}

module.exports = router;
