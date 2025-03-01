import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Timer, IndianRupee, Map, TrendingUp, CheckCircle, AlertCircle, Navigation, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function CurrentTripCard({ trip, onCancelTrip, onCompleteTrip }) {
  const [timeElapsed, setTimeElapsed] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const [tripStatus, setTripStatus] = useState('');
  
  useEffect(() => {
    if (!trip || !trip.tripStartTime) return;
    
    const updateTimeElapsed = () => {
      const now = new Date();
      const startDate = new Date(trip.tripStartTime);
      const endDate = new Date(trip.tripEndTime);

      // Check if trip hasn't started yet
      if (now < startDate) {
        setTimeElapsed('Not yet started');
        setTripStatus('Starts in ' + formatTimeRemaining(now, startDate));
        return;
      }

      // Check if trip has ended
      if (now > endDate) {
        setTimeElapsed('Trip ended');
        setTripStatus('Ended ' + formatTimeRemaining(endDate, now) + ' ago');
        return;
      }

      // Trip is ongoing
      const diff = now.getTime() - startDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeElapsed(`${days}d ${hours}h ${minutes}m`);
      setTripStatus('Trip in Progress');
    };

    updateTimeElapsed();
    const interval = setInterval(updateTimeElapsed, 60000);

    return () => clearInterval(interval);
  }, [trip]);

  const formatTimeRemaining = (from, to) => {
    const diff = Math.abs(to.getTime() - from.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to={`/trip/${trip._id}`} className="group">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 hover:text-blue-600 transition-colors">
              {trip.tripName}
              <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
          </Link>
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {trip.StartLocation} to {trip.EndLocation}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(trip.tripStartTime)} {formatTime(trip.tripStartTime)} - 
              {formatDate(trip.tripEndTime)} {formatTime(trip.tripEndTime)}
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
            <span className="text-sm text-emerald-600">Time Status</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{timeElapsed}</p>
          <p className="text-sm text-gray-600 mt-1">{tripStatus}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <IndianRupee className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-blue-600">Budget Status</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{trip.spentAmount}</p>
          <p className="text-sm text-gray-600 mt-1">of ₹{trip.budget} budget</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Navigation className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-purple-600">Distance</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{Math.round(trip.distance)} km</p>
          <p className="text-sm text-gray-600 mt-1">Total Journey</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
            <span className="text-sm text-yellow-600">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{trip.transactions.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Records</p>
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
