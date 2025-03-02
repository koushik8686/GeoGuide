const express = require('express');
const router = express.Router();
const axios = require('axios');

// Reverse geocoding endpoint
router.get('/reverse-geocode', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
            // Get the most relevant address component (usually the city/locality)
            const addressComponents = response.data.results[0].address_components;
            let placeName = '';
            
            // Try to find locality (city) first
            const locality = addressComponents.find(
                component => component.types.includes('locality')
            );
            
            // If no locality, try administrative_area_level_1 (state/region)
            const adminArea = addressComponents.find(
                component => component.types.includes('administrative_area_level_1')
            );
            
            placeName = locality ? locality.long_name : 
                       adminArea ? adminArea.long_name : 
                       response.data.results[0].formatted_address;

            res.json({ placeName });
        } else {
            res.status(404).json({ error: 'No results found' });
        }
    } catch (error) {
        console.error('Error in reverse geocoding:', error);
        res.status(500).json({ error: 'Failed to get place name' });
    }
});

module.exports = router;
