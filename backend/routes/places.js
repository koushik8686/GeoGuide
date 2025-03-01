import express from 'express';
import Usermodel from '../models/Usermodel.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Map user-friendly terms to Google Places types
const keywordToType = { 
    // Food & Dining (60 entries)   
    eat: 'restaurant',
    dining: 'restaurant',
    breakfast: 'cafe',
    brunch: 'cafe', 
    lunch: 'restaurant',
    dinner: 'restaurant',
    snack: 'bakery',
    coffee: 'cafe',
    tea: 'tea_house',
    bakery: 'bakery',
    pizza: 'pizza',
    burger: 'burger',
    sushi: 'sushi',
    vegan: 'vegetarian',
    buffet: 'buffet',
    streetfood: 'street_food',
    dessert: 'dessert',
    icecream: 'ice_cream',
    pasta: 'italian',
    steak: 'steakhouse',
    seafood: 'seafood',
    bbq: 'bbq',
    ramen: 'ramen',
    deli: 'deli',
    diner: 'diner',
    foodtruck: 'food_truck',
    foodcourt: 'food_court',
    brewery: 'brewery',
    winery: 'winery',
    juice: 'juice_bar',
    smoothie: 'smoothie',
    salad: 'salad',
    sandwich: 'sandwich',
    dumpling: 'dumpling',
    taco: 'taco',
    curry: 'curry',
    noodles: 'noodle',
    pho: 'pho',
    kebab: 'kebab',
    tapas: 'tapas',
    fondue: 'fondue',
    crepe: 'crepe',
    bagel: 'bagel',
    donut: 'donut',
    pastry: 'pastry',
    chocolate: 'chocolate',
    cheese: 'cheese',
    oliveoil: 'olive_oil',
    spices: 'spices',
    organic: 'organic',
    halal: 'halal',
    kosher: 'kosher',
    glutenfree: 'gluten_free',
  
    // Shopping & Retail (50 entries)
    shop: 'shopping',
    mall: 'shopping_mall',
    boutique: 'boutique',
    supermarket: 'supermarket',
    grocery: 'grocery',
    electronics: 'electronics_store',
    bookstore: 'book_store',
    furniture: 'furniture_store',
    hardware: 'hardware_store',
    florist: 'florist',
    jeweler: 'jewelry_store',
    antiques: 'antique_store',
    toys: 'toy_store',
    sportsgear: 'sporting_goods',
    outdoors: 'outdoor_store',
    cosmetics: 'cosmetics_store',
    pharmacy: 'pharmacy',
    liquor: 'liquor_store',
    petstore: 'pet_store',
    bikeshop: 'bicycle_store',
    eyewear: 'optician',
    tailor: 'tailor',
    drycleaner: 'dry_cleaner',
    market: 'market',
    wholesaler: 'wholesale',
    departmentstore: 'department_store',
    discountstore: 'discount_store',
    thriftstore: 'thrift_store',
    conveniencestore: 'convenience_store',
    giftshop: 'gift_shop',
    artsupplies: 'art_supplies',
    musicalinstruments: 'music_store',
    partysupplies: 'party_supplies',
    shoes: 'shoe_store',
    watches: 'watch_store',
    luggage: 'luggage_store',
    fabric: 'fabric_store',
    nursery: 'plant_nursery',
    farmersmarket: 'farmers_market',
    pawnshop: 'pawn_shop',
    firearms: 'gun_shop',
    tobacco: 'tobacco_shop',
    cannabis: 'cannabis_store',
    vapeshop: 'vape_shop',
  
    // Health & Wellness (40 entries)
    hospital: 'hospital',
    clinic: 'clinic',
    pharmacy: 'pharmacy',
    dentist: 'dentist',
    doctor: 'doctor',
    vet: 'veterinarian',
    gym: 'gym',
    yoga: 'yoga',
    pilates: 'pilates',
    crossfit: 'crossfit',
    spa: 'spa',
    massage: 'massage',
    salon: 'hair_salon',
    barber: 'barber',
    nails: 'nail_salon',
    tanning: 'tanning_salon',
    acupuncture: 'acupuncture',
    chiropractor: 'chiropractor',
    physicaltherapy: 'physical_therapy',
    mentalhealth: 'mental_health',
    optometrist: 'optometrist',
    audiology: 'hearing_aid',
    dialysis: 'dialysis',
    emergencyroom: 'emergency_room',
    urgentcare: 'urgent_care',
    bloodbank: 'blood_bank',
    medicalsupplies: 'medical_supplies',
    orthopedics: 'orthopedic',
    pediatrician: 'pediatrician',
    psychiatrist: 'psychiatrist',
    cosmeticssurgery: 'cosmetic_surgeon',
    dietician: 'dietitian',
    reiki: 'reiki',
    meditation: 'meditation_center',
    seniors: 'senior_center',
    disability: 'disability_service',
    rehab: 'rehabilitation_center',
  
    // Services (40 entries)
    bank: 'bank',
    atm: 'atm',
    post: 'post_office',
    repair: 'repair',
    laundry: 'laundry',
    notary: 'notary',
    storage: 'storage',
    movers: 'movers',
    locksmith: 'locksmith',
    photocopy: 'copy_shop',
    passport: 'passport_office',
    visa: 'visa_center',
    insurance: 'insurance_agency',
    realestate: 'real_estate_agency',
    lawyer: 'lawyer',
    accountant: 'accountant',
    architect: 'architect',
    engineer: 'engineer',
    printer: 'printing',
    signmaker: 'sign_maker',
    caterer: 'caterer',
    eventplanning: 'event_planner',
    funeral: 'funeral_home',
    cemetery: 'cemetery',
    pestcontrol: 'pest_control',
    cleaning: 'cleaning_services',
    security: 'security_services',
    translation: 'translation_services',
    tutoring: 'tutor',
    courier: 'courier_service',
    parking: 'parking',
    carrental: 'car_rental',
    taxi: 'taxi',
    rideshare: 'rideshare',
    boatrental: 'boat_rental',
    bikeshare: 'bicycle_rental',
    scooterrental: 'scooter_rental',
  
    // Education (20 entries)
    school: 'school',
    university: 'university',
    college: 'college',
    library: 'library',
    daycare: 'daycare',
    preschool: 'preschool',
    driving: 'driving_school',
    language: 'language_school',
    musiclessons: 'music_lessons',
    artclass: 'art_classes',
    cookingclass: 'cooking_class',
    computers: 'computer_class',
    dance: 'dance_school',
    martialarts: 'martial_arts_school',
    tradeschool: 'trade_school',
    research: 'research_institute',
    museum: 'museum',
    planetarium: 'planetarium',
    observatory: 'observatory',
    zoo: 'zoo'
  };
  
  const placeTypeMap = {
    // Food & Dining
    restaurant: ['restaurant'],
    cafe: ['cafe'],
    bakery: ['bakery'],
    food_truck: ['food_truck'],
    buffet: ['buffet'],
    steakhouse: ['steak_house'],
    sushi: ['sushi_restaurant'],
    vegetarian: ['vegetarian_restaurant'],
    ice_cream: ['ice_cream_shop'],
    brewery: ['brewery'],
    winery: ['winery'],
    tea_house: ['tea_room'],
  
    // Shopping
    shopping_mall: ['shopping_mall'],
    supermarket: ['supermarket'],
    grocery: ['grocery_or_supermarket'],
    electronics_store: ['electronics_store'],
    book_store: ['book_store'],
    clothing_store: ['clothing_store'],
    jewelry_store: ['jewelry_store'],
    shoe_store: ['shoe_store'],
    furniture_store: ['furniture_store'],
    hardware_store: ['hardware_store'],
    florist: ['florist'],
    pet_store: ['pet_store'],
    liquor_store: ['liquor_store'],
    convenience_store: ['convenience_store'],
  
    // Health
    hospital: ['hospital'],
    clinic: ['clinic'],
    pharmacy: ['pharmacy'],
    dentist: ['dentist'],
    veterinarian: ['veterinary_care'],
    gym: ['gym'],
    spa: ['spa'],
    hair_salon: ['hair_care'],
    nail_salon: ['nail_salon'],
    barber: ['barber'],
  
    // Services
    bank: ['bank'],
    atm: ['atm'],
    post_office: ['post_office'],
    laundry: ['laundry'],
    storage: ['storage'],
    car_rental: ['car_rental'],
    parking: ['parking'],
    taxi: ['taxi_stand'],
  
    // Education
    school: ['school'],
    university: ['university'],
    library: ['library'],
    museum: ['museum'],
    zoo: ['zoo'],
  
    // Government
    city_hall: ['city_hall'],
    courthouse: ['courthouse'],
    embassy: ['embassy'],
    police: ['police'],
    fire_station: ['fire_station'],
  
    // Religious
    church: ['church'],
    mosque: ['mosque'],
    hindu_temple: ['hindu_temple'],
    synagogue: ['synagogue'],
  
    // Entertainment
    movie_theater: ['movie_theater'],
    bowling_alley: ['bowling_alley'],
    casino: ['casino'],
    amusement_park: ['amusement_park'],
    art_gallery: ['art_gallery'],
  
    default: ['establishment', 'point_of_interest']
  };

  // Function to estimate crowd level based on time
  const getCrowdLevel = () => {
    const hour = new Date().getHours();
    if (hour >= 11 && hour <= 14) return 'high'; // Lunch time
    if (hour >= 17 && hour <= 21) return 'high'; // Dinner time
    if (hour >= 9 && hour <= 22) return 'medium'; // Regular hours
    return 'low'; // Early morning or late night
  };

  // Function to extract interests from the query
  const extractInterests = (query) => {
    const normalizedQuery = query.toLowerCase().trim();
    const interests = [];
  
    // Check for all keywords in the query
    for (const [keyword, type] of Object.entries(keywordToType)) {
      if (normalizedQuery.includes(keyword)) {
        interests.push(type);
      }
    }
  
    // If no specific interests are found, use the default types
    return interests.length > 0 ? interests : ['default'];
  };

  // Function to map interests to Google Places types
  const mapInterestsToPlaceTypes = (interests) => {
    const placeTypes = interests.map((interest) => placeTypeMap[interest] || []).flat();
    return placeTypes.length > 0 ? placeTypes : placeTypeMap.default;
  };

  // Function to calculate distance between two coordinates
 
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

  async function analyzeQueryWithAI(query) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
              "content": `You are a location and interest analyzer. Given a search query, extract relevant interests and place types.
              Return a JSON array of interests from these categories:
              - restaurant, cafe, food_truck, buffet
              - shopping_mall, supermarket, store
              - hospital, clinic, pharmacy, gym, spa
              - museum, park, zoo, library
              - movie_theater, bowling_alley, casino
              - bank, atm, post_office
              - school, university
            
              Example:
              Query: "I want to find a good restaurant and maybe visit a museum"
              Response: ["restaurant", "museum"]`
            },
            {
              "role": "user",
              "content": `Analyze this search query and extract interests: ${query}`
            }
          ]
        })
      });

      const responseData = await response.json();
      console.log('AI Analysis Response:', responseData);

      if (responseData.error) {
        console.error('OpenRouter API Error:', responseData.error);
        return null;
      }

      const responseContent = responseData.choices?.[0]?.message?.content;
      if (responseContent) {
        try {
          const jsonMatch = responseContent.match(/\[.*\]/s);
          if (jsonMatch) {
            const interests = JSON.parse(jsonMatch[0]);
            console.log("intrests are " , interests)
            return interests;
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
        }
      }
      return null;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return null;
    }
  }

  // Optimized function to fetch places from Google API
  async function fetchPlacesFromGoogle(coordinates, searchRadius, placeType, interests) {
    console.log("params are" , coordinates , searchRadius , placeType , interests)
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${coordinates.lat},${coordinates.lng}`,
            radius: searchRadius,
            type: placeType,
            keyword: interests.join(' '), // Use extracted interests instead of raw query
            key: process.env.GOOGLE_PLACES_API_KEY,
            rankby: 'prominence',
          },
          timeout: 5000,
        }
      );
      console.log(`final url , https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${searchRadius}&type=${placeType}&keyword=${interests.join(' ')}&key=${process.env.GOOGLE_PLACES_API_KEY} ` )
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching places for type ${placeType}:`, error.message);
      return [];
    }
  }

  // Route to fetch nearby places
  router.get('/nearby', verifyToken, async (req, res) => {
    try {
      const { lat, lng, query, radius = 5000 } = req.query;
      console.log('Incoming request:', { lat, lng, query, radius });

      if (!lat || !lng) {
        console.error('Missing latitude or longitude');
        return res.status(400).json({
          error: 'Latitude and longitude coordinates are required',
          example: 'GET /api/places/nearby?lat=48.8566&lng=2.3522&query=restaurants',
        });
      }

      // Round coordinates for better cache hits
      const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
      const searchRadius = Math.min(Math.max(Number(radius) || 5000, 1000), 50000);

      // Extract interests first
      let interests = [];
      let searchTypes = ['tourist_attraction']; // default type
      
      if (query) {
        // Try AI analysis first
        const aiInterests = await analyzeQueryWithAI(query);
        interests = aiInterests || extractInterests(query);
        console.log('Extracted interests:', interests);
        searchTypes = mapInterestsToPlaceTypes(interests);
        
        // Update user history in parallel
        if (req.userId) {
          const user = await Usermodel.findOne({ _id: req.userId });
          if (user) {
            for (const interest of interests) {
              const existingEntry = user.history.find(h => h.tag === interest);
              if (existingEntry) {
                existingEntry.count += 1;
              } else {
                user.history.push({
                  tag: interest,
                  count: 1
                });
              }
            }
            await user.save();
          }
        }
      }
      
      console.log('Search parameters:', { coordinates, searchRadius, searchTypes, interests });

      // Fetch places with timeout and error handling
      const placeResults = await Promise.allSettled(
        searchTypes.map(placeType => 
          fetchPlacesFromGoogle(coordinates, searchRadius, placeType, interests)
        )
      );

      // Combine and deduplicate results
      const allPlaces = placeResults.reduce((acc, result) => {
        if (result.status === 'fulfilled') {
          return [...acc, ...result.value];
        }
        return acc;
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

export default router;