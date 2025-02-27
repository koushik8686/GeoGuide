import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Wallet,
  Navigation,
  Bell,
  Search,
  User,
  Settings,
  TrendingUp,
  Map,
  Heart,
  Clock,
  Sun,
  CloudRain,
  Wind,
  Mic,
  Send,
  DollarSign,
  Timer,
  CheckCircle,
  AlertCircle,
  Cloud
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../constants/urls';
import { api } from '../services/api';
import NewTripForm from '../components/NewTripForm';
import { Link } from 'react-router-dom';

function WeatherCard({ city, weather }) {
  if (!weather) return null;

  // Map weather conditions to icons
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return Sun;
      case 'Rain':
        return CloudRain;
      case 'Clouds':
        return Cloud;
      case 'Wind':
        return Wind;
      default:
        return Sun;
    }
  };

  const WeatherIcon = getWeatherIcon(weather.weather[0].main);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{city}</h3>
        <WeatherIcon className="w-8 h-8 text-emerald-500" />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
        <p className="text-gray-600 capitalize">{weather.weather[0].description}</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
          <div>
            <p>Humidity</p>
            <p className="font-medium">{weather.main.humidity}%</p>
          </div>
          <div>
            <p>Wind</p>
            <p className="font-medium">{weather.wind.speed} m/s</p>
          </div>
          <div>
            <p>Feels Like</p>
            <p className="font-medium">{Math.round(weather.main.feels_like)}°C</p>
          </div>
          <div>
            <p>Visibility</p>
            <p className="font-medium">{(weather.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TripCard({ image, title, date, location }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-4 right-4">
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {date}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {location}
        </div>
      </div>
    </motion.div>
  );
}

function ExpenseCard({ category, amount, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-600">{category}</h3>
        <span className={`text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{amount}</p>
    </motion.div>
  );
}

function RecommendationCard({ image, title, rating, price }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
          <span className="text-emerald-600 font-semibold">{price}</span>
        </div>
      </div>
    </motion.div>
  );
}

function CurrentTripCard({ trip }) {
  const [timeElapsed, setTimeElapsed] = useState('');

  useEffect(() => {
    const startDate = new Date('2024-03-10T00:00:00');
    
    const updateTimeElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeElapsed(`${days}d ${hours}h ${minutes}m`);
    };

    updateTimeElapsed();
    const interval = setInterval(updateTimeElapsed, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Current Trip: Tokyo Explorer</h2>
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Tokyo, Japan
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Mar 10 - Mar 20, 2024
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Report Issue
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Complete Trip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Timer className="w-6 h-6 text-emerald-600" />
            <span className="text-sm text-emerald-600">Time Elapsed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{timeElapsed}</p>
          <p className="text-sm text-gray-600 mt-1">of 10 days total</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-blue-600">Spent So Far</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">$1,250</p>
          <p className="text-sm text-gray-600 mt-1">of $3,000 budget</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Map className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-purple-600">Places Visited</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">8</p>
          <p className="text-sm text-gray-600 mt-1">of 15 planned</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
            <span className="text-sm text-yellow-600">Trip Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">65%</p>
          <div className="w-full h-2 bg-yellow-100 rounded-full mt-2">
            <div className="w-[65%] h-full bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Itinerary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">9:00 AM</span>
              <span className="font-medium text-gray-800">Tsukiji Fish Market Tour</span>
            </div>
            <span className="text-sm text-emerald-600">Completed</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">2:00 PM</span>
              <span className="font-medium text-gray-800">Sensoji Temple Visit</span>
            </div>
            <span className="text-sm text-blue-600">In Progress</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">7:00 PM</span>
              <span className="font-medium text-gray-800">Shibuya Crossing & Dinner</span>
            </div>
            <span className="text-sm text-gray-600">Upcoming</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SearchResultCard({ place }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        {place.photos && place.photos[0] && (
          <img
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=AIzaSyBvB2LJE5tjlh4scJ3flCjWfBNzfAVSre0`}
            alt={place.name}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {place.distance && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {place.distance.formatted} away
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{place.name}</h3>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">{'★'.repeat(Math.round(place.rating || 0))}</span>
          <span className="text-gray-600 ml-2">({place.user_ratings_total || 0} reviews)</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {place.vicinity}
        </div>
        <div className="flex justify-between items-center">
          <Link
            target="_blank"
            to={`/ar/${place.geometry.location.lat}/${place.geometry.location.lng}`}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            Explore in AR
          </Link>
          {place.opening_hours && (
            <span className={`text-sm ${place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
              {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [weather, setWeather] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5); // in kilometers

  useEffect(() => {
    const getPlaceName = async (lat, lng) => {
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      console.log("api" ,apiKey)
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    
      try {
        const response = await axios.get(url);
        const placeName = response.data.results[5]?.formatted_address;
        setLocation(placeName);
      } catch (error) {
        console.error('Error fetching place name:', error);
      }
    };
    const fetchWeather = async (lat , lon) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28412fb167c07b40f03f1e004d82ef15&units=metric`
        );
        console.log(response.data)
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };
  
    // Get user's current location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          getPlaceName(position.coords.latitude, position.coords.longitude);
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setVoiceError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setVoiceError('Geolocation is not supported by your browser');
    }
  }, []);

  useEffect(() => {
    const fetchCurrentTrip = async () => {
      try {
        const trip = await api.getCurrentTrip();
        setCurrentTrip(trip);
      } catch (error) {
        console.error('Error fetching current trip:', error);
      }
    };
    fetchCurrentTrip();
  }, []);

  const handleLocationSearch = async () => {
    if (!searchQuery.trim() || !userLocation) return;
    
    setIsSearching(true);
    setVoiceError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/places/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&query=${encodeURIComponent(searchQuery)}&radius=${searchRadius * 1000}`
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

      // Log the response for debugging
      console.log('Places API Response:', {
        query: data.metadata.query,
        types: data.metadata.searchTypes,
        totalResults: data.metadata.totalResults,
        apiStatus: data.metadata.apiStatus
      });
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

  const handleTripCreated = async () => {
    const trip = await api.getCurrentTrip();
    setCurrentTrip(trip);
  };
 
  
  return (
    <div>
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
      {currentTrip && <CurrentTripCard trip={currentTrip} />}

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
      <motion.div
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
      </motion.div>

      {/* Expenses Overview */}
      <motion.div 
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
      </motion.div>

      {/* Recommended Destinations */}
      <motion.div
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
      </motion.div>
    </div>
  );
}