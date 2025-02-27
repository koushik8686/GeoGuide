import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  Wifi, 
  Coffee, 
  Utensils, 
  Tv, 
  DollarSign,
  Heart,
  Share2,
  ChevronDown,
  Users,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

// Hotel type definition
interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  rooms: {
    type: string;
    price: number;
    available: number;
    image: string;
    features: string[];
  }[];
  nearbyAttractions: {
    name: string;
    distance: string;
  }[];
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hotels data
    const fetchHotels = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const data = [
          {
            id: '1',
            name: 'Grand Luxury Resort & Spa',
            location: 'Bali, Indonesia',
            description: 'Experience ultimate luxury in our beachfront resort with stunning ocean views and world-class amenities.',
            price: 350,
            rating: 4.8,
            reviews: 428,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
            amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Room Service', 'Airport Shuttle'],
            rooms: [
              {
                type: 'Deluxe Ocean View',
                price: 350,
                available: 5,
                image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
                features: ['King Bed', 'Ocean View', 'Balcony', 'Mini Bar']
              },
              {
                type: 'Premium Suite',
                price: 550,
                available: 2,
                image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2067&auto=format&fit=crop',
                features: ['King Bed', 'Living Room', 'Private Pool', 'Butler Service']
              }
            ],
            nearbyAttractions: [
              { name: 'Seminyak Beach', distance: '0.2 km' },
              { name: 'Potato Head Beach Club', distance: '1.5 km' },
              { name: 'Seminyak Square', distance: '2 km' }
            ]
          },
          {
            id: '2',
            name: 'Urban Boutique Hotel',
            location: 'Tokyo, Japan',
            description: 'A stylish boutique hotel in the heart of Tokyo, offering modern amenities and easy access to major attractions.',
            price: 220,
            rating: 4.6,
            reviews: 312,
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Concierge', 'Laundry Service'],
            rooms: [
              {
                type: 'Standard Room',
                price: 220,
                available: 8,
                image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop',
                features: ['Queen Bed', 'City View', 'Smart TV']
              },
              {
                type: 'Deluxe Room',
                price: 320,
                available: 3,
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop',
                features: ['King Bed', 'Sitting Area', 'Premium Amenities']
              }
            ],
            nearbyAttractions: [
              { name: 'Shibuya Crossing', distance: '1 km' },
              { name: 'Meiji Shrine', distance: '2.5 km' },
              { name: 'Tokyo Tower', distance: '4 km' }
            ]
          },
          {
            id: '3',
            name: 'Alpine Mountain Lodge',
            location: 'Interlaken, Switzerland',
            description: 'A cozy mountain lodge with breathtaking views of the Swiss Alps, perfect for nature lovers and adventure seekers.',
            price: 280,
            rating: 4.9,
            reviews: 256,
            image: 'https://images.unsplash.com/photo-1601551043487-befb9eb30de8?q=80&w=2070&auto=format&fit=crop',
            amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Ski Storage', 'Hiking Trails', 'Fireplace'],
            rooms: [
              {
                type: 'Mountain View Room',
                price: 280,
                available: 6,
                image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?q=80&w=2070&auto=format&fit=crop',
                features: ['Queen Bed', 'Mountain View', 'Balcony']
              },
              {
                type: 'Family Suite',
                price: 450,
                available: 2,
                image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop',
                features: ['Multiple Beds', 'Living Area', 'Kitchenette']
              }
            ],
            nearbyAttractions: [
              { name: 'Jungfrau', distance: '15 km' },
              { name: 'Lake Brienz', distance: '8 km' },
              { name: 'Harder Kulm', distance: '5 km' }
            ]
          },
          {
            id: '4',
            name: 'Coastal Paradise Resort',
            location: 'Santorini, Greece',
            description: 'A stunning white-washed resort perched on the cliffs of Santorini with infinity pools and sunset views.',
            price: 420,
            rating: 4.9,
            reviews: 389,
            image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2070&auto=format&fit=crop',
            amenities: ['Free WiFi', 'Infinity Pool', 'Restaurant', 'Bar', 'Spa', 'Airport Transfer'],
            rooms: [
              {
                type: 'Caldera View Room',
                price: 420,
                available: 4,
                image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=2073&auto=format&fit=crop',
                features: ['Queen Bed', 'Caldera View', 'Private Terrace']
              },
              {
                type: 'Honeymoon Suite',
                price: 650,
                available: 1,
                image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
                features: ['King Bed', 'Private Jacuzzi', 'Sunset View']
              }
            ],
            nearbyAttractions: [
              { name: 'Oia Village', distance: '2 km' },
              { name: 'Amoudi Bay', distance: '3 km' },
              { name: 'Fira Town', distance: '10 km' }
            ]
          },
          {
            id: '5',
            name: 'Historic City Palace',
            location: 'Prague, Czech Republic',
            description: 'A beautifully restored historic palace in the heart of Prague, offering luxury accommodations with old-world charm.',
            price: 310,
            rating: 4.7,
            reviews: 275,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
            amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Concierge', 'Valet Parking', 'Spa'],
            rooms: [
              {
                type: 'Classic Room',
                price: 310,
                available: 7,
                image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
                features: ['Queen Bed', 'City View', 'Period Furnishings']
              },
              {
                type: 'Royal Suite',
                price: 580,
                available: 1,
                image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
                features: ['King Bed', 'Separate Living Room', 'Antique Furniture']
              }
            ],
            nearbyAttractions: [
              { name: 'Charles Bridge', distance: '0.5 km' },
              { name: 'Prague Castle', distance: '1.5 km' },
              { name: 'Old Town Square', distance: '1 km' }
            ]
          },
          {
            id: '6',
            name: 'Desert Oasis Resort',
            location: 'Dubai, UAE',
            description: 'A luxurious desert resort offering a perfect blend of modern luxury and traditional Arabian hospitality.',
            price: 380,
            rating: 4.8,
            reviews: 342,
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop',
            amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Desert Activities', '24-hour Room Service'],
            rooms: [
              {
                type: 'Desert View Room',
                price: 380,
                available: 9,
                image: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2127&auto=format&fit=crop',
                features: ['King Bed', 'Desert View', 'Private Terrace']
              },
              {
                type: 'Luxury Tent',
                price: 620,
                available: 3,
                image: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2127&auto=format&fit=crop',
                features: ['King Bed', 'Private Pool', 'Butler Service']
              }
            ],
            nearbyAttractions: [
              { name: 'Dubai Desert Conservation Reserve', distance: '5 km' },
              { name: 'Al Marmoom Desert', distance: '15 km' },
              { name: 'Dubai City', distance: '45 km' }
            ]
          }
        ];
        setHotels(data);
        setFilteredHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Filter hotels based on search query, price range, and rating
  useEffect(() => {
    const filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
      const matchesRating = selectedRating === 0 || hotel.rating >= selectedRating;
      
      return matchesSearch && matchesPrice && matchesRating;
    });
    
    setFilteredHotels(filtered);
  }, [searchQuery, priceRange, selectedRating, hotels]);

  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Hotels</h1>
          <p className="text-gray-600">Find the perfect place to stay for your next adventure</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search hotels by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t pt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handlePriceRangeChange(0, 200)}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      priceRange[0] === 0 && priceRange[1] === 200
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    $0 - $200
                  </button>
                  <button
                    onClick={() => handlePriceRangeChange(200, 400)}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      priceRange[0] === 200 && priceRange[1] === 400
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    $200 - $400
                  </button>
                  <button
                    onClick={() => handlePriceRangeChange(400, 1000)}
                    className={`w-full px-3 py-2 rounded-lg text-left ${
                      priceRange[0] === 400 && priceRange[1] === 1000
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    $400+
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 0].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`w-full px-3 py-2 rounded-lg text-left flex items-center ${
                        selectedRating === rating
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {rating > 0 ? (
                        <>
                          <div className="flex mr-2">
                            {Array(rating).fill(0).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <span>{rating}+ Stars</span>
                        </>
                      ) : (
                        <span>All Ratings</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Room Service'].map(amenity => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-emerald-600" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hotels Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredHotels.map(hotel => (
            <Link
              key={hotel.id}
              to={`/user/hotels/${hotel.id}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                  ${hotel.price} / night
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">{hotel.name}</h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderStars(hotel.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {hotel.rating} ({hotel.reviews} reviews)
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center"
                    >
                      {amenity === 'Free WiFi' && <Wifi className="w-3 h-3 mr-1" />}
                      {amenity === 'Restaurant' && <Utensils className="w-3 h-3 mr-1" />}
                      {amenity === 'Swimming Pool' && <Wifi className="w-3 h-3 mr-1" />}
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{hotel.amenities.length - 4} more
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Available rooms: {hotel.rooms.reduce((sum, room) => sum + room.available, 0)}</span>
                  </div>
                  <span className="text-emerald-600 font-medium">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {filteredHotels.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hotels found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}