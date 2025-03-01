import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Star,
  Heart,
  Share2,
  SlidersHorizontal,
  Users,
  Clock,
  Sun,
  DollarSign,
  Loader
} from 'lucide-react';
import {axiosInstance} from '../../constants/urls';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State for recommendations and places
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  }, []);

  // Fetch recommendations and places when location is available
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userLocation) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/explore/nearby/${userLocation.lat},${userLocation.lng}`
        );

        const { recommended_tags, nearby_places } = response.data;
        setRecommendedTags(recommended_tags);
        setNearbyPlaces(nearby_places);
        setSelectedCategory(recommended_tags[0]); // Select first category by default
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userLocation]);

  // Filter places based on search query
  const getFilteredPlaces = () => {
    if (!selectedCategory || !nearbyPlaces[selectedCategory]) return [];
    
    return nearbyPlaces[selectedCategory].filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.vicinity && place.vicinity.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const formatPlaceType = (type: string) => {
    return type.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2">Getting your location...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2">Finding great places near you...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-xl font-semibold">Error</p>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Nearby</h1>
        <p className="text-gray-600">Discover amazing places around your location</p>
      </div>

      {/* Search and Categories */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search places by name or location..."
              className="w-full px-4 py-2 pl-10 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-emerald-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {recommendedTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedCategory(tag)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === tag
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              {formatPlaceType(tag)}
            </button>
          ))}
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredPlaces().map(place => (
          <motion.div
            key={place.place_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden group"
          >
            <div className="relative">
              <img 
                src={place.photos?.[0]?.photo_reference 
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
                  : "https://via.placeholder.com/400"} 
                alt={place.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded-full text-sm font-medium text-gray-800">
                {formatPlaceType(selectedCategory || '')}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{place.name}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{place.vicinity}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{place.rating || 'N/A'}</span>
                  {place.user_ratings_total > 0 && (
                    <span className="ml-1 text-gray-400">({place.user_ratings_total})</span>
                  )}
                </div>
                {place.price_level && (
                  <div className="text-gray-600">{"$".repeat(place.price_level)}</div>
                )}
              </div>

              {place.opening_hours && (
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                    place.opening_hours.open_now 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-emerald-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  onClick={() => {
                    if (place.geometry?.location) {
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`,
                        '_blank'
                      );
                    }
                  }}
                >
                  View on Map
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {getFilteredPlaces().length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No places found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setShowFilters(false);
            }}
            className="mt-4 text-emerald-600 hover:text-emerald-700"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}