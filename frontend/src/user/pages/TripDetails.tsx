import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { axiosInstance } from '../../constants/urls';
import { MapPin, Calendar, Clock, Navigation, IndianRupee, Map } from 'lucide-react';

interface Transaction {
  _id: string;
  receiver: string;
  amount: number;
  category: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface Trip {
  _id: string;
  tripName: string;
  StartLocation: string;
  EndLocation: string;
  tripStartTime: string;
  tripEndTime: string;
  distance: number;
  budget: number;
  spentAmount: number;
  transactions: Transaction[];
  visitedPlaces: string[];
  plannedPlaces: string[];
}

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/trips/${tripId}`);
        setTrip(response.data);
      } catch (err) {
        setError('Failed to fetch trip details');
        console.error('Error fetching trip details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Trip not found'}</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold">{trip.tripName}</h1>
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 opacity-75" />
                <span>{trip.StartLocation} to {trip.EndLocation}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 opacity-75" />
                <span>{formatDate(trip.tripStartTime)} - {formatDate(trip.tripEndTime)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Navigation className="w-8 h-8 text-blue-600" />
                  <span className="text-blue-600 font-medium">Distance</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{Math.round(trip.distance)} km</p>
              </div>

              <div className="bg-emerald-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <IndianRupee className="w-8 h-8 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Budget</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">₹{trip.spentAmount} / ₹{trip.budget}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Map className="w-8 h-8 text-purple-600" />
                  <span className="text-purple-600 font-medium">Places</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {trip.visitedPlaces.length} / {trip.plannedPlaces.length}
                </p>
              </div>
            </div>

            {/* Transactions */}
            {trip.transactions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transactions</h2>
                <div className="space-y-4">
                  {trip.transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.receiver}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                        <span className="font-semibold text-gray-900">₹{transaction.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripDetails;
