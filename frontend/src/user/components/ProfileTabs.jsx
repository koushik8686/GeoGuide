import React, { useState } from 'react';
import { User, Transaction, Notification, HistoryItem } from '../types/user';
import { 
  MapPin, 
  Users, 
  Clock, 
  Bell, 
  CreditCard, 
  Tag, 
  Calendar,
  Map,
  User as UserIcon,
  AlertCircle,
  Compass,
  ArrowUp,
  ArrowDown,
  Zap,
  MessageSquare,
  ChevronRight,
  Activity,
  Bookmark,
  PlusCircle
} from 'lucide-react';

interface ProfileTabsProps {
  user: User;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('trips');
  
  const tabs = [
    { id: 'trips', label: 'Trips', icon: <Compass size={18} /> },
    { id: 'friends', label: 'Friends', icon: <Users size={18} /> },
    { id: 'history', label: 'History', icon: <Activity size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard size={18} /> },
  ];

  // Generate solid colors for cards
  const getCardColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-amber-500',
      'bg-red-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  // Generate random trip names
  const getTripName = (index: number) => {
    const destinations = [
      'Mountain Adventure',
      'Beach Getaway',
      'City Exploration',
      'Countryside Retreat',
      'Island Hopping',
      'Desert Expedition'
    ];
    return destinations[index % destinations.length];
  };

  // Generate random friend names
  const getFriendName = (index: number) => {
    const names = [
      'Alex Johnson',
      'Sam Williams',
      'Taylor Smith',
      'Jordan Brown',
      'Casey Davis',
      'Riley Wilson'
    ];
    return names[index % names.length];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trips':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Trips</h2>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.trips && user.trips.length > 0 ? (
                user.trips.map((trip, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
                    <div className={`h-32 ${getCardColor(index)} flex items-center justify-center`}>
                      <Map size={40} className="text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{getTripName(index)}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>Trip #{index + 1}</span>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {['Completed', 'Upcoming', 'In Progress'][index % 3]}
                        </span>
                        <button className="text-blue-600 text-sm hover:text-blue-800">Details</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Compass size={48} className="text-gray-400" />
                  <p className="mt-2 text-gray-500">No trips recorded yet</p>
                  <button className="mt-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <PlusCircle size={16} className="mr-2" />
                    Plan a Trip
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'friends':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Friends</h2>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition">
                Find Friends <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.friends && user.friends.length > 0 ? (
                user.friends.map((friend, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center hover:shadow-lg transition">
                    <div className={`w-12 h-12 rounded-full ${getCardColor(index)} flex items-center justify-center text-white font-bold`}>
                      {getFriendName(index).charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">{getFriendName(index)}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={12} className="mr-1" />
                        <span>{['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Denver'][index % 6]}</span>
                      </div>
                    </div>
                    <button className="ml-auto text-blue-600 hover:text-blue-800">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Users size={48} className="text-gray-400" />
                  <p className="mt-2 text-gray-500">No friends added yet</p>
                  <button className="mt-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <PlusCircle size={16} className="mr-2" />
                    Find Friends
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'history':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Activity History</h2>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            {user.history && user.history.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {user.history.map((item: HistoryItem, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${getCardColor(index)}`}>
                            <Tag size={16} className="text-white" />
                          </div>
                          <span className="ml-2 font-medium capitalize">{item.tag}</span>
                        </div>
                        <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                          {item.count} trips
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getCardColor(index)}`} 
                            style={{ width: `${Math.min(item.count * 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Activity size={48} className="text-gray-400" />
                <p className="mt-2 text-gray-500">No history available</p>
              </div>
            )}
          </div>
        );
      
      case 'notifications':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition">
                Mark All Read <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {user.notifications && user.notifications.length > 0 ? (
                user.notifications.map((notification: Notification, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${getCardColor(index)} shrink-0`}>
                        <Bell size={16} className="text-white" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{notification.sender}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{notification.message}</p>
                        {notification.location && (
                          <div className="mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full inline-flex items-center">
                            <MapPin size={12} className="mr-1" />
                            <span>
                              {notification.location.latitude.toFixed(2)}, {notification.location.longitude.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Bell size={48} className="text-gray-400" />
                  <p className="mt-2 text-gray-500">No notifications</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'transactions':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {user.transactions && user.transactions.length > 0 ? (
                user.transactions.map((transaction: Transaction, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${transaction.amount > 0 ? 'bg-green-500' : 'bg-red-500'} shrink-0`}>
                        {transaction.amount > 0 ? 
                          <ArrowUp size={20} className="text-white" /> : 
                          <ArrowDown size={20} className="text-white" />
                        }
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{transaction.receiver}</h3>
                          <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.bank}</p>
                        <p className="text-gray-700 mt-1">{transaction.message}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {transaction.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <CreditCard size={48} className="text-gray-400" />
                  <p className="mt-2 text-gray-500">No transactions</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <AlertCircle size={48} className="text-gray-400" />
            <p className="mt-2 text-gray-500">Tab content not available</p>
          </div>
        );
    }
  };
  
  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className={`mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfileTabs;