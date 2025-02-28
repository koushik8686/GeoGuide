import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Timer, IndianRupee, Map, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function CurrentTripCard({ trip, onCancelTrip, onCompleteTrip }) {
  const [timeElapsed, setTimeElapsed] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  
  useEffect(() => {
    if (!trip || !trip.tripStartTime) return;
    
    const startDate = new Date(trip.tripStartTime);
    
    const updateTimeElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeElapsed(`${days}d ${hours}h ${minutes}m`);
    };

    updateTimeElapsed();
    const interval = setInterval(updateTimeElapsed, 60000);

    return () => clearInterval(interval);
  }, [trip]);

  const handleCompleteTrip = async () => {
    if (!trip || isCompleting) return;
    
    setIsCompleting(true);
    try {
      await onCompleteTrip(trip._id);
    } catch (error) {
      console.error('Failed to complete trip:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!trip) return null;

  // Calculate total spending by category
  const spendingByCategory = trip.transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Current Trip: {trip.tripName}</h2>
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {trip.StartLocation} {trip.EndLocation ? `to ${trip.EndLocation}` : ''}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(trip.tripStartTime).toLocaleDateString()}
              {trip.tripEndTime && ` - ${new Date(trip.tripEndTime).toLocaleDateString()}`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onCancelTrip(trip._id)}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
            disabled={isCompleting}
          >
            <AlertCircle className="w-4 h-4" />
            Cancel Trip
          </button>
          <button 
            onClick={handleCompleteTrip}
            disabled={isCompleting}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            {isCompleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Trip
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Timer className="w-6 h-6 text-emerald-600" />
            <span className="text-sm text-emerald-600">Time Elapsed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{timeElapsed}</p>
          <p className="text-sm text-gray-600 mt-1">Trip in Progress</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <IndianRupee className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-blue-600">Spent So Far</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{trip.spentAmount || 0}</p>
          <p className="text-sm text-gray-600 mt-1">of ₹{trip.budget} budget</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Map className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-purple-600">Places Visited</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{trip.visitedPlaces?.length || 0}</p>
          <p className="text-sm text-gray-600 mt-1">of {trip.plannedPlaces?.length || 0} planned</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
            <span className="text-sm text-yellow-600">Trip Type</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{trip.trip_type}</p>
          <p className="text-sm text-gray-600 mt-1">Journey</p>
        </div>
      </div>

      {trip.transactions.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {trip.transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-600">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-medium text-gray-800">{transaction.receiver}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm px-2 py-1 rounded bg-gray-100">
                    {transaction.category}
                  </span>
                  <span className="font-semibold text-gray-800">
                  ₹{transaction.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CurrentTripCard;
