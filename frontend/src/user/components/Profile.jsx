import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import { User } from './types/user';

function Profile() {
  // Mock user data based on your schema
  const mockUser: User = {
    _id: '60d21b4667d0d8992e610c85',
    email: 'johndoe@example.com',
    name: 'John Doe',
    phoneNumber: '+1 (555) 123-4567',
    profilePicture: '',
    registrationDate: new Date('2023-01-15'),
    lastLogin: new Date('2023-06-20'),
    distance_travelled: 1250,
    experience: 4500,
    level: 12,
    badges: '8',
    followers: ['user1', 'user2', 'user3', 'user4', 'user5'],
    verified: true,
    events: [],
    history: [
      { tag: 'hiking', count: 15 },
      { tag: 'camping', count: 7 },
      { tag: 'city tour', count: 12 },
      { tag: 'beach', count: 5 }
    ],
    trips: ['trip1', 'trip2', 'trip3'],
    friends: ['friend1', 'friend2', 'friend3', 'friend4'],
    calenderEvents: [],
    transactions: [
      {
        receiver: 'Mountain Gear Shop',
        message: 'Hiking equipment purchase',
        amount: -250,
        category: 'Shopping',
        bank: 'Chase Bank',
        rawMessage: 'POS DEBIT - Mountain Gear Shop - $250.00',
        timestamp: new Date('2023-05-15'),
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10
        }
      },
      {
        receiver: 'Travel Reimbursement',
        message: 'Company trip reimbursement',
        amount: 350,
        category: 'Income',
        bank: 'Chase Bank',
        rawMessage: 'CREDIT - Travel Reimbursement - $350.00',
        timestamp: new Date('2023-05-20'),
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10
        }
      },
      {
        receiver: 'Mountain View Hotel',
        message: 'Hotel booking',
        amount: -180,
        category: 'Travel',
        bank: 'Chase Bank',
        rawMessage: 'POS DEBIT - Mountain View Hotel - $180.00',
        timestamp: new Date('2023-06-01'),
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10
        }
      }
    ],
    notifications: [
      {
        sender: 'TripBuddy',
        message: 'Your trip to San Francisco has been confirmed!',
        timestamp: new Date('2023-05-10'),
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10
        }
      },
      {
        sender: 'Alex Smith',
        message: 'Hey, are you still planning to join the hiking trip next weekend?',
        timestamp: new Date('2023-05-25'),
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10
        }
      },
      {
        sender: 'TripBuddy',
        message: 'Reminder: Your hotel check-in is tomorrow at 3 PM.',
        timestamp: new Date('2023-05-31'),
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ProfileHeader user={mockUser} />
          
          <div className="px-6 pb-6">
            <ProfileTabs user={mockUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;