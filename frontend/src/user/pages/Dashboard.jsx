import { useDispatch, useSelector } from 'react-redux';
import { setWeather, setLocation, setUserLocation, setLoading, setError } from '../../redux/slices/weatherSlice';
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search,
  Mic,
  TrendingUp,
  Compass
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../constants/urls';

// Import components
import WeatherCard from '../components/WeatherCard';
import TripCard from '../components/TripCard';
import ExpenseCard from '../components/ExpenseCard';
import RecommendationCard from '../components/RecommendationCard';
import SearchResultCard from '../components/SearchResultCard';
import CurrentTripCard from '../components/CurrentTripCard';
import NewTripForm from '../../components/NewTripForm';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

const getLatLngFromPlace = async (placeName) => {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: placeName,
        key: apiKey,
      },
    });

    const { results } = response.data;

    if (results.length === 0) {
      throw new Error('No results found for the given place name.');
    }

    const { lat, lng } = results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error('Error fetching geocoordinates:', error.message);
    throw error;
  }
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { weather, location, userLocation, loading } = useSelector((state) => state.weather);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripLoading, setTripLoading] = useState(false);
  const [tripError, setTripError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5);
  const [customLocation, setCustomLocation] = useState({
    placeName: '',
    lat: '',
    lng: ''
  });

  useEffect(() => {
    const initializeLocation = async () => {
      if (!userLocation && navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          
          const { latitude, longitude } = position.coords;
          dispatch(setUserLocation({
            lat: latitude,
            lng: longitude
          }));
          await getPlaceName(latitude, longitude);
          await fetchWeather(latitude, longitude);
        } catch (error) {
          console.error('Error getting location:', error);
          setVoiceError('Unable to get your location. Please enable location services.');
        }
      }
    };
    const fetchCurrentTrip = async () => {
      setTripLoading(true);
      setTripError(null);
      try {
        const response = await axiosInstance.get('/api/trips/current');
        console.log(response.data)
        setCurrentTrip(response.data);
      } catch (error) {
        console.error('Failed to fetch current trip:', error);
        setTripError(error.response?.data?.message || 'Failed to fetch current trip');
      } finally {
        setTripLoading(false);
      }
    };
    initializeLocation();
    // setInterval(() => {
      fetchCurrentTrip();
    // }, 3000);
  }, [dispatch]);

  useEffect(() => {
    // Fetch current trip when component mounts
    const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
    if (userId) {
      // dispatch(fetchCurrentTrip(userId));
    }
  }, [dispatch]);

  const handleCustomLocationSearch = async () => {
    if (!customLocation.placeName.trim()) {
      setVoiceError("Please enter a place name");
      return;
    }

    dispatch(setLoading(true));
    try {
      const { lat, lng } = await getLatLngFromPlace(customLocation.placeName);
      dispatch(setUserLocation({ lat, lng }));
      await getPlaceName(lat, lng);
      await fetchWeather(lat, lng);
      if (searchQuery.trim()) {
        await handleLocationSearch();
      }
      setVoiceError("");
    } catch (error) {
      console.error('Error searching custom location:', error);
      setVoiceError("Failed to find the specified location. Please try a different place name.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getPlaceName = async (lat, lng) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      const placeName = response.data.results[5]?.formatted_address;
      dispatch(setLocation(placeName));
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
  };

  const fetchWeather = async (lat, lon) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28412fb167c07b40f03f1e004d82ef15&units=metric`
      );
      dispatch(setWeather(response.data));
    } catch (error) {
      console.error('Error fetching weather:', error);
      dispatch(setWeather(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLocationSearch = async () => {
    if (!searchQuery.trim() || !userLocation) return;
    
    setIsSearching(true);
    setVoiceError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/places/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&query=${encodeURIComponent(searchQuery)}&radius=${searchRadius * 1000}`,
        {
          credentials: 'include'
        }
      );
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        setVoiceError(data.error || 'Failed to search locations');
        setSearchResults([]);
        return;
      }
      
      if (data.results.length === 0) {
        setVoiceError(`No ${searchQuery} found within ${searchRadius}km of your location`);
        setSearchResults([]);
      } else {
        setSearchResults(data.results || []);
        setVoiceError("");
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setVoiceError("Failed to search locations. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const startVoiceInput = () => {
    setVoiceError("");
    
    if (!userLocation) {
      setVoiceError("Please enable location services to search nearby places");
      return;
    }
    
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceError("Voice recognition is not supported in your browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError("");
    };

    recognition.onend = () => {
      setIsListening(false);
      handleLocationSearch();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(transcript);
      setSearchQuery(transcript);
      // Automatically trigger search after voice input
      handleLocationSearch();
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceError(`Error: ${event.error}`);
      console.error('Speech recognition error:', event.error);
    };

    try {
      recognition.start();
    } catch (error) {
      setVoiceError("Error starting voice recognition");
      console.error('Error starting recognition:', error);
    }
  };

  const handleTripCreated = async (newTrip) => {
    setShowNewTripForm(false);
    // Fetch updated current trip after creation
    const userId = localStorage.getItem('userId');
    if (userId) {
      // dispatch(fetchCurrentTrip(userId));
    }
    fetchCurrentTrip();
  };

  const handleCancelTrip = async (tripId) => {
    try {
      await axiosInstance.delete(`/api/trips/${tripId}`);
      setCurrentTrip(null);
    } catch (error) {
      console.error('Failed to cancel trip:', error);
      setTripError(error.response?.data?.message || 'Failed to cancel trip');
    }
  };

  const handleCompleteTrip = async (tripId) => {
    try {
      await axiosInstance.post(`/api/trips/complete/${tripId}`);
      setCurrentTrip(null);
    } catch (error) {
      console.error('Failed to complete trip:', error);
      setTripError(error.response?.data?.message || 'Failed to complete trip');
    }
  };

  return (
    <div>
      {/* Custom Location Search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          Search at Different Location
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Place Name
            </label>
            <input
              type="text"
              value={customLocation.placeName}
              onChange={(e) => setCustomLocation(prev => ({ ...prev, placeName: e.target.value }))}
              placeholder="Enter city, landmark, or address"
              className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={handleCustomLocationSearch}
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 h-[42px] self-end"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </span>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Set Location
              </>
            )}
          </button>
        </div>
        {voiceError && (
          <p className="mt-2 text-sm text-red-600">{voiceError}</p>
        )}
      </motion.div>

      {/* Enhanced Search Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for? (e.g., restaurants, beaches)"
              className="w-full px-4 py-3 pl-12 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`p-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-50 text-red-600 animate-pulse'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              title={voiceError || "Click to start voice input"}
            >
              <Mic className="w-6 h-6" />
            </button>
            <button
              onClick={handleLocationSearch}
              disabled={isSearching || !searchQuery.trim()}
              className={`px-6 py-3 bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isSearching || !searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
              }`}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </span>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find Places
                </>
              )}
            </button>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="distance" className="text-sm font-medium text-gray-700">
              Search Radius: {searchRadius} km
            </label>
            <span className="text-xs text-gray-500">
              {searchRadius === 1 ? '1 kilometer' : `${searchRadius} kilometers`}
            </span>
          </div>
          <input
            type="range"
            id="distance"
            min="1"
            max="50"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {voiceError && (
          <p className="mt-2 text-sm text-red-600">{voiceError}</p>
        )}
        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(place => (
                  <SearchResultCard key={place.place_id} place={place} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Alex!</h1>
          <p className="text-gray-600">Plan your next adventure</p>
        </div>
        <button 
          onClick={() => setShowNewTripForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Plan New Trip
        </button>
      </motion.div>

      {/* Weather Updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <WeatherCard city={location} weather={weather} />
      </div>

      {/* Current Trip Section */}
      <CurrentTripCard 
        trip={currentTrip}
        loading={tripLoading}
        error={tripError}
        onCancelTrip={handleCancelTrip}
        onCompleteTrip={handleCompleteTrip}
      />

      {/* New Trip Form Modal */}
      <AnimatePresence>
        {showNewTripForm && (
          <NewTripForm
            onClose={() => setShowNewTripForm(false)}
            onTripCreated={handleTripCreated}
          />
        )}
      </AnimatePresence>

      {/* Upcoming Trips */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TripCard
            image="https://images.unsplash.com/photo-1499856871958-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
            title="Paris Adventure"
            date="May 15 - May 22, 2024"
            location="Paris, France"
          />
          <TripCard
            image="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2487&auto=format&fit=crop"
            title="Tokyo Explorer"
            date="June 10 - June 20, 2024"
            location="Tokyo, Japan"
          />
          <TripCard
            image="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop"
            title="New York City Break"
            date="July 5 - July 12, 2024"
            location="New York, USA"
          />
        </div>
      </motion.div> */}

      {/* Expenses Overview */}
      {/* <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-8 mb-8"
      >
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Travel Expenses</h2>
          <div className="grid grid-cols-2 gap-4">
            <ExpenseCard category="Accommodation" amount="$2,450" trend={-5} />
            <ExpenseCard category="Transportation" amount="$850" trend={12} />
            <ExpenseCard category="Food & Dining" amount="$620" trend={-2} />
            <ExpenseCard category="Activities" amount="$340" trend={8} />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Spending Analytics</h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-xl shadow-lg h-[calc(100%-32px)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Monthly Overview</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              Chart Visualization
            </div>
          </motion.div>
        </div>
      </motion.div> */}

      {/* Recommended Destinations */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <RecommendationCard
            image="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
            title="Bali Paradise Resort"
            rating={4.8}
            price="$180/night"
          />
          <RecommendationCard
            image="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop"
            title="Swiss Alps Adventure"
            rating={4.9}
            price="$250/night"
          />
          <RecommendationCard
            image="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2074&auto=format&fit=crop"
            title="Venice Canal Tour"
            rating={4.7}
            price="$120/night"
          />
          <RecommendationCard
            image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
            title="Dubai Luxury Stay"
            rating={4.9}
            price="$350/night"
          />
        </div>
      </motion.div> */}
    </div>
  );
}