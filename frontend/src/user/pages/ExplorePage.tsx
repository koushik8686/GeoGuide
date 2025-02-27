import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Star,
  Heart,
  Share2,
  Filter,
  SlidersHorizontal,
  Users,
  Calendar,
  Clock,
  Sun,
  Umbrella,
  Wind,
  DollarSign
} from 'lucide-react';

// Enhanced destinations data
const destinations = [
  {
    id: 1,
    title: "Santorini Sunset Experience",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2574&auto=format&fit=crop",
    rating: 4.9,
    reviews: 482,
    price: "$299",
    category: "Islands",
    duration: "5 days",
    weather: "Sunny, 25°C",
    groupSize: "2-8",
    difficulty: "Easy",
    startDates: ["Apr 2024", "May 2024", "Jun 2024"],
    highlights: ["Sunset Views", "Wine Tasting", "Beach Access"],
    included: ["Accommodation", "Tours", "Some Meals"]
  },
  {
    id: 2,
    title: "Northern Lights Adventure",
    location: "Tromsø, Norway",
    image: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=2564&auto=format&fit=crop",
    rating: 4.8,
    reviews: 315,
    price: "$499",
    category: "Adventure",
    duration: "7 days",
    weather: "Cold, -5°C",
    groupSize: "4-12",
    difficulty: "Moderate",
    startDates: ["Jan 2024", "Feb 2024", "Mar 2024"],
    highlights: ["Aurora Viewing", "Dog Sledding", "Ice Hotel"],
    included: ["Equipment", "Guide", "Transportation"]
  },
  {
    id: 3,
    title: "Safari Experience",
    location: "Serengeti, Tanzania",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2568&auto=format&fit=crop",
    rating: 4.9,
    reviews: 628,
    price: "$799",
    category: "Wildlife",
    duration: "8 days",
    weather: "Warm, 30°C",
    groupSize: "4-6",
    difficulty: "Moderate",
    startDates: ["Jul 2024", "Aug 2024", "Sep 2024"],
    highlights: ["Big Five Viewing", "Luxury Camping", "Tribal Visit"],
    included: ["Safari Drives", "Accommodation", "Meals"]
  },
  {
    id: 4,
    title: "Ancient Temples Tour",
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2570&auto=format&fit=crop",
    rating: 4.7,
    reviews: 892,
    price: "$199",
    category: "Cultural",
    duration: "4 days",
    weather: "Mild, 20°C",
    groupSize: "2-10",
    difficulty: "Easy",
    startDates: ["Mar 2024", "Apr 2024", "May 2024"],
    highlights: ["Temple Visits", "Tea Ceremony", "Garden Tours"],
    included: ["Local Guide", "Transport", "Entry Fees"]
  },
  {
    id: 5,
    title: "Maldives Paradise",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2565&auto=format&fit=crop",
    rating: 4.9,
    reviews: 753,
    price: "$899",
    category: "Islands",
    duration: "6 days",
    weather: "Tropical, 28°C",
    groupSize: "2-4",
    difficulty: "Easy",
    startDates: ["Jan 2024", "Feb 2024", "Mar 2024"],
    highlights: ["Water Villa", "Snorkeling", "Spa"],
    included: ["Luxury Stay", "Water Sports", "Meals"]
  },
  {
    id: 6,
    title: "Amazon Rainforest Trek",
    location: "Amazon, Brazil",
    image: "https://images.unsplash.com/photo-1601661528567-9836126bcd20?q=80&w=2572&auto=format&fit=crop",
    rating: 4.6,
    reviews: 421,
    price: "$599",
    category: "Adventure",
    duration: "5 days",
    weather: "Humid, 32°C",
    groupSize: "4-8",
    difficulty: "Challenging",
    startDates: ["Jun 2024", "Jul 2024", "Aug 2024"],
    highlights: ["Jungle Trekking", "Wildlife Spotting", "Local Tribes"],
    included: ["Guide", "Camping Gear", "Meals"]
  }
];

const categories = ["All", "Islands", "Adventure", "Wildlife", "Cultural", "Urban", "Mountains"];
const difficulties = ["Easy", "Moderate", "Challenging"];
const durations = ["1-3 days", "4-7 days", "8+ days"];
const priceRanges = ["$0-$300", "$301-$600", "$601-$1000", "$1000+"];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || dest.difficulty === selectedDifficulty;
    const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Destinations</h1>
        <p className="text-gray-600">Discover amazing places around the world</p>
      </div>

      {/* Search and Categories */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search destinations, locations, or experiences..."
              className="w-full px-4 py-2 pl-10 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-emerald-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      selectedDifficulty === difficulty
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div className="space-y-2">
                {durations.map(duration => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      selectedDuration === duration
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <button
                    key={range}
                    onClick={() => setSelectedPriceRange(range)}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      selectedPriceRange === range
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weather</label>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 rounded-lg text-left hover:bg-gray-50">
                  <Sun className="w-4 h-4 inline-block mr-2" /> Sunny
                </button>
                <button className="w-full px-3 py-2 rounded-lg text-left hover:bg-gray-50">
                  <Umbrella className="w-4 h-4 inline-block mr-2" /> Rainy
                </button>
                <button className="w-full px-3 py-2 rounded-lg text-left hover:bg-gray-50">
                  <Wind className="w-4 h-4 inline-block mr-2" /> Windy
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDestinations.map(destination => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden group"
          >
            <div className="relative">
              <img 
                src={destination.image} 
                alt={destination.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded-full text-sm font-medium text-gray-800">
                {destination.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{destination.title}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{destination.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{destination.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{destination.groupSize}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Sun className="w-4 h-4 mr-2" />
                  <span className="text-sm">{destination.weather}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-sm">{destination.price}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Highlights:</div>
                <div className="flex flex-wrap gap-2">
                  {destination.highlights.map((highlight, index) => (
                    <span
                 key={index}
                    className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs"
                  >
                    {highlight}
                  </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{destination.rating}</span>
                  <span className="ml-1 text-gray-400">({destination.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-emerald-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}