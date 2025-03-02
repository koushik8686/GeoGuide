import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Palmtree, 
  Building, 
  Mountain, 
  Waves, 
  LandPlot, 
  Plane,
  Send,
  Loader,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { axiosInstance } from '../../constants/urls';
import './index.css';

const interests = [
  { id: 'parks', label: 'Parks', icon: <LandPlot size={18} /> },
  { id: 'temples', label: 'Temples', icon: <Building size={18} /> },
  { id: 'museums', label: 'Museums', icon: <Building size={18} /> },
  { id: 'beaches', label: 'Beaches', icon: <Waves size={18} /> },
  { id: 'nature', label: 'Nature', icon: <Mountain size={18} /> },
  { id: 'landmarks', label: 'Landmarks', icon: <MapPin size={18} /> },
  { id: 'food', label: 'Food', icon: <Palmtree size={18} /> },
  { id: 'shopping', label: 'Shopping', icon: <Building size={18} /> },
];

function TripPlan() {
  const [destination, setDestination] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});
  const [error, setError] = useState('');

  // Calculate days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      setDays(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  // Set minimum end date based on start date
  const getMinEndDate = () => {
    if (!startDate) return '';
    return startDate;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays({
      ...expandedDays,
      [dayIndex]: !expandedDays[dayIndex]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!destination || selectedInterests.length === 0 || !startDate || !endDate) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // First, get coordinates for the destination
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          destination
        )}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
      );

      if (geocodeResponse.data.status !== 'OK' || !geocodeResponse.data.results[0]?.geometry?.location) {
        throw new Error('Unable to fetch coordinates for the destination.');
      }

      const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

      // Now make the API call with coordinates
      const response = await axiosInstance.post("/api/deepseek", {
        place: destination,
        coordinates: { latitude: lat, longitude: lng },
        interests: selectedInterests,
        startDate,
        endDate,
        startTime,
        endTime,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data) {
        setItinerary(response.data);
      } else {
        throw new Error('No data received from the server.');
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Plane className="text-blue-500 mr-2" size={32} />
              <h1 className="text-4xl font-bold text-gray-800">Travel Planner</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create your perfect travel itinerary with AI. Tell us where you want to go, what you love, 
              and we'll plan your dream trip.
            </p>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {!loading && !itinerary ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Plan Your Trip</h2>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 p-3 rounded-lg mb-6 flex items-center"
                    >
                      <AlertCircle className="text-red-500 mr-2" size={18} />
                      <p className="text-red-600 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* Destination */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <MapPin size={18} className="mr-2 text-blue-500" />
                            Destination
                          </div>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Where do you want to go?"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          required
                        />
                      </div>
                      
                      {/* Interests */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Palmtree size={18} className="mr-2 text-blue-500" />
                            Interests
                          </div>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest) => (
                            <motion.div
                              key={interest.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleInterest(interest.id)}
                              className={`interest-tag ${
                                selectedInterests.includes(interest.id) ? 'active' : 'inactive'
                              }`}
                            >
                              <div className="flex items-center">
                                {interest.icon}
                                <span className="ml-1">{interest.label}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Trip Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                              <Calendar size={18} className="mr-2 text-blue-500" />
                              Start Date
                            </div>
                          </label>
                          <input
                            type="date"
                            className="form-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                              <Calendar size={18} className="mr-2 text-blue-500" />
                              End Date
                            </div>
                          </label>
                          <input
                            type="date"
                            className="form-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={getMinEndDate()}
                            required
                          />
                        </div>
                      </div>
                      
                      {startDate && endDate && days > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-blue-800 text-sm">
                            Your trip is {days} day{days !== 1 ? 's' : ''} long, from {formatDate(startDate)} to {formatDate(endDate)}
                          </p>
                        </div>
                      )}
                      
                      {/* Daily Schedule */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                              <Clock size={18} className="mr-2 text-blue-500" />
                              Start Time
                            </div>
                          </label>
                          <input
                            type="time"
                            className="form-input"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                              <Clock size={18} className="mr-2 text-blue-500" />
                              End Time
                            </div>
                          </label>
                          <input
                            type="time"
                            className="form-input"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button type="submit" className="btn-primary w-full flex items-center justify-center">
                          <Send size={18} className="mr-2" />
                          Generate Itinerary
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
                  <h3 className="text-xl font-semibold mb-4">Why use our Travel Planner?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white/30 flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5 mr-2">✓</div>
                      <p>AI-powered itineraries tailored to your interests</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white/30 flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5 mr-2">✓</div>
                      <p>Discover hidden gems and local favorites</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white/30 flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5 mr-2">✓</div>
                      <p>Optimize your time with efficient scheduling</p>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Loader size={48} className="text-blue-500" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Creating Your Perfect Itinerary</h2>
                <p className="text-gray-600 mb-8">Our AI is planning your dream trip to {destination}...</p>
                
                <div className="space-y-6 max-w-2xl mx-auto">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card p-4">
                      <div className="shimmer h-6 w-3/4 rounded mb-4"></div>
                      <div className="shimmer h-4 w-full rounded mb-2"></div>
                      <div className="shimmer h-4 w-5/6 rounded mb-2"></div>
                      <div className="shimmer h-4 w-4/6 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Your {days}-Day Itinerary for {destination}</h2>
                    <button 
                      onClick={() => {
                        setItinerary(null);
                        setLoading(false);
                      }}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Plan Another Trip
                    </button>
                  </div>

                  <div className="space-y-6">
                    {itinerary.itinerary.map((day, dayIndex) => (
                      <div key={dayIndex} className="card">
                        <div 
                          className="bg-blue-50 p-4 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleDayExpansion(dayIndex)}
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Day {day.day}</h3>
                            <p className="text-sm text-gray-600">{day.date}</p>
                          </div>
                          {expandedDays[dayIndex] ? 
                            <ChevronUp size={20} className="text-blue-500" /> : 
                            <ChevronDown size={20} className="text-blue-500" />
                          }
                        </div>
                        
                        <AnimatePresence>
                          {expandedDays[dayIndex] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4">
                                {day.activities.map((activity, actIndex) => (
                                  <motion.div
                                    key={actIndex}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: actIndex * 0.1 }}
                                    className="time-block"
                                  >
                                    <div className="font-medium text-gray-500">{activity.time}</div>
                                    <div className="font-semibold text-gray-800">{activity.place}</div>
                                    <div className="text-gray-600 text-sm mt-1">{activity.description}</div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
                  <h3 className="text-xl font-semibold mb-4">Trip Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2 opacity-80" />
                      <p>Destination: <span className="font-medium">{destination}</span></p>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2 opacity-80" />
                      <p>Dates: <span className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</span></p>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2 opacity-80" />
                      <p>Daily Schedule: <span className="font-medium">{startTime} - {endTime}</span></p>
                    </div>
                    <div className="flex items-center">
                      <Palmtree size={18} className="mr-2 opacity-80" />
                      <p>Interests: <span className="font-medium">{selectedInterests.join(', ')}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TripPlan;