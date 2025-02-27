import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/urls';
import { ArrowLeft, Compass, Eye, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AR() {
  const location = useLocation();
  const navigate = useNavigate();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streetView, setStreetView] = useState(null);
  const [viewMode, setViewMode] = useState('street'); // 'street' or 'satellite'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const placeId = params.get('placeId');

    if (!placeId) {
      setError('No place ID provided');
      setLoading(false);
      return;
    }

    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/places/details/${placeId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch place details');
        }

        setPlaceDetails(data);
        initializeStreetView(data.geometry.location);
      } catch (err) {
        console.error('Error fetching place details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [location]);

  const initializeStreetView = (location) => {
    if (!window.google || !location) return;

    const panorama = new window.google.maps.StreetViewPanorama(
      document.getElementById('street-view'),
      {
        position: { lat: location.lat, lng: location.lng },
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false,
        motionTracking: true,
        motionTrackingControl: true,
        fullscreenControl: false
      }
    );

    setStreetView(panorama);
  };

  const toggleViewMode = () => {
    if (!placeDetails) return;

    setViewMode(prev => {
      const newMode = prev === 'street' ? 'satellite' : 'street';
      
      if (newMode === 'satellite' && window.google) {
        const map = new window.google.maps.Map(document.getElementById('street-view'), {
          center: placeDetails.geometry.location,
          zoom: 18,
          mapTypeId: 'satellite',
          tilt: 45
        });
      } else {
        initializeStreetView(placeDetails.geometry.location);
      }
      
      return newMode;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Street View Container */}
      <div id="street-view" className="h-full w-full" />

      {/* Overlay Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="bg-white/90 p-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <div className="flex gap-2">
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={toggleViewMode}
            className="bg-white/90 p-2 rounded-lg hover:bg-white transition-colors"
            title={viewMode === 'street' ? 'Switch to Satellite View' : 'Switch to Street View'}
          >
            {viewMode === 'street' ? (
              <MapIcon className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => streetView?.setPosition(placeDetails.geometry.location)}
            className="bg-white/90 p-2 rounded-lg hover:bg-white transition-colors"
            title="Reset View"
          >
            <Compass className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Place Information */}
      {placeDetails && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white"
        >
          <h1 className="text-2xl font-bold mb-2">{placeDetails.name}</h1>
          <p className="text-sm opacity-90">{placeDetails.formatted_address}</p>
        </motion.div>
      )}
    </div>
  );
}
