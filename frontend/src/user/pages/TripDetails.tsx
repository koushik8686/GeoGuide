import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Bus, Plane, Clock, Calendar, ArrowRight, Star, Filter, Sun, Moon, DollarSign, Wifi, Coffee, Utensils, MapPin, Camera, Navigation, Compass, Sunrise, Sunset, Palmtree, UtensilsCrossed, ShoppingBag, Building, Waves, Landmark, ChevronDown, ChevronUp, Heart, Wallet, CreditCard, Receipt, Cuboid as Cube, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { axiosInstance } from '../../constants/urls';

// Image mapping for places
const placeImages = {
  "Kapaleeshwarar Temple": "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2069&auto=format&fit=crop",
  "San Thome Beach": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop",
  "Karpagambal Mess": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2071&auto=format&fit=crop",
  "Government Museum, Egmore": "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=2070&auto=format&fit=crop",
  "Parthasarathy Temple": "https://images.unsplash.com/photo-1618330834871-dd22c2c23e4f?q=80&w=2070&auto=format&fit=crop",
  "Murugan Idli Shop": "https://images.unsplash.com/photo-1630383249896-483b1fbf831a?q=80&w=2070&auto=format&fit=crop",
  "Marina Beach": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop",
  "Sri Parthasarathy Temple": "https://images.unsplash.com/photo-1618330834871-dd22c2c23e4f?q=80&w=2070&auto=format&fit=crop",
  "Fort St. George": "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop",
  "Amethyst Cafe": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop",
  "Sri Ashtalakshmi Temple": "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2069&auto=format&fit=crop",
  "DakshinaChitra": "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?q=80&w=2070&auto=format&fit=crop",
  "Rayar's Mess": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2071&auto=format&fit=crop",
  "Besant Nagar Beach": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop",
  "Sri Kalikambal Temple": "https://images.unsplash.com/photo-1618330834871-dd22c2c23e4f?q=80&w=2070&auto=format&fit=crop",
  "San Thome Basilica": "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop",
  "Mylapore Heritage Walk": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop",
  "Southern Spice": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2071&auto=format&fit=crop",
  "T. Nagar Market": "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
  "Ramesh Hotel": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  "Mumbai": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=2070&auto=format&fit=crop",
  "Chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop"
};

// Transport option component
interface TransportCardProps {
  type: 'train' | 'bus' | 'flight';
  name: string;
  departure: string;
  arrival: string;
  duration: string;
  airline?: string;
}

function TransportCard({ type, name, departure, arrival, duration, airline }: TransportCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'train':
        return <Train className="w-6 h-6 text-emerald-500" />;
      case 'bus':
        return <Bus className="w-6 h-6 text-blue-500" />;
      case 'flight':
        return <Plane className="w-6 h-6 text-purple-500" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'train':
        return 'from-emerald-50 to-emerald-100 border-emerald-200';
      case 'bus':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'flight':
        return 'from-purple-50 to-purple-100 border-purple-200';
    }
  };

  const isDayTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 6 && hour < 18;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${getGradient()} p-5 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{name}</h3>
            {airline && <p className="text-sm text-gray-600">{airline}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Clock className="w-4 h-4" />
          {duration}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="flex items-center gap-1">
            {isDayTime(departure) ? 
              <Sun className="w-4 h-4 text-amber-500" /> : 
              <Moon className="w-4 h-4 text-indigo-500" />
            }
            <span className={`text-xl font-bold ${isDayTime(departure) ? 'text-amber-500' : 'text-indigo-500'}`}>
              {departure}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Departure</p>
        </div>

        <div className="flex-1 mx-4 relative">
          <div className="h-0.5 bg-gray-300 w-full absolute top-1/2 transform -translate-y-1/2"></div>
          <ArrowRight className="w-5 h-5 text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="text-center">
          <div className="flex items-center gap-1">
            {isDayTime(arrival) ? 
              <Sun className="w-4 h-4 text-amber-500" /> : 
              <Moon className="w-4 h-4 text-indigo-500" />
            }
            <span className={`text-xl font-bold ${isDayTime(arrival) ? 'text-amber-500' : 'text-indigo-500'}`}>
              {arrival}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Arrival</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
        <div className="flex gap-2">
          {type === 'train' && (
            <>
              <span className="px-2 py-1 bg-white rounded-md text-xs text-gray-600 shadow-sm">Sleeper</span>
              <span className="px-2 py-1 bg-white rounded-md text-xs text-gray-600 shadow-sm">AC</span>
            </>
          )}
          {type === 'bus' && (
            <>
              <span className="px-2 py-1 bg-white rounded-md text-xs text-gray-600 shadow-sm">AC</span>
              <span className="px-2 py-1 bg-white rounded-md text-xs text-gray-600 shadow-sm">Sleeper</span>
            </>
          )}
          {type === 'flight' && (
            <>
              <span className="px-2 py-1 bg-white rounded-md text-xs text-gray-600 shadow-sm">Economy</span>
              <span className="px-2 py-1 bg-white rounded-md text-xs text-gray-600 shadow-sm">Direct</span>
            </>
          )}
        </div>
        <button className={`px-3 py-1 rounded-lg text-white text-sm ${
          type === 'train' ? 'bg-emerald-500 hover:bg-emerald-600' :
          type === 'bus' ? 'bg-blue-500 hover:bg-blue-600' :
          'bg-purple-500 hover:bg-purple-600'
        } transition-colors`}>
          Select
        </button>
      </div>
    </motion.div>
  );
}

