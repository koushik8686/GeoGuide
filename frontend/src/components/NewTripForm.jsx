import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../constants/urls';
import Cookie from 'js-cookie';

const NewTripForm = ({ onClose, onTripCreated }) => {
  const [formData, setFormData] = useState({
    tripName: '',
    StartLocation: '',
    EndLocation: '',
    budget: '',
    type: '',
    tripStartTime: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = Cookie.get('jwt_token');
      console.log('Token:', token); // Debug log

      const response = await axios.post(
        `${API_BASE_URL}/api/trips/creates`,
        {
          tripName: formData.tripName,
          tripStartTime: formData.tripStartTime,
          StartLocation: formData.StartLocation,
          EndLocation: formData.EndLocation,
          type: formData.type,
          budget: Number(formData.budget)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Response status:', response.status); // Debug log

      const data = response.data;
      console.log('Response data:', data); // Debug log

      if (!response.data.ok) {
        throw new Error(data.message || 'Failed to create trip');
      }

      onTripCreated(data);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Plan New Trip</h2>
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Location
            </label>
            <input
              type="text"
              name="StartLocation"
              value={formData.StartLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Location
            </label>
            <input
              type="text"
              name="EndLocation"
              value={formData.EndLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Trip
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
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
              className={`px-4 py-2 bg-emerald-600 text-white rounded-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewTripForm;
