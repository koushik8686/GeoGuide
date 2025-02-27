import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, DollarSign } from 'lucide-react';
import { tourPackages } from '../data';
import Header from '../components/Header';

export default function PackageDetail() {
  const { id } = useParams();
  const pkg = tourPackages.find(p => p.id === id);

  if (!pkg) return <div>Package not found</div>;

  return (
    <div className="space-y-6">
      <Header title="Tour Package Details" />
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative h-80">
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{pkg.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                {pkg.destination}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5" />
                {pkg.duration}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                ${pkg.price}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
              <p className="text-gray-600">
                Experience the beauty of {pkg.destination} with our carefully curated {pkg.duration} tour package.
                This package includes accommodation, guided tours, and local experiences.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Participants</h2>
              <div className="space-y-4">
                {pkg.participants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={`https://ui-avatars.com/api/?name=${participant.name}&background=random`}
                      alt={participant.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{participant.name}</h3>
                      <p className="text-sm text-gray-500">Joined on {new Date(participant.joinedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">Package Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium">{pkg.participants.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                  Edit Package
                </button>
                <button className="w-full bg-indigo-500 px-4 py-2 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                  View Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}