import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Users, AlertCircle, Star, Filter, Tag, Plane, Hotel, Car, Coffee } from 'lucide-react';
import { format, parseISO, isAfter, isBefore, addMinutes } from 'date-fns';
import {axiosInstance , API_BASE_URL} from '../../constants/urls'; // Import axiosInstance

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showPreferences, setShowPreferences] = useState(false);
  const [events, setEvents] = useState([]);
  const [emptySlots, setEmptySlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if the user was redirected after successful OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    if (success === 'true') {
      setIsConnected(true);
      fetchEvents();
    }
  }, []);

  // Function to connect to Google Calendar
  const connectCalendar = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = API_BASE_URL+"/auth/google";
  };

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get('/calendar/events', {
        withCredentials: true, // Include cookies for authentication
      });

      if (response.data) {
        setEvents(response.data);
        calculateEmptySlots(response.data); // Calculate empty slots
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate empty time slots
  const calculateEmptySlots = (events) => {
    if (events.length === 0) {
      setEmptySlots([{ start: new Date(), end: addMinutes(new Date(), 60) }]); // Default empty slot
      return;
    }

    // Sort events by start time
    const sortedEvents = events.sort((a, b) =>
      parseISO(a.start.dateTime || a.start.date) - parseISO(b.start.dateTime || b.start.date)
    );

    const slots = [];
    let previousEventEnd = parseISO(sortedEvents[0].start.dateTime || sortedEvents[0].start.date);

    // Check for empty slots before the first event
    const firstEventStart = parseISO(sortedEvents[0].start.dateTime || sortedEvents[0].start.date);
    if (isAfter(firstEventStart, new Date())) {
      slots.push({
        start: new Date(),
        end: firstEventStart,
      });
    }

    // Check for empty slots between events
    for (let i = 1; i < sortedEvents.length; i++) {
      const currentEventStart = parseISO(sortedEvents[i].start.dateTime || sortedEvents[i].start.date);
      const previousEventEnd = parseISO(sortedEvents[i - 1].end.dateTime || sortedEvents[i - 1].end.date);

      if (isAfter(currentEventStart, previousEventEnd)) {
        slots.push({
          start: previousEventEnd,
          end: currentEventStart,
        });
      }
    }

    // Check for empty slots after the last event
    const lastEventEnd = parseISO(sortedEvents[sortedEvents.length - 1].end.dateTime || sortedEvents[sortedEvents.length - 1].end.date);
    if (isBefore(lastEventEnd, new Date(new Date().setHours(23, 59, 59)))) {
      slots.push({
        start: lastEventEnd,
        end: new Date(new Date().setHours(23, 59, 59)),
      });
    }

    setEmptySlots(slots);
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No events found.</p>
              </div>
            ) : (
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
                          <h3 className="font-semibold text-gray-800">{event.summary}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {format(parseISO(event.start.dateTime || event.start.date), 'MMMM d, yyyy h:mm a')}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location || 'No Location'}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
                          Event
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Empty Time Slots */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Available Time Slots</h2>
            {emptySlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No available time slots found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {emptySlots.map((slot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-emerald-100 rounded-lg p-3 mr-4">
                      <Clock className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">Free Time</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {format(slot.start, 'MMMM d, yyyy h:mm a')} - {format(slot.end, 'h:mm a')}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600">
                          Available
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}