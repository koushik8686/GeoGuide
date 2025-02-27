import { Hotel , TourPackage , Participant , Review } from './types';

export const tourPackages: TourPackage[] = [
  {
    id: '1',
    name: 'Bali Paradise Explorer',
    destination: 'Bali, Indonesia',
    duration: '7 days',
    price: 1299,
    rating: 4.8,
    totalReviews: 124,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    description: 'Discover the magic of Bali with our most popular tour package. Experience pristine beaches, ancient temples, and vibrant culture.',
    highlights: [
      'Visit ancient temples',
      'Explore rice terraces',
      'Traditional dance shows',
      'Sunset beach dinners'
    ],
    included: [
      'Hotel accommodation',
      'Daily breakfast',
      'Airport transfers',
      'Local guide'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Welcome Dinner',
        description: 'Airport pickup and transfer to your hotel. Evening welcome dinner with traditional dance performance.',
        activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner']
      },
      {
        day: 2,
        title: 'Temple & Culture Tour',
        description: 'Visit the most iconic temples of Bali and learn about local culture.',
        activities: ['Tanah Lot Temple', 'Uluwatu Temple', 'Cultural workshop']
      }
    ],
    participants: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        joinedDate: '2024-02-15',
        packageId: '1',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        joinedDate: '2024-02-16',
        packageId: '1',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
      }
    ]
  },
  {
    id: '2',
    name: 'Swiss Alps Adventure',
    destination: 'Switzerland',
    duration: '10 days',
    price: 2499,
    rating: 4.9,
    totalReviews: 89,
    image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86',
    description: 'Experience the breathtaking beauty of the Swiss Alps with this comprehensive tour package.',
    highlights: [
      'Mountain hiking',
      'Cable car rides',
      'Swiss chocolate tasting',
      'Lake Geneva cruise'
    ],
    included: [
      'Luxury hotel stays',
      'All meals included',
      'Train passes',
      'Equipment rental'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Zurich Arrival',
        description: 'Welcome to Switzerland! Transfer to your hotel and evening city tour.',
        activities: ['Airport transfer', 'City tour', 'Welcome dinner']
      }
    ],
    participants: [
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        joinedDate: '2024-02-10',
        packageId: '2',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      }
    ]
  },
  {
    id: '3',
    name: 'Japan Cherry Blossom Tour',
    destination: 'Japan',
    duration: '12 days',
    price: 3299,
    rating: 4.7,
    totalReviews: 156,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    description: 'Experience the magical cherry blossom season in Japan with this cultural tour package.',
    highlights: [
      'Cherry blossom viewing',
      'Tea ceremony',
      'Temple visits',
      'Sushi making class'
    ],
    included: [
      'Traditional ryokan stays',
      'JR Pass',
      'Guided tours',
      'Cultural activities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tokyo Arrival',
        description: 'Welcome to Japan! Transfer to your hotel in Tokyo.',
        activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner']
      }
    ],
    participants: [
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        joinedDate: '2024-02-20',
        packageId: '3',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
      }
    ]
  }
];

export const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Luxury Beach Resort',
    location: 'Bali, Indonesia',
    rating: 4.8,
    pricePerNight: 299,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
    description: 'A luxury beachfront resort offering stunning ocean views and world-class amenities.',
    amenities: [
      'Private beach',
      'Spa',
      'Infinity pool',
      'Multiple restaurants'
    ],
    rooms: 150,
    reviews: [
      {
        id: '1',
        userId: '1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        rating: 5,
        comment: 'Amazing stay with incredible service!',
        date: '2024-02-20'
      }
    ]
  },
  {
    id: '2',
    name: 'Alpine Lodge',
    location: 'Switzerland',
    rating: 4.6,
    pricePerNight: 399,
    image: 'https://images.unsplash.com/photo-1518602164578-cd0074062767',
    description: 'Traditional Swiss lodge with modern amenities and breathtaking mountain views.',
    amenities: [
      'Ski-in/ski-out',
      'Heated pool',
      'Sauna',
      'Restaurant'
    ],
    rooms: 80,
    reviews: []
  },
  {
    id: '3',
    name: 'Kyoto Zen Hotel',
    location: 'Kyoto, Japan',
    rating: 4.9,
    pricePerNight: 450,
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
    description: 'Experience traditional Japanese hospitality in this modern luxury hotel.',
    amenities: [
      'Japanese garden',
      'Tea ceremony room',
      'Hot spring bath',
      'Traditional dining'
    ],
    rooms: 120,
    reviews: [
      {
        id: '2',
        userId: '2',
        userName: 'David Chen',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        rating: 5,
        comment: 'Perfect blend of tradition and luxury.',
        date: '2024-02-15'
      }
    ]
  },
  {
    id: '4',
    name: 'Maldives Water Villa Resort',
    location: 'Maldives',
    rating: 4.9,
    pricePerNight: 899,
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000',
    description: 'Luxurious overwater villas with direct access to crystal clear waters.',
    amenities: [
      'Private pool',
      'Glass floor',
      'Water sports',
      'Underwater restaurant'
    ],
    rooms: 50,
    reviews: []
  }
];

export const analyticsData: AnalyticsData = {
  totalBookings: 342,
  totalRevenue: 687500,
  averageRating: 4.7,
  bookingsByMonth: [
    { month: 'Jan', bookings: 28, revenue: 45000 },
    { month: 'Feb', bookings: 35, revenue: 52000 },
    { month: 'Mar', bookings: 42, revenue: 68000 },
    { month: 'Apr', bookings: 38, revenue: 58000 },
    { month: 'May', bookings: 45, revenue: 72000 },
    { month: 'Jun', bookings: 52, revenue: 85000 }
  ],
  revenueByPackage: [
    { packageName: 'Bali Paradise Explorer', revenue: 245600 },
    { packageName: 'Swiss Alps Adventure', revenue: 441900 }
  ],
  popularDestinations: [
    { destination: 'Bali', bookings: 189 },
    { destination: 'Switzerland', bookings: 153 },
    { destination: 'Japan', bookings: 134 },
    { destination: 'Maldives', bookings: 98 }
  ],
  customerSatisfaction: [
    { rating: 5, percentage: 45 },
    { rating: 4, percentage: 35 },
    { rating: 3, percentage: 15 },
    { rating: 2, percentage: 4 },
    { rating: 1, percentage: 1 }
  ]
};