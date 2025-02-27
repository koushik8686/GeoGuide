import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  MapPin,
  Users,
  Trophy,
  Star,
  Filter,
  Globe,
  Flag,
  Camera,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';
import { api, User } from '../services/api';

export default function PeoplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await api.getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedFilter === 'all' || user.level >= parseInt(selectedFilter))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Travel Community</h1>
          <p className="text-gray-600">Connect with fellow travelers around the world</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="10">Level 10+</option>
            <option value="20">Level 20+</option>
            <option value="30">Level 30+</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search travelers by name, location, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/people/${user.id}`)}
          >
            <div className="relative">
              <img
                src={user.coverPhoto}
                alt={`${user.name}'s cover`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute -bottom-10 left-6">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
              </div>
            </div>
            <div className="pt-12 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-emerald-600">
                    <Trophy className="w-4 h-4 mr-1" />
                    Level {user.level}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {user.points} XP
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {user.countriesVisited} countries
                </div>
                <div className="flex items-center">
                  <Flag className="w-4 h-4 mr-1" />
                  {user.trips} trips
                </div>
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  {user.posts} posts
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <div className="flex -space-x-2">
                  {user.mutualFriends.map((friend, index) => (
                    <img
                      key={index}
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                  {user.mutualFriends.length > 0 && (
                    <span className="ml-4 text-sm text-gray-600">
                      {user.mutualFriends.length} mutual friends
                    </span>
                  )}
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}