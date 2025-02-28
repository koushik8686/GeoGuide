import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default RecommendationCard;
