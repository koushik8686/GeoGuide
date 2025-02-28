import React from 'react';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default TripCard;
