import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../constants/urls';
import Cookie from 'js-cookie';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Palmtree, 
  Building, 
  Mountain, 
  Waves, 
  LandPlot,
  Send,
  Loader,
  Navigation
} from 'lucide-react';

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

// Haversine formula to calculate distance between two coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const NewTripForm = ({ onClose, onTripCreated }) => {
  const [formData, setFormData] = useState({
    tripName: '',
    StartLocation: '',
    EndLocation: '',
    budget: '',
    selectedInterests: [],
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    days: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({
        ...prev,
        days: diffDays > 0 ? diffDays : 1
      }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate coordinates and distance before submitting
      const fetchCoordinates = async (location) => {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            location
          )}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
        );

        if (response.data.status === 'OK' && response.data.results[0]?.geometry?.location) {
          const { lat, lng } = response.data.results[0].geometry.location;
          return { lat, lng };
        }
        throw new Error('Unable to fetch coordinates for the location.');
      };

      const [startCoords, endCoords] = await Promise.all([
        fetchCoordinates(formData.StartLocation),
        fetchCoordinates(formData.EndLocation)
      ]);

      const distance = haversineDistance(
        startCoords.lat,
        startCoords.lng,
        endCoords.lat,
        endCoords.lng
      );

      const token = Cookie.get('jwt_token');
      const response = await axios.post(
        `${API_BASE_URL}/api/trips/create`,
        {
          tripName: formData.tripName,
          tripStartTime: `${formData.startDate}T${formData.startTime}`,
          tripEndTime: `${formData.endDate}T${formData.endTime}`,
          StartLocation: formData.StartLocation,
          EndLocation: formData.EndLocation,
          budget: Number(formData.budget),
          interests: formData.selectedInterests,
          distance: distance,
          coordinates: {
            start: startCoords,
            end: endCoords
          }
        },
        {
          withCredentials: true
        }
      );

      if (!response.data.ok) {
        throw new Error(response.data.message || 'Failed to create trip');
      }

      onTripCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating trip:', error);
      setError(error.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter(id => id !== interestId)
        : [...prev.selectedInterests, interestId]
    }));
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl my-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Plan New Trip</h2>
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Send size={18} className="mr-2 text-emerald-600" />
                Trip Name
              </label>
              <input
                type="text"
                name="tripName"
                value={formData.tripName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MapPin size={18} className="mr-2 text-emerald-600" />
                Start Location
              </label>
              <input
                type="text"
                name="StartLocation"
                value={formData.StartLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                placeholder="Enter start location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Navigation size={18} className="mr-2 text-emerald-600" />
                End Location
              </label>
              <input
                type="text"
                name="EndLocation"
                value={formData.EndLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                placeholder="Enter destination"
              />
            </div>
          </div>

          {/* Interests Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Palmtree size={18} className="mr-2 text-emerald-600" />
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <div
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`cursor-pointer px-3 py-1.5 rounded-full flex items-center text-sm transition-colors ${
                    formData.selectedInterests.includes(interest.id)
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    {interest.icon}
                    <span className="ml-1">{interest.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar size={18} className="mr-2 text-emerald-600" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar size={18} className="mr-2 text-emerald-600" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min={formData.startDate}
                required
              />
            </div>
          </div>

          {/* Times Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock size={18} className="mr-2 text-emerald-600" />
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock size={18} className="mr-2 text-emerald-600" />
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Budget Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Building size={18} className="mr-2 text-emerald-600" />
              Budget
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {formData.startDate && formData.endDate && formData.days > 0 && (
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-emerald-800 text-sm">
                Your trip is {formData.days} day{formData.days !== 1 ? 's' : ''} long, from {formatDate(formData.startDate)} to {formatDate(formData.endDate)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={18} />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={18} />
                  Create Trip
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewTripForm;