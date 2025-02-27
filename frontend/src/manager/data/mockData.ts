import { TourPackage, Hotel, Participant, Review, AnalyticsData, Message } from '../types';

// Mock Users
export const users = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    role: 'Tour Manager'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    role: 'Customer'
  }
];

// Mock Messages
export const messages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi, I'm interested in the Bali tour package.',
    timestamp: '2024-03-10T14:30:00Z',
    read: true
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Hello! Of course, I'd be happy to help. What would you like to know about the package?',
    timestamp: '2024-03-10T14:31:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'What's the best time to visit Bali?',
    timestamp: '2024-03-10T14:32:00Z',
    read: false
  }
];

// Mock Tour Packages
export const tourPackages: TourPackage[] = [
  {
    id: '1',
    name: 'Bali Paradise Explorer',
    destination: 'Bali, Indonesia',
    duration: '7 days',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    rating: 4.8,
    totalReviews: 124,
    description: 'Discover the magic of Bali with our most popular tour package.',
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
        title: 'Arrival & Welcome',
        description: 'Airport pickup and transfer to hotel',
        activities: ['Airport transfer', 'Welcome dinner']
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
      }
    ]
  },
  {
    id: '2',
    name: 'Swiss Alps Adventure',
    destination: 'Switzerland',
    duration: '10 days',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86',
    rating: 4.9,
    totalReviews: 89,
    description: 'Experience the breathtaking beauty of the Swiss Alps.',
    highlights: [
      'Mountain hiking',
      'Cable car rides',
      'Swiss chocolate tasting',
      'Lake Geneva cruise'
    ],
    included: [
      'Luxury hotel stays',
      'All meals',
      'Train passes',
      'Equipment rental'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Zurich Arrival',
        description: 'Welcome to Switzerland!',
        activities: ['Airport transfer', 'City tour']
      }
    ],
    participants: []
  }
];

// Mock Hotels
export const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Luxury Beach Resort',
    location: 'Bali, Indonesia',
    rating: 4.8,
    pricePerNight: 299,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
    description: 'A luxury beachfront resort with stunning ocean views.',
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
        userId: '2',
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
    description: 'Traditional Swiss lodge with modern amenities.',
    amenities: [
      'Ski-in/ski-out',
      'Heated pool',
      'Sauna',
      'Restaurant'
    ],
    rooms: 80,
    reviews: []
  }
];

// Mock Analytics Data
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