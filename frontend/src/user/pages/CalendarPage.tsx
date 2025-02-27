import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Users, AlertCircle, Star, Filter, Tag, Plane, Hotel, Car, Coffee } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

// Dummy calendar events with more detailed data
const events = [
  {
    id: 1,
    title: "Business Meeting in NYC",
    date: new Date(2024, 4, 15),
    location: "New York, USA",
    duration: "3 days",
    type: "Business",
    attendees: 4,
    details: "Quarterly review meeting with stakeholders"
  },
  {
    id: 2,
    title: "Family Reunion",
    date: new Date(2024, 6, 1),
    location: "Chicago, USA",
    duration: "5 days",
    type: "Personal",
    attendees: 12,
    details: "Annual family gathering at Lake Michigan"
  },
  {
    id: 3,
    title: "Tech Conference",
    date: new Date(2024, 5, 10),
    location: "San Francisco, USA",
    duration: "2 days",
    type: "Business",
    attendees: 1,
    details: "Web Development Summit 2024"
  },
  {
    id: 4,
    title: "Wedding Anniversary",
    date: new Date(2024, 7, 15),
    location: "Hawaii, USA",
    duration: "7 days",
    type: "Personal",
    attendees: 2,
    details: "Celebrating 5th wedding anniversary"
  },
  {
    id: 5,
    title: "Product Launch",
    date: new Date(2024, 8, 20),
    location: "London, UK",
    duration: "4 days",
    type: "Business",
    attendees: 6,
    details: "New product line introduction"
  }
];

// Enhanced travel suggestions with more details
const travelSuggestions = [
  {
    id: 1,
    title: "Weekend in Paris",
    dates: "May 20 - May 23, 2024",
    reason: "Gap between NYC meeting and regular schedule",
    confidence: 85,
    price: "$1,200",
    weather: "Mild, 20°C",
    activities: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"],
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Beach Getaway to Maldives",
    dates: "June 15 - June 22, 2024",
    reason: "Perfect weather and no conflicts",
    confidence: 92,
    price: "$2,500",
    weather: "Sunny, 28°C",
    activities: ["Snorkeling", "Beach Relaxation", "Water Sports"],
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2565&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Swiss Alps Adventure",
    dates: "July 5 - July 12, 2024",
    reason: "Summer break period with great hiking conditions",
    confidence: 78,
    price: "$1,800",
    weather: "Cool, 15°C",
    activities: ["Hiking", "Cable Car Rides", "Mountain Biking"],
    image: "https://images.unsplash.com/photo-1531366936337-7c912516ebab?q=80&w=2070&auto=format&fit=crop"
  }
];

// Calendar preferences for better personalization
const preferences = {
  preferredTripLength: "4-7 days",
  maxBudget: 3000,
  preferredDestinations: ["Europe", "Asia", "Beach Destinations"],
  travelStyle: ["Adventure", "Cultural", "Relaxation"],
  excludedDates: ["2024-12-24", "2024-12-25", "2024-12-31"]
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showPreferences, setShowPreferences] = useState(false);

  const connectCalendar = () => {
    setIsConnected(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Trip Planner</h1>
        <p className="text-gray-600">Let AI find the perfect time for your next adventure</p>
      </div>

      {!isConnected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <CalendarIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Connect Your Calendar</h2>
          <p className="text-gray-600 mb-6">
            Connect your Google Calendar to get personalized travel suggestions based on your schedule
          </p>
          <button
            onClick={connectCalendar}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Connect Google Calendar
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Filters and Preferences */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                </select>
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-emerald-600"
                >
                  <Filter className="w-4 h-4" />
                  Travel Preferences
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Calendar Status:</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                  Connected
                </span>
              </div>
            </div>

            {/* Travel Preferences Panel */}
            {showPreferences && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-t pt-4 mt-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Trip Length
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                      <option>4-7 days</option>
                      <option>1-3 days</option>
                      <option>8-14 days</option>
                      <option>14+ days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Budget
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Enter amount"
                      defaultValue={3000}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Style
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Adventure", "Cultural", "Relaxation"].map(style => (
                        <span
                          key={style}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm cursor-pointer hover:bg-emerald-100"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Destinations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Europe", "Asia", "Americas"].map(region => (
                        <span
                          key={region}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm cursor-pointer hover:bg-emerald-100"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Calendar Events */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
                <div className="space-y-4">
                  {events.map(event => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="bg-emerald-100 rounded-lg p-3 mr-4">
                        <CalendarIcon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{event.title}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {format(event.date, 'MMMM d, yyyy')} ({event.duration})
                              </div>
                              <div className="flex items-center mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.type === 'Business' 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'bg-purple-50 text-purple-600'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Users className="w-4 h-4 mr-1" />
                            {event.attendees} {event.attendees === 1 ? 'person' : 'people'}
                          </div>
                          <span className="text-sm text-gray-500">{event.details}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel Suggestions */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">AI Travel Suggestions</h2>
                <div className="space-y-6">
                  {travelSuggestions.map(suggestion => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <img
                        src={suggestion.image}
                        alt={suggestion.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                          <span className="text-emerald-600 font-medium">{suggestion.price}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {suggestion.dates}
                        </div>
                        <div className="mt-2 p-3 bg-emerald-50 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{suggestion.reason}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-gray-600 mb-2">
                            Weather: {suggestion.weather}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.activities.map((activity, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              AI Confidence: {suggestion.confidence}%
                            </span>
                          </div>
                          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}