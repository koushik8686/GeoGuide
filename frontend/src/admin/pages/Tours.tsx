import React, { useEffect, useState } from 'react';
import { Plus, Star, Users, Clock } from 'lucide-react';
import { api } from '../services/api';
import type { Tour } from '../types';

const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      const data = await api.tours.getAll();
      setTours(data);
    };
    fetchTours();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Tour Packages
        </h2>
        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md">
          <Plus className="h-4 w-4" /> Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
            <img 
              src={tour.image} 
              alt={tour.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{tour.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">{tour.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{tour.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{tour.currentParticipants}/{tour.maxParticipants}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800">${tour.price}</span>
                <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tours;