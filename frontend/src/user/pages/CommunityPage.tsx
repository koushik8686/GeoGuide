import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy,
  Users,
  MapPin,
  Camera,
  Smartphone,
  Mic,
  Share2,
  Heart,
  MessageSquare,
  Star,
  Award,
  Target,
  Navigation,
  Watch,
  CloudSun,
  Volume2
} from 'lucide-react';
import { api, User, TravelChallenge, GroupTrip } from '../services/api';

export default function CommunityPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [challenges, setChallenges] = useState<TravelChallenge[]>([]);
  const [groupTrips, setGroupTrips] = useState<GroupTrip[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('achievements');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [user, board, challengesList, trips, weather] = await Promise.all([
          api.getCurrentUser(),
          api.getLeaderboard(),
          api.getChallenges(),
          api.getGroupTrips(),
          api.getWeatherUpdates()
        ]);

        setCurrentUser(user);
        setLeaderboard(board);
        setChallenges(challengesList);
        setGroupTrips(trips);
        setWeatherData(weather);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load user data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Community & Features</h1>
          <p className="text-gray-600">Connect, share, and explore with fellow travelers</p>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg"
          >
            <Trophy className="w-5 h-5" />
            <span className="font-medium">{currentUser.points} XP</span>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-lg"
          >
            <Star className="w-5 h-5" />
            <span className="font-medium">Level {currentUser.level}</span>
          </motion.div>
        </div>
      </div>

      {/* Smart Device Integration Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Watch className="w-5 h-5 text-blue-500" />
              <span>Connected</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CloudSun className="w-5 h-5 text-yellow-500" />
              <span>{weatherData?.temperature}°C, {weatherData?.condition}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Volume2 className="w-5 h-5 text-green-500" />
              <span>Voice Ready</span>
            </div>
          </div>
          <button className="text-emerald-600 hover:text-emerald-700">
            Manage Devices
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Achievements and Challenges */}
        <div className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
              <div className="space-y-4">
                {currentUser.achievements?.map(achievement => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{achievement.name}</span>
                      <span>{achievement.progress}/{achievement.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {currentUser.badges?.map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Challenges</h2>
            <div className="space-y-4">
              {challenges.map(challenge => (
                <div
                  key={challenge.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{challenge.title}</h3>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {challenge.participants} participants
                    </span>
                    <span className="text-emerald-600 font-medium">
                      +{challenge.reward} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Middle Column - AR and Social Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">AR Navigation</h2>
              <button className="text-emerald-600 hover:text-emerald-700">
                Open AR View
              </button>
            </div>
            <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=2073&auto=format&fit=crop"
                alt="Map View"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium">Shibuya Crossing</span>
                    </div>
                    <span className="text-sm text-gray-600">0.2 km away</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    World's busiest pedestrian crossing. Peak times: 3pm - 7pm
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nearby Travelers</h2>
            <div className="space-y-4">
              {leaderboard.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{user.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>0.5 km away</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm hover:bg-emerald-100">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Group Trips and Leaderboard */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Group Trips</h2>
            <div className="space-y-4">
              {groupTrips.map(trip => (
                <div
                  key={trip.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{trip.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trip.status === 'Upcoming' 
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {trip.members.map((member, index) => (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full border-2 border-white"
                          style={{ zIndex: trip.members.length - index }}
                        />
                      ))}
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Create New Group Trip
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Leaderboard</h2>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center font-medium text-gray-600">
                      #{index + 1}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{user.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>{user.points} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Level {user.level}
                    </span>
                    {index === 0 && (
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        👑
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}