import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train, 
  Bus, 
  Plane, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Star, 
  Filter,
  Sun,
  Moon,
  DollarSign,
  Wifi,
  Coffee,
  Utensils,
  MapPin,
  Camera,
  Navigation,
  Compass,
  Sunrise,
  Sunset,
  Palmtree,
  UtensilsCrossed,
  ShoppingBag,
  Building,
  Waves,
  Landmark,
  ChevronDown,
  ChevronUp,
  Heart
} from 'lucide-react';

// Travel plan data
const travelPlan = {
  status: "success",
  plan: {
    source: "Mumbai",
    destination: "Chennai",
    transport: {
      transport: {
        trains: [
          {
            name: "Mumbai CSMT - Chennai Central Express (11041)",
            departure: "14:00",
            arrival: "03:45",
            duration: "13h 45m"
          },
          {
            name: "Mumbai LTT - Chennai Central Special (02197)",
            departure: "20:00",
            arrival: "09:30",
            duration: "13h 30m"
          }
        ],
        buses: [
          {
            name: "VRL Travels",
            departure: "16:00",
            arrival: "06:00",
            duration: "14h 00m"
          },
          {
            name: "SRS Travels",
            departure: "18:00",
            arrival: "08:00",
            duration: "14h 00m"
          }
        ],
        flights: [
          {
            name: "IndiGo",
            departure: "06:00",
            arrival: "08:00",
            duration: "2h 00m"
          },
          {
            name: "Air India",
            departure: "12:00",
            arrival: "14:00",
            duration: "2h 00m"
          },
          {
            name: "Vistara",
            departure: "19:00",
            arrival: "21:00",
            duration: "2h 00m"
          }
        ]
      }
    },
    itinerary: {
      itinerary: [
        {
          day: 1,
          date: "2023-12-25",
          activities: [
            {
              time: "09:00",
              place: "Kapaleeshwarar Temple",
              description: "Begin the day with a visit to this iconic Dravidian-style temple dedicated to Lord Shiva. Explore the intricate carvings and vibrant gopuram.",
              type: "sightseeing"
            },
            {
              time: "11:00",
              place: "San Thome Beach",
              description: "Stroll along the beach and visit the nearby San Thome Basilica, a historic church with Gothic architecture.",
              type: "sightseeing"
            },
            {
              time: "13:00",
              place: "Karpagambal Mess",
              description: "Enjoy a traditional South Indian lunch with dishes like idli, dosa, and sambar.",
              type: "meal"
            },
            {
              time: "14:30",
              place: "Government Museum, Egmore",
              description: "Explore the museum's collection of historical artifacts and art, including bronze sculptures and ancient coins.",
              type: "sightseeing"
            },
            {
              time: "16:30",
              place: "Parthasarathy Temple",
              description: "Visit this 8th-century temple dedicated to Lord Krishna, known for its Dravidian architecture.",
              type: "sightseeing"
            },
            {
              time: "18:00",
              place: "Murugan Idli Shop",
              description: "Savor authentic South Indian snacks and filter coffee.",
              type: "meal"
            },
            {
              time: "19:00",
              place: "Marina Beach",
              description: "Relax and watch the sunset at one of India's longest urban beaches.",
              type: "sightseeing"
            }
          ]
        },
        {
          day: 2,
          date: "2023-12-26",
          activities: [
            {
              time: "09:00",
              place: "Sri Parthasarathy Temple",
              description: "Start the day with a peaceful darshan at this temple, known for its spiritual ambiance.",
              type: "sightseeing"
            },
            {
              time: "10:30",
              place: "Fort St. George",
              description: "Explore the oldest British fort in India, housing the Fort Museum and St. Mary's Church.",
              type: "sightseeing"
            },
            {
              time: "12:30",
              place: "Amethyst Cafe",
              description: "Indulge in a heritage lunch amidst a colonial setting with a blend of Indian and European cuisine.",
              type: "meal"
            },
            {
              time: "14:00",
              place: "Sri Ashtalakshmi Temple",
              description: "Visit this unique temple dedicated to the eight forms of Goddess Lakshmi, situated by the beach.",
              type: "sightseeing"
            },
            {
              time: "16:00",
              place: "DakshinaChitra",
              description: "Discover the cultural heritage of South India through art, architecture, and crafts.",
              type: "sightseeing"
            },
            {
              time: "18:00",
              place: "Rayar's Mess",
              description: "Dine on authentic Tamil Nadu meals in a traditional setting.",
              type: "meal"
            },
            {
              time: "19:30",
              place: "Besant Nagar Beach",
              description: "End the day with a serene walk along the beach, enjoying the cool breeze.",
              type: "sightseeing"
            }
          ]
        },
        {
          day: 3,
          date: "2023-12-27",
          activities: [
            {
              time: "09:00",
              place: "Sri Kalikambal Temple",
              description: "Begin with a visit to this temple known for its vibrant festivals and Dravidian architecture.",
              type: "sightseeing"
            },
            {
              time: "10:30",
              place: "San Thome Basilica",
              description: "Explore the historical church believed to house the tomb of St. Thomas, one of Jesus' apostles.",
              type: "sightseeing"
            },
            {
              time: "12:00",
              place: "Karpagambal Mess",
              description: "Enjoy a traditional South Indian lunch with local specialties.",
              type: "meal"
            },
            {
              time: "13:30",
              place: "Kapaleeshwarar Temple",
              description: "Return for a deeper exploration or some last-minute shopping for souvenirs.",
              type: "sightseeing"
            },
            {
              time: "15:00",
              place: "Mylapore Heritage Walk",
              description: "Walk through the historic streets of Mylapore, exploring its temples, churches, and cultural landmarks.",
              type: "sightseeing"
            },
            {
              time: "17:00",
              place: "Southern Spice",
              description: "Conclude the trip with a grand dinner featuring a variety of South Indian and continental dishes.",
              type: "meal"
            },
            {
              time: "19:00",
              place: "T. Nagar Market",
              description: "End your Chennai experience with some last-minute shopping for silk sarees and local handicrafts.",
              type: "shopping"
            }
          ]
        }
      ]
    }
  }
};

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
  "T. Nagar Market": "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop"
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

export default function TravelOptionsPage() {
  const [activeTab, setActiveTab] = useState<'transport' | 'itinerary'>('transport');
  const [transportType, setTransportType] = useState<'all' | 'trains' | 'buses' | 'flights'>('all');
  
  const { source, destination } = travelPlan.plan;
  const { trains, buses, flights } = travelPlan.plan.transport.transport;
  const itineraryDays = travelPlan.plan.itinerary.itinerary;

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
              {source} to {destination}
            </h1>
            <p className="text-indigo-100">Your complete travel plan</p>
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full">
                <Navigation className="w-6 h-6" />
              </div>
              <span className="text-sm mt-1">1,347 km</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-sm mt-1">3 Days</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-sm mt-1">7 Places</span>
            </div>
          </div>
        </div>
      </motion.div>

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
                  <p className="text-sm text-amber-700">Marina Beach, Kapaleeshwarar Temple, Fort St. George</p>
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
    </div>
  );
}