// Activity card component
interface ActivityCardProps {
  time: string;
  place: string;
  description: string;
  type: string;
  index: number;
}

function ActivityCard({ time, place, description, type, index }: ActivityCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'sightseeing':
        return <Camera className="w-5 h-5 text-teal-500" />;
      case 'meal':
        return <UtensilsCrossed className="w-5 h-5 text-orange-500" />;
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-pink-500" />;
      default:
        return <Compass className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'sightseeing':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'meal':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'shopping':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getImage = () => {
    return placeImages[place] || "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={getImage()} 
          alt={place}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center text-white">
            <Clock className="w-4 h-4 mr-1" />
            <span className="font-medium">{time}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          {getTypeIcon()}
          {place}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors">
            View Details
          </button>
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Day itinerary component
interface DayItineraryProps {
  day: number;
  date: string;
  activities: any[];
}

function DayItinerary({ day, date, activities }: DayItineraryProps) {
  const [isExpanded, setIsExpanded] = useState(day === 1);

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {day}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">Day {day}</h3>
            <p className="text-sm text-gray-600">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{activities.length} activities</span>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {activities.map((activity, index) => (
                <ActivityCard
                  key={`${day}-${index}`}
                  time={activity.time}
                  place={activity.place}
                  description={activity.description}
                  type={activity.type}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Transaction component
interface TransactionProps {
  receiver: string;
  amount: number;
  category: string;
  timestamp: string;
  index: number;
}

function Transaction({ receiver, amount, category, timestamp, index }: TransactionProps) {
  const getCategoryIcon = () => {
    switch (category) {
      case 'accommodation':
        return <Building className="w-5 h-5 text-blue-500" />;
      case 'food':
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case 'transport':
        return <Bus className="w-5 h-5 text-green-500" />;
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-pink-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'accommodation':
        return 'bg-blue-100 text-blue-700';
      case 'food':
        return 'bg-orange-100 text-orange-700';
      case 'transport':
        return 'bg-green-100 text-green-700';
      case 'shopping':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${getCategoryColor()}`}>
            {getCategoryIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{receiver}</h3>
            <p className="text-xs text-gray-500">{formatDate(timestamp)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-red-600">-₹{amount}</p>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Timeline event component
interface TimelineEventProps {
  date: string;
  title: string;
  description?: string;
  type: 'transaction' | 'place' | 'milestone';
  location?: string;
  amount?: number;
  index: number;
}

function TimelineEvent({ date, title, description, type, location, amount, index }: TimelineEventProps) {
  const getEventIcon = () => {
    switch (type) {
      case 'transaction':
        return <Receipt className="w-5 h-5 text-red-500" />;
      case 'place':
        return <MapPin className="w-5 h-5 text-blue-500" />;
      case 'milestone':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  const getEventColor = () => {
    switch (type) {
      case 'transaction':
        return 'bg-red-100 border-red-300';
      case 'place':
        return 'bg-blue-100 border-blue-300';
      case 'milestone':
        return 'bg-green-100 border-green-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative pl-8 pb-8"
    >
      {/* Timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      {/* Timeline dot */}
      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${getEventColor()} flex items-center justify-center border-2`}>
        {getEventIcon()}
      </div>
      
      {/* Content */}
      <div className={`p-4 rounded-lg ${getEventColor()} ml-2`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 shadow-sm">
            {formatDate(date)}
          </span>
        </div>
        
        {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
        
        <div className="flex justify-between items-center">
          {location && (
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </div>
          )}
          
          {amount !== undefined && (
            <span className="text-sm font-medium text-red-600">-₹{amount}</span>
          )}
          
          {type === 'place' && (
            <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
              View in AR
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Add TypeScript interfaces for the travel plan data
interface TravelPlanData {
  status: string;
  plan: {
    source: string;
    destination: string;
    transport: {
      transport: {
        trains: TransportOption[];
        buses: TransportOption[];
        flights: TransportOption[];
      };
    };
    itinerary: {
      itinerary: DayItinerary[];
    };
  };
}

interface TransportOption {
  name: string;
  departure: string;
  arrival: string;
  duration: string;
}

interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
}

interface Activity {
  time: string;
  place: string;
  description: string;
  type: string;
}

interface TripData {
  _id: string;
  tripName: string;
  tripStartTime: string;
  tripEndTime: string;
  StartLocation: string;
  EndLocation: string;
  budget: number;
  spentAmount: number;
  distance: number;
  preferences: string[];
  transactions: Transaction[];
  visitedPlaces: VisitedPlace[];
  plannedPlaces: PlannedPlace[];
  status: 'active' | 'completed' | 'cancelled';
  spendingByCategory: Record<string, number>;
}

interface VisitedPlace {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  visitDate: string;
}

interface PlannedPlace {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface Transaction {
  _id: string;
  receiver: string;
  amount: number;
  category: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  message: string;
}

function TravelOptionsPage() {
  const { id } = useParams<{ id: string }>();
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [travelPlanData, setTravelPlanData] = useState<TravelPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transport' | 'itinerary' | 'details'>('transport');
  const [transportType, setTransportType] = useState<'all' | 'trains' | 'buses' | 'flights'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch trip data
        const tripResponse = await axiosInstance.get(`/api/trips/${id}`);
        setTripData(tripResponse.data);

        // Generate travel plan based on trip data
        const travelPlanResponse = await axiosInstance.post('/complete-plan', {
          source: tripResponse.data.StartLocation,
          destination: tripResponse.data.EndLocation,
          preferences: tripResponse.data.preferences,
          date: tripResponse.data.tripStartTime.split('T')[0], // Get just the date part
          interests: tripResponse.data.preferences, // Use preferences as interests
          startDate: tripResponse.data.tripStartTime.split('T')[0],
          endDate: tripResponse.data.tripEndTime.split('T')[0],
          startTime: tripResponse.data.tripStartTime.split('T')[1].substring(0, 5), // Get HH:mm
          endTime: tripResponse.data.tripEndTime.split('T')[1].substring(0, 5) // Get HH:mm
        });
        setTravelPlanData(travelPlanResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate trip duration in days
  const getTripDuration = () => {
    if (!tripData) return 0;
    return Math.ceil(
      (new Date(tripData.tripEndTime).getTime() - new Date(tripData.tripStartTime).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
  };

  // Create timeline events
  const getTimelineEvents = () => {
    if (!tripData) return [];
    
    return [
      // Trip start milestone
      {
        date: tripData.tripStartTime,
        title: "Trip Started",
        description: `Journey from ${tripData.StartLocation} to ${tripData.EndLocation} began`,
        type: "milestone" as const
      },
      // Transactions as events
      ...tripData.transactions.map(transaction => ({
        date: transaction.timestamp,
        title: `Payment to ${transaction.receiver}`,
        description: transaction.message,
        type: "transaction" as const,
        amount: transaction.amount,
        location: transaction.location ? `${transaction.location.latitude}, ${transaction.location.longitude}` : undefined
      })),
      // Visited places as events
      ...tripData.visitedPlaces.map(place => ({
        date: place.visitDate,
        title: place.name,
        type: "place" as const,
        location: `${place.location.lat}, ${place.location.lng}`
      })),
      // Trip end milestone
      {
        date: tripData.tripEndTime,
        title: "Trip Ends",
        description: `Journey from ${tripData.StartLocation} to ${tripData.EndLocation} completed`,
        type: "milestone" as const
      }
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">
          <AlertCircle className="inline-block mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!tripData || !travelPlanData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl">
          <Info className="inline-block mr-2" />
          No trip data found
        </div>
      </div>
    );
  }

  const { source, destination } = travelPlanData.plan;
  const { trains, buses, flights } = travelPlanData.plan.transport.transport;
  const itineraryDays = travelPlanData.plan.itinerary.itinerary;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Journey Details */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {tripData.StartLocation} to {tripData.EndLocation}
            </h1>
            <p className="text-indigo-100">{tripData.tripName}</p>
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full">
                <Navigation className="w-6 h-6" />
              </div>
              <span className="text-sm mt-1">{Math.round(tripData.distance)} km</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-sm mt-1">
                {Math.ceil((new Date(tripData.tripEndTime).getTime() - new Date(tripData.tripStartTime).getTime()) / (1000 * 60 * 60 * 24))} Days
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-sm mt-1">{tripData.plannedPlaces.length} Places</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trip Overview Section */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-indigo-100 rounded-full mr-4">
              <Info className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{tripData.tripName}</h2>
              <p className="text-gray-600">
                {new Date(tripData.tripStartTime).toLocaleDateString()} - {new Date(tripData.tripEndTime).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-auto">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tripData.status === 'active' 
                  ? 'bg-green-100 text-green-700'
                  : tripData.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {tripData.status.charAt(0).toUpperCase() + tripData.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-lg font-semibold text-gray-800">₹{tripData.budget}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <Receipt className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Spent</p>
                <p className="text-lg font-semibold text-gray-800">₹{tripData.spentAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <Navigation className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-lg font-semibold text-gray-800">{Math.round(tripData.distance)} km</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex mb-8 bg-white p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('transport')}
          className={`flex-1 py-3 rounded-lg text-center font-medium transition-colors ${
            activeTab === 'transport' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Plane className="w-5 h-5" />
            Transportation Options
          </span>
        </button>
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 py-3 rounded-lg text-center font-medium transition-colors ${
            activeTab === 'itinerary' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Detailed Itinerary
          </span>
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 rounded-lg text-center font-medium transition-colors ${
            activeTab === 'details' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Info className="w-5 h-5" />
            Trip Details
          </span>
        </button>
      </div>

      {/* Transportation Options */}
      {activeTab === 'transport' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Transport Type Tabs */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setTransportType('all')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                transportType === 'all' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Options
            </button>
            <button
              onClick={() => setTransportType('trains')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                transportType === 'trains' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Train className="w-4 h-4 inline-block mr-1" />
              Trains
            </button>
            <button
              onClick={() => setTransportType('buses')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                transportType === 'buses' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Bus className="w-4 h-4 inline-block mr-1" />
              Buses
            </button>
            <button
              onClick={() => setTransportType('flights')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                transportType === 'flights' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Plane className="w-4 h-4 inline-block mr-1" />
              Flights
            </button>
          </div>

          {/* Transport Cards */}
          <div className="space-y-6">
            {/* Trains */}
            {(transportType === 'all' || transportType === 'trains') && (
              <div>
                {transportType === 'all' && (
                  <div className="flex items-center mb-3">
                    <Train className="w-5 h-5 text-emerald-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Trains</h2>
                  </div>
                )}
                <div className="space-y-3">
                  {trains.map((train, index) => (
                    <TransportCard
                      key={`train-${index}`}
                      type="train"
                      name={train.name}
                      departure={train.departure}
                      arrival={train.arrival}
                      duration={train.duration}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Buses */}
            {(transportType === 'all' || transportType === 'buses') && (
              <div className={transportType === 'all' ? 'mt-8' : ''}>
                {transportType === 'all' && (
                  <div className="flex items-center mb-3">
                    <Bus className="w-5 h-5 text-blue-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Buses</h2>
                  </div>
                )}
                <div className="space-y-3">
                  {buses.map((bus, index) => (
                    <TransportCard
                      key={`bus-${index}`}
                      type="bus"
                      name={bus.name}
                      departure={bus.departure}
                      arrival={bus.arrival}
                      duration={bus.duration}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Flights */}
            {(transportType === 'all' || transportType === 'flights') && (
              <div className={transportType === 'all' ? 'mt-8' : ''}>
                {transportType === 'all' && (
                  <div className="flex items-center mb-3">
                    <Plane className="w-5 h-5 text-purple-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Flights</h2>
                  </div>
                )}
                <div className="space-y-3">
                  {flights.map((flight, index) => (
                    <TransportCard
                      key={`flight-${index}`}
                      type="flight"
                      name={flight.name}
                      departure={flight.departure}
                      arrival={flight.arrival}
                      duration={flight.duration}
                      airline={flight.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Travel Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200"
          >
            <h3 className="font-semibold text-amber-800 mb-3">Travel Tips for {destination}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Sunrise className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Best Time to Visit</h4>
                  <p className="text-sm text-amber-700">October to March when the weather is pleasant</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Utensils className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Local Cuisine</h4>
                  <p className="text-sm text-amber-700">Try idli, dosa, filter coffee, and Chettinad dishes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Landmark className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Must Visit</h4>
                  <p className="text-sm text-amber-700">
                    Marina Beach, Kapaleeshwarar Temple, Fort St. George
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Itinerary Section */}
      {activeTab === 'itinerary' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Compass className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your Chennai Adventure</h2>
                <p className="text-gray-600">A 3-day exploration of culture, cuisine, and coastal beauty</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Building className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Cultural Sites</h3>
                  <p className="text-sm text-gray-600">8 Temples & Museums</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Utensils className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Culinary Experiences</h3>
                  <p className="text-sm text-gray-600">6 Authentic Restaurants</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Waves className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Beach Visits</h3>
                  <p className="text-sm text-gray-600">3 Coastal Locations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div className="space-y-4">
            {itineraryDays.map((day) => (
              <DayItinerary
                key={day.day}
                day={day.day}
                date={day.date}
                activities={day.activities}
              />
            ))}
          </div>

          {/* Itinerary Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-xl border border-emerald-200"
          >
            <h3 className="font-semibold text-emerald-800 mb-3">Trip Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Star className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-medium text-emerald-800">Highlights</h4>
                  <p className="text-sm text-emerald-700">
                    Experience the rich cultural heritage of Chennai through its temples, beaches, and cuisine.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-medium text-emerald-800">Budget Estimate</h4>
                  <p className="text-sm text-emerald-700">
                    ₹15,000 - ₹20,000 per person (excluding transportation)
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Download Itinerary
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Trip Details Section */}
      {activeTab === 'details' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Trip Overview Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Info className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{tripData.tripName}</h2>
                <p className="text-gray-600">
                  {new Date(tripData.tripStartTime).toLocaleDateString()} - {new Date(tripData.tripEndTime).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tripData.status === 'active' 
                    ? 'bg-green-100 text-green-700'
                    : tripData.status === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tripData.status.charAt(0).toUpperCase() + tripData.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <Wallet className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-lg font-semibold text-gray-800">₹{tripData.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <Receipt className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Spent</p>
                  <p className="text-lg font-semibold text-gray-800">₹{tripData.spentAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <Navigation className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="text-lg font-semibold text-gray-800">{Math.round(tripData.distance)} km</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Receipt className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              <div className="space-y-4">
                {tripData.transactions.map((transaction, index) => (
                  <Transaction
                    key={transaction._id}
                    receiver={transaction.receiver}
                    amount={transaction.amount}
                    category={transaction.category}
                    timestamp={transaction.timestamp}
                    index={index}
                  />
                ))}
                {tripData.transactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No transactions recorded yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Trip Timeline</h2>
              </div>
            </div>
            <div className="relative space-y-8">
              {getTimelineEvents().map((event, index) => (
                <motion.div
                  key={`${event.date}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Vertical line */}
                  <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200">
                    {index === getTimelineEvents().length - 1 && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-200"></div>
                    )}
                  </div>
                  
                  {/* Timeline dot with pulse animation */}
                  <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    event.type === 'milestone' ? 'bg-green-100 border-2 border-green-300' :
                    event.type === 'transaction' ? 'bg-red-100 border-2 border-red-300' :
                    'bg-blue-100 border-2 border-blue-300'
                  }`}>
                    <div className={`absolute w-full h-full rounded-full animate-ping opacity-20 ${
                      event.type === 'milestone' ? 'bg-green-400' :
                      event.type === 'transaction' ? 'bg-red-400' :
                      'bg-blue-400'
                    }`}></div>
                    {event.type === 'milestone' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {event.type === 'transaction' && <Receipt className="w-4 h-4 text-red-600" />}
                    {event.type === 'place' && <MapPin className="w-4 h-4 text-blue-600" />}
                  </div>
                  
                  {/* Content */}
                  <div className={`ml-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${
                    event.type === 'milestone' ? 'bg-green-50 border border-green-100' :
                    event.type === 'transaction' ? 'bg-red-50 border border-red-100' :
                    'bg-blue-50 border border-blue-100'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{event.title}</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 shadow-sm">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      {event.location && (
                        <div className="flex items-center text-xs text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                      
                      {event.amount !== undefined && (
                        <span className="text-sm font-medium text-red-600 bg-white px-2 py-1 rounded-full shadow-sm">
                          -₹{event.amount}
                        </span>
                      )}
                      
                      {event.type === 'place' && (
                        <button className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors shadow-sm">
                          View in AR
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {getTimelineEvents().length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-gray-500">No timeline events yet</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Travel Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200"
          >
            <h3 className="font-semibold text-amber-800 mb-3">Travel Tips for {tripData.EndLocation}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Sunrise className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Best Time to Visit</h4>
                  <p className="text-sm text-amber-700">October to March when the weather is pleasant</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Utensils className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Local Cuisine</h4>
                  <p className="text-sm text-amber-700">Try local specialties and street food</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Landmark className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Must Visit</h4>
                  <p className="text-sm text-amber-700">Popular attractions and hidden gems</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default TravelOptionsPage;