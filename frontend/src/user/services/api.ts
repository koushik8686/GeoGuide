// Mock API Services
import { format, addDays } from 'date-fns';

// Types
export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  location: string;
  level: number;
  points: number;
  countriesVisited: number;
  trips: number;
  posts: number;
  interests: string[];
  mutualFriends: User[];
  online?: boolean;
  lastMessage?: string;
  unreadCount?: number;
  messages?: Message[];
}

export interface CurrentTrip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  spentAmount: number;
  progress: number;
  itinerary: ItineraryItem[];
}

interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
}

export interface TravelChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  participants: number;
  reward: number;
}

export interface GroupTrip {
  id: string;
  title: string;
  destination: string;
  date: string;
  status: 'Upcoming' | 'In Progress';
  members: User[];
}

// Mock Current Trip Data
const mockCurrentTrip: CurrentTrip = {
  id: '1',
  title: 'Tokyo Explorer',
  location: 'Tokyo, Japan',
  startDate: '2024-03-10',
  endDate: '2024-03-20',
  budget: 3000,
  spentAmount: 1250,
  progress: 65,
  itinerary: [
    {
      id: '1',
      time: '9:00 AM',
      activity: 'Tsukiji Fish Market Tour',
      status: 'completed'
    },
    {
      id: '2',
      time: '2:00 PM',
      activity: 'Sensoji Temple Visit',
      status: 'in-progress'
    },
    {
      id: '3',
      time: '7:00 PM',
      activity: 'Shibuya Crossing & Dinner',
      status: 'upcoming'
    }
  ]
};

// Mock Users Data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop',
    location: 'Tokyo, Japan',
    level: 15,
    points: 2500,
    countriesVisited: 12,
    trips: 25,
    posts: 48,
    interests: ['Photography', 'Hiking', 'Local Cuisine'],
    mutualFriends: [],
    online: true,
    lastMessage: 'Hey, are you up for a trip to Kyoto?',
    unreadCount: 3,
    messages: [
      { id: '1', text: 'Hey, how are you?', sent: false, time: '10:30 AM' },
      { id: '2', text: 'I\'m good, thanks!', sent: true, time: '10:31 AM' },
      { id: '3', text: 'Want to plan a trip?', sent: false, time: '10:32 AM' }
    ]
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
    location: 'Paris, France',
    level: 18,
    points: 3200,
    countriesVisited: 15,
    trips: 32,
    posts: 67,
    interests: ['Food', 'Culture', 'Adventure'],
    mutualFriends: [],
    online: true,
    lastMessage: 'The Eiffel Tower was amazing!',
    unreadCount: 0,
    messages: [
      { id: '1', text: 'Paris is beautiful!', sent: false, time: '11:30 AM' },
      { id: '2', text: 'Yes, it\'s amazing!', sent: true, time: '11:31 AM' }
    ]
  }
];

// Set up mutual friends
mockUsers[0].mutualFriends = [mockUsers[1]];
mockUsers[1].mutualFriends = [mockUsers[0]];

// Mock Challenges
const mockChallenges: TravelChallenge[] = [
  {
    id: '1',
    title: 'Visit 5 UNESCO Sites',
    description: 'Visit and document 5 UNESCO World Heritage sites in 3 months',
    difficulty: 'Medium',
    participants: 128,
    reward: 500
  },
  {
    id: '2',
    title: 'Local Food Explorer',
    description: 'Try 10 different local dishes in a new country',
    difficulty: 'Easy',
    participants: 256,
    reward: 300
  },
  {
    id: '3',
    title: 'Mountain Peaks',
    description: 'Climb 3 different mountain peaks above 3000m',
    difficulty: 'Hard',
    participants: 64,
    reward: 1000
  }
];

// Mock Group Trips
const mockGroupTrips: GroupTrip[] = [
  {
    id: '1',
    title: 'Japan Cherry Blossom Tour',
    destination: 'Tokyo, Japan',
    date: 'April 2024',
    status: 'Upcoming',
    members: mockUsers
  },
  {
    id: '2',
    title: 'European Summer Adventure',
    destination: 'Paris, France',
    date: 'June 2024',
    status: 'Upcoming',
    members: mockUsers
  }
];

// API Services
export const api = {
  // Existing methods
  getAllUsers: () => Promise.resolve(mockUsers),
  getUsers: () => Promise.resolve(mockUsers),
  getUserProfile: (userId: string) => Promise.resolve(mockUsers.find(u => u.id === userId) || null),
  getLeaderboard: () => Promise.resolve(mockUsers.sort((a, b) => b.points - a.points)),
  getCurrentUser: () => Promise.resolve(mockUsers[0]),
  getChallenges: () => Promise.resolve(mockChallenges),
  getGroupTrips: () => Promise.resolve(mockGroupTrips),
  
  // New methods for current trip
  getCurrentTrip: () => Promise.resolve(mockCurrentTrip),
  
  createNewTrip: (tripData: Omit<CurrentTrip, 'id' | 'spentAmount' | 'progress' | 'itinerary'>) => {
    const newTrip: CurrentTrip = {
      id: Math.random().toString(),
      ...tripData,
      spentAmount: 0,
      progress: 0,
      itinerary: []
    };
    return Promise.resolve(newTrip);
  },
  
  updateTripProgress: (tripId: string, progress: number) => {
    return Promise.resolve({ success: true });
  },
  
  addItineraryItem: (tripId: string, item: Omit<ItineraryItem, 'id' | 'status'>) => {
    const newItem: ItineraryItem = {
      id: Math.random().toString(),
      ...item,
      status: 'upcoming'
    };
    return Promise.resolve(newItem);
  },
  
  updateItineraryItemStatus: (tripId: string, itemId: string, status: ItineraryItem['status']) => {
    return Promise.resolve({ success: true });
  },
  
  completeTrip: (tripId: string) => {
    return Promise.resolve({ success: true });
  },
  
  reportIssue: (tripId: string, issue: string) => {
    return Promise.resolve({ success: true });
  },

  // Existing methods
  sendMessage: (userId: string, message: string) => {
    const newMessage = {
      id: Math.random().toString(),
      text: message,
      sent: true,
      time: format(new Date(), 'h:mm a')
    };
    return Promise.resolve(newMessage);
  },
  
  searchLocations: (query: string) => Promise.resolve([
    {
      id: '1',
      name: 'Eiffel Tower',
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
      coordinates: { lat: 48.8584, lng: 2.2945 }
    },
    {
      id: '2',
      name: 'Tokyo Tower',
      address: '4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan',
      coordinates: { lat: 35.6586, lng: 139.7454 }
    }
  ].filter(place => 
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.address.toLowerCase().includes(query.toLowerCase())
  )),
  
  getWeatherUpdates: () => Promise.resolve({
    temperature: 22,
    condition: 'Sunny',
    forecast: [
      { day: 'Today', temp: 22, condition: 'Sunny' },
      { day: 'Tomorrow', temp: 20, condition: 'Cloudy' }
    ]
  })
};