export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  rating: number;
  totalReviews: number;
  participants: Participant[];
  description: string;
  highlights: string[];
  included: string[];
  itinerary: ItineraryDay[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  image: string;
  description: string;
  amenities: string[];
  rooms: number;
  reviews: Review[];
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  packageId: string;
  avatar?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  bookingsByMonth: {
    month: string;
    bookings: number;
    revenue: number;
  }[];
  revenueByPackage: {
    packageName: string;
    revenue: number;
  }[];
  popularDestinations: {
    destination: string;
    bookings: number;
  }[];
  customerSatisfaction: {
    rating: number;
    percentage: number;
  }[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}