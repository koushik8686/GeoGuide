import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Globe,
  Users,
  Trophy,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Camera,
  Flag,
  Compass,
  Map,
  Coffee,
  Music,
  Book,
  Award,
  Send
} from 'lucide-react';
import { api, UserProfile } from '../services/api';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const data = await api.getUserProfile(userId);
        setUser(data);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Cover Photo and Profile Info */}
      <div className="relative">
        <div className="h-80 overflow-hidden rounded-xl">
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-end gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {user.joinDate}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Follow
              </button>
              <button className="px-6 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-emerald-600" />
            <span className="text-sm text-emerald-600">+12.5%</span>
          </div>
          <h3 className="text-gray-600 mb-2">Travel Score</h3>
          <p className="text-2xl font-bold text-gray-800">{user.points} XP</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Globe className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600">Level {user.level}</span>
          </div>
          <h3 className="text-gray-600 mb-2">Countries Visited</h3>
          <p className="text-2xl font-bold text-gray-800">{user.countriesVisited}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Map className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-purple-600">This Year</span>
          </div>
          <h3 className="text-gray-600 mb-2">Total Trips</h3>
          <p className="text-2xl font-bold text-gray-800">{user.trips}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-yellow-600">+5.2%</span>
          </div>
          <h3 className="text-gray-600 mb-2">Followers</h3>
          <p className="text-2xl font-bold text-gray-800">{user.followers}</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b">
          <div className="flex">
            {['posts', 'trips', 'achievements', 'photos'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {user.userPosts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{user.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {post.location}
                      </div>
                    </div>
                  </div>
                  
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-96 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <p className="text-gray-800 mb-4">{post.caption}</p>
                  
                  <div className="flex items-center gap-6 text-gray-600">
                    <button className="flex items-center gap-2 hover:text-emerald-600">
                      <Heart className="w-5 h-5" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 hover:text-emerald-600">
                      <MessageSquare className="w-5 h-5" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-2 hover:text-emerald-600">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.userTrips.map(trip => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl overflow-hidden"
                >
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-2">{trip.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      {trip.date}
                    </div>
                    <p className="text-gray-600 mb-4">{trip.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {trip.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user.achievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{achievement.name}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.total}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.userPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button className="p-2 hover:text-emerald-400">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:text-emerald-400">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm mt-2">{photo.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}