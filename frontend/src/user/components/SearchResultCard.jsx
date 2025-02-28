import React from 'react';
import { Heart, MapPin, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`}
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

export default SearchResultCard;
