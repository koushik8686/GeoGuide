import axios from 'axios';
import { User, Tour, Booking, Transaction, Message, Chat } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', joinedDate: '2024-02-15', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinedDate: '2024-02-14', status: 'Inactive' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinedDate: '2024-02-13', status: 'Active' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', joinedDate: '2024-02-12', status: 'Active' },
];

const mockTours: Tour[] = [
  { 
    id: 1, 
    name: 'Paris Explorer', 
    price: 1299, 
    duration: '7 days', 
    bookings: 45,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800',
    description: 'Experience the magic of Paris with our guided tour package.',
    destination: 'Paris, France',
    rating: 4.8,
    startDate: '2024-04-15',
    endDate: '2024-04-22',
    maxParticipants: 20,
    currentParticipants: 15
  },
  { 
    id: 2, 
    name: 'Tokyo Adventure', 
    price: 2499, 
    duration: '10 days', 
    bookings: 32,
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=800',
    description: 'Discover the vibrant culture of Tokyo.',
    destination: 'Tokyo, Japan',
    rating: 4.9,
    startDate: '2024-05-01',
    endDate: '2024-05-10',
    maxParticipants: 15,
    currentParticipants: 12
  },
  { 
    id: 3, 
    name: 'New York City Tour', 
    price: 999, 
    duration: '5 days', 
    bookings: 28,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
    description: 'Explore the Big Apple with our comprehensive city tour.',
    destination: 'New York, USA',
    rating: 4.7,
    startDate: '2024-06-01',
    endDate: '2024-06-05',
    maxParticipants: 25,
    currentParticipants: 18
  },
];

const mockBookings: Booking[] = [
  { 
    id: 'BK001', 
    customerId: 1, 
    customerName: 'John Doe',
    tourId: 1, 
    tourName: 'Paris Explorer',
    date: '2024-03-15', 
    status: 'Confirmed', 
    amount: 1299,
    participants: 2
  },
  { 
    id: 'BK002', 
    customerId: 2, 
    customerName: 'Jane Smith',
    tourId: 2, 
    tourName: 'Tokyo Adventure',
    date: '2024-03-20', 
    status: 'Pending', 
    amount: 2499,
    participants: 1
  },
  { 
    id: 'BK003', 
    customerId: 3, 
    customerName: 'Mike Johnson',
    tourId: 3, 
    tourName: 'New York City Tour',
    date: '2024-03-25', 
    status: 'Confirmed', 
    amount: 999,
    participants: 3
  },
];

const mockTransactions: Transaction[] = [
  { 
    id: 1, 
    userId: 1, 
    userName: 'John Doe',
    tourId: 1, 
    tourName: 'Paris Explorer',
    amount: 1299, 
    date: '2024-02-15',
    paymentMethod: 'Credit Card',
    status: 'Completed'
  },
  { 
    id: 2, 
    userId: 2, 
    userName: 'Jane Smith',
    tourId: 2, 
    tourName: 'Tokyo Adventure',
    amount: 2499, 
    date: '2024-02-14',
    paymentMethod: 'PayPal',
    status: 'Completed'
  },
];

const mockChats: Chat[] = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    lastMessage: 'When does the Paris tour start?',
    unreadCount: 2,
    lastMessageTime: '2024-03-15 14:30',
    status: 'active'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Smith',
    lastMessage: 'Thanks for your help!',
    unreadCount: 0,
    lastMessageTime: '2024-03-14 16:45',
    status: 'resolved'
  }
];

const mockMessages: Message[] = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    userType: 'customer',
    content: 'Hi, I have a question about the Paris tour.',
    timestamp: '2024-03-15 14:25',
    read: true
  },
  {
    id: 2,
    userId: 1,
    userName: 'Support Team',
    userType: 'admin',
    content: 'Hello! How can I help you with the Paris tour?',
    timestamp: '2024-03-15 14:28',
    read: true
  },
  {
    id: 3,
    userId: 1,
    userName: 'John Doe',
    userType: 'customer',
    content: 'When does the Paris tour start?',
    timestamp: '2024-03-15 14:30',
    read: false
  }
];

// API service
export const api = {
  users: {
    getAll: async () => {
      await delay(500);
      return mockUsers;
    },
    getById: async (id: number) => {
      await delay(300);
      return mockUsers.find(user => user.id === id);
    },
  },
  tours: {
    getAll: async () => {
      await delay(500);
      return mockTours;
    },
    getById: async (id: number) => {
      await delay(300);
      return mockTours.find(tour => tour.id === id);
    },
  },
  bookings: {
    getAll: async () => {
      await delay(500);
      return mockBookings;
    },
    getById: async (id: string) => {
      await delay(300);
      return mockBookings.find(booking => booking.id === id);
    },
  },
  transactions: {
    getAll: async () => {
      await delay(500);
      return mockTransactions;
    },
    getRecentTransactions: async () => {
      await delay(300);
      return mockTransactions.slice(0, 5);
    },
  },
  stats: {
    getDashboardStats: async () => {
      await delay(500);
      return {
        totalUsers: 24853,
        activeTours: 156,
        totalRevenue: 284392,
        totalBookings: 1284,
        userGrowth: 12,
        tourGrowth: 8,
        revenueGrowth: 15,
        bookingGrowth: 10,
      };
    },
  },
  chats: {
    getAll: async () => {
      await delay(500);
      return mockChats;
    },
    getMessages: async (chatId: number) => {
      await delay(300);
      return mockMessages.filter(msg => msg.userId === chatId);
    },
    sendMessage: async (chatId: number, content: string) => {
      await delay(300);
      const newMessage: Message = {
        id: mockMessages.length + 1,
        userId: chatId,
        userName: 'Support Team',
        userType: 'admin',
        content,
        timestamp: new Date().toISOString(),
        read: true
      };
      mockMessages.push(newMessage);
      return newMessage;
    }
  }
};