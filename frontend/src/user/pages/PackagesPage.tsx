import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star,
  Users,
  Clock,
  MapPin,
  Calendar,
  Heart,
  Share2,
  Filter,
  Coffee,
  Plane,
  Hotel,
  Car,
  Sun,
  Umbrella,
  DollarSign,
  Camera,
  Utensils,
  Wifi
} from 'lucide-react';

// Enhanced packages data with more details
const packages = [
  {
    id: 1,
    title: "Ultimate Japan Explorer",
    location: "Tokyo, Kyoto, Osaka",
    duration: "12 days",
    price: "$2,999",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2570&auto=format&fit=crop",
    agency: "Japan Travel Experts",
    agencyLogo: "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=2574&auto=format&fit=crop",
    inclusions: ["Flights", "Hotels", "Tours", "Meals"],
    highlights: [
      "Traditional Tea Ceremony",
      "Mount Fuji Visit",
      "Bullet Train Experience",
      "Temple Tours"
    ],
    dates: [
      "Apr 15 - Apr 26, 2024",
      "May 10 - May 21, 2024",
      "Jun 5 - Jun 16, 2024"
    ],
    accommodation: "4-5 Star Hotels",
    groupSize: "8-12",
    difficulty: "Easy",
    weather: "Mild, 20°C",
    meals: "Breakfast + 5 Dinners",
    transportation: "Bullet Train + Private Bus"
  },
  {
    id: 2,
    title: "Greek Islands Hopping",
    location: "Athens, Santorini, Mykonos",
    duration: "10 days",
    price: "$2,499",
    rating: 4.8,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2574&auto=format&fit=crop",
    agency: "Mediterranean Voyages",
    agencyLogo: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=2494&auto=format&fit=crop",
    inclusions: ["Hotels", "Ferry Transfers", "Tours"],
    highlights: [
      "Acropolis Tour",
      "Sunset in Santorini",
      "Beach Hopping",
      "Wine Tasting"
    ],
    dates: [
      "May 20 - May 29, 2024",
      "Jun 15 - Jun 24, 2024",
      "Jul 10 - Jul 19, 2024"
    ],
    accommodation: "Boutique Hotels",
    groupSize: "10-14",
    difficulty: "Easy",
    weather: "Sunny, 25°C",
    meals: "Breakfast + 3 Dinners",
    transportation: "Ferry + Private Bus"
  },
  {
    id: 3,
    title: "African Safari Adventure",
    location: "Kenya & Tanzania",
    duration: "8 days",
    price: "$3,499",
    rating: 4.9,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2568&auto=format&fit=crop",
    agency: "Safari Specialists",
    agencyLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2574&auto=format&fit=crop",
    inclusions: ["Lodges", "Game Drives", "Meals", "Guides"],
    highlights: [
      "Big Five Viewing",
      "Masai Village Visit",
      "Hot Air Balloon Ride",
      "Luxury Camping"
    ],
    dates: [
      "Jul 5 - Jul 12, 2024",
      "Aug 10 - Aug 17, 2024",
      "Sep 15 - Sep 22, 2024"
    ],
    accommodation: "Luxury Lodges + Tented Camps",
    groupSize: "6-8",
    difficulty: "Moderate",
    weather: "Warm, 28°C",
    meals: "All-Inclusive",
    transportation: "4x4 Safari Vehicles"
  }
];

// Filter options
const filterOptions = {
  duration: ["7-10 days", "11-15 days", "15+ days"],
  priceRange: ["$2000-$3000", "$3001-$4000", "$4000+"],
  groupSize: ["6-8", "8-12", "12+"],
  difficulty: ["Easy", "Moderate", "Challenging"]
};

export default function PackagesPage() {
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    duration: "",
    priceRange: "",
    groupSize: "",
    difficulty: ""
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Travel Packages</h1>
        <p className="text-gray-600">Curated experiences from trusted travel agencies</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-emerald-600"
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Duration: Short to Long</option>
              <option>Rating: High to Low</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div className="space-y-2">
                {filterOptions.duration.map(duration => (
                  <button
                    key={duration}
                    onClick={() => setSelectedFilters(prev => ({ ...prev, duration }))}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      selectedFilters.duration === duration
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
                {filterOptions.priceRange.map(range => (
                  <button
                    key={range}
                    onClick={() => setSelectedFilters(prev => ({ ...prev, priceRange: range }))}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      selectedFilters.priceRange === range
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
              <div className="space-y-2">
                {filterOptions.groupSize.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedFilters(prev => ({ ...prev, groupSize: size }))}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      selectedFilters.groupSize === size
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {filterOptions.difficulty.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedFilters(prev => ({ ...prev, difficulty: level }))}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      selectedFilters.difficulty === level
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 gap-6">
        {packages.map(pkg => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="relative">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full">
                  <div className="flex items-center text-sm font-medium text-gray-800">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.duration}
                  </div>
                </div>
              </div>
              <div className="col-span-2 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{pkg.title}</h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{pkg.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">{pkg.price}</div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{pkg.groupSize}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-sm">{pkg.rating} ({pkg.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Sun className="w-4 h-4 mr-2" />
                    <span className="text-sm">{pkg.weather}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Hotel className="w-4 h-4 mr-2" />
                    <span className="text-sm">{pkg.accommodation}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Highlights:</div>
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Available Dates:</div>
                  <div className="flex flex-wrap gap-2">
                    {pkg.dates.map((date, index) => (
                      <button
                        key={index}
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:border-emerald-500 hover:bg-emerald-50"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Flight Included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{pkg.meals}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{pkg.transportation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Free WiFi</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                      Book Now
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-emerald-600">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}