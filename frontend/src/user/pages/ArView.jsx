import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Compass, Navigation, Cloud, Wind, Thermometer, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Weather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(import.meta.env.VITE_WEATHER_API_KEY)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28412fb167c07b40f03f1e004d82ef15&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };
  
  
    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  if (loading) return <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">Loading weather...</div>;
  if (error) return <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg text-red-500">{error}</div>;
  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-red-500" />
          <span>{Math.round(weather.main.temp)}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-500" />
          <span className="capitalize">{weather.weather[0].description}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-emerald-500" />
          <span>{weather.wind.speed} m/s</span>
        </div>
      </div>
    </motion.div>
  );
};

const StreetViewAR = () => {
  const { lat, lng } = useParams();
  console.log(lat , lng)
  const navigate = useNavigate();
  const streetViewRef = useRef(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaces, setShowPlaces] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const panoramaRef = useRef(null);

  useEffect(() => {
    // Load Google Maps JavaScript API
    const loadStreetView = (lat, lng) => {
        const google = window.google;
  
        const map = new google.maps.Map(streetViewRef.current, {
          center: { lat, lng },
          zoom: 18,
        });
  
        new google.maps.StreetViewPanorama(streetViewRef.current, {
          position: { lat, lng },
          pov: {
            heading: 34,
            pitch: 10,
          },
          zoom: 1,
        });
  
        map.setStreetView(streetViewRef.current);
      };
  
    if (lat && lng) {
      loadStreetView(Number(lat), Number(lng)); // Convert string to number (lat , lng)
    }
  }, []);

  const handlePlaceClick = (place) => {
    if (place.geometry && streetViewRef.current) {
      const panorama = new window.google.maps.StreetViewPanorama(streetViewRef.current, {
        position: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        pov: {
          heading: 34,
          pitch: 10,
        },
        zoom: 1
      });
      setSelectedPlace(place);
    }
  };

  const resetCompass = () => {
    if (panoramaRef.current) {
      panoramaRef.current.setPov({
        heading: 34,
        pitch: 0
      });
    }
  };

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Street View Container */}
      <div ref={streetViewRef} className="h-full w-full" />

      <div className="absolute z-50 top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <a href="/user">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="bg-white/90 p-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>
            Back</span>
        </motion.button>
        </a>
        <div className="flex items-center gap-4">
          <Weather lat={parseFloat(lat)} lon={parseFloat(lng)} />
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={resetCompass}
            className="bg-white/90 p-2 rounded-lg hover:bg-white transition-colors"
            title="Reset compass"
          >
            <Compass className="w-5 h-5" />
          </motion.button>
        </div>

        <motion.button
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setShowPlaces(!showPlaces)}
          className="bg-white/90 p-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
        >
          <MapPin className="w-5 h-5" />
          <span>Nearby</span>
        </motion.button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading Street View...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p>{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Nearby Places Sidebar */}
     
    </div>
  );
};

export default StreetViewAR;

