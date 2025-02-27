import {
  TourPackage,
  Hotel,
  Participant,
  Review,
  AnalyticsData,
  Message,
  User
} from '../types';
import {
  tourPackages,
  hotels,
  analyticsData,
  messages,
  users
} from '../data/mockData';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(500);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return user;
  },

  // Tour Packages
  async getTourPackages(): Promise<TourPackage[]> {
    await delay(500);
    return tourPackages;
  },

  async getTourPackageById(id: string): Promise<TourPackage | null> {
    await delay(500);
    return tourPackages.find(pkg => pkg.id === id) || null;
  },

  async createTourPackage(data: Omit<TourPackage, 'id'>): Promise<TourPackage> {
    await delay(1000);
    const newPackage = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };
    tourPackages.push(newPackage);
    return newPackage;
  },

  async updateTourPackage(id: string, data: Partial<TourPackage>): Promise<TourPackage> {
    await delay(1000);
    const index = tourPackages.findIndex(pkg => pkg.id === id);
    if (index === -1) throw new Error('Package not found');
    
    tourPackages[index] = { ...tourPackages[index], ...data };
    return tourPackages[index];
  },

  async deleteTourPackage(id: string): Promise<void> {
    await delay(1000);
    const index = tourPackages.findIndex(pkg => pkg.id === id);
    if (index === -1) throw new Error('Package not found');
    tourPackages.splice(index, 1);
  },

  // Hotels
  async getHotels(): Promise<Hotel[]> {
    await delay(500);
    return hotels;
  },

  async getHotelById(id: string): Promise<Hotel | null> {
    await delay(500);
    return hotels.find(hotel => hotel.id === id) || null;
  },

  async createHotel(data: Omit<Hotel, 'id'>): Promise<Hotel> {
    await delay(1000);
    const newHotel = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };
    hotels.push(newHotel);
    return newHotel;
  },

  async updateHotel(id: string, data: Partial<Hotel>): Promise<Hotel> {
    await delay(1000);
    const index = hotels.findIndex(hotel => hotel.id === id);
    if (index === -1) throw new Error('Hotel not found');
    
    hotels[index] = { ...hotels[index], ...data };
    return hotels[index];
  },

  async deleteHotel(id: string): Promise<void> {
    await delay(1000);
    const index = hotels.findIndex(hotel => hotel.id === id);
    if (index === -1) throw new Error('Hotel not found');
    hotels.splice(index, 1);
  },

  // Participants
  async getParticipantsByPackage(packageId: string): Promise<Participant[]> {
    await delay(500);
    const pkg = tourPackages.find(p => p.id === packageId);
    return pkg?.participants || [];
  },

  async addParticipant(data: Omit<Participant, 'id'>): Promise<Participant> {
    await delay(1000);
    const newParticipant = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };
    
    const pkg = tourPackages.find(p => p.id === data.packageId);
    if (!pkg) throw new Error('Package not found');
    
    pkg.participants.push(newParticipant);
    return newParticipant;
  },

  // Reviews
  async addReview(data: Omit<Review, 'id'>): Promise<Review> {
    await delay(1000);
    const newReview = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };
    return newReview;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    await delay(1000);
    return analyticsData;
  },

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    await delay(500);
    return messages.filter(m => 
      m.senderId === userId || m.receiverId === userId
    );
  },

  async sendMessage(data: { senderId: string; receiverId: string; content: string }): Promise<Message> {
    await delay(500);
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      timestamp: new Date().toISOString(),
      read: false
    };
    messages.push(newMessage);
    return newMessage;
  },

  async markMessageAsRead(messageId: string): Promise<void> {
    await delay(200);
    const message = messages.find(m => m.id === messageId);
    if (message) message.read = true;
  }
};