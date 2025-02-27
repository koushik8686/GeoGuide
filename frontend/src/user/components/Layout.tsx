import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User,
  Home,
  Compass,
  History,
  Calendar,
  Package,
  Hotel,
  Map,
  PieChart,
  Menu,
  X,
  Users as UsersIcon,
  Trophy,
  MessageSquare,
  Settings,
  LogOut,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { GOOGLE_AUTH_URL } from '../../constants/urls';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:4000/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/user', icon: Home, label: 'Dashboard' },
    { path: '/user/explore', icon: Compass, label: 'Explore' },
    { path: '/user/calendar', icon: Calendar, label: 'Trip Planner' },
    { path: '/user/packages', icon: Package, label: 'Packages' },
    {path: '/user/hotels', icon: Hotel, label: 'Hotel'},
    {path: '/user/history', icon: History, label: 'History'},
    { path: '/user/analytics', icon: PieChart, label: 'Analytics' },
    { path: '/user/community', icon: Trophy, label: 'Community' },
    { path: '/user/users', icon: MessageSquare, label: 'Messages' },
    { path: '/user/people', icon: UsersIcon, label: 'People' }
  ];

  const notifications = [
    { id: 1, title: 'New trip suggestion', message: 'Check out this amazing deal to Paris!', time: '5m ago' },
    { id: 2, title: 'Friend request', message: 'Sarah wants to connect with you', time: '1h ago' },
    { id: 3, title: 'Trip reminder', message: 'Your flight to Tokyo is in 3 days', time: '2h ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link 
                to="/" 
                className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2"
              >
                <Compass className="w-5 h-5" />
                <span className="bg-gradient-to-r from-emerald-600 to-blue-500 text-transparent bg-clip-text">
                  GeoGuide
                </span>
              </Link>
              <div className="hidden lg:flex items-center gap-1">
                {navigationItems.map(item => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
      
             
              <div className="relative">
                {isLoading ? (
                  <div className="p-2">
                    <Loader className="w-5 h-5 animate-spin text-emerald-600" />
                  </div>
                ) : user ? (
                  <button 
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    {user.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>
                ) : (
                  <a 
                    href={GOOGLE_AUTH_URL}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                    onClick={() => setIsLoading(true)}
                  >
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      className="w-3 h-4"
                    />
                    Sign in with Google
                  </a>
                )}
                <AnimatePresence>
                  {isProfileOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border"
                    >
                      <div className="px-4 py-2 border-b">
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button 
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-40"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-1">
                {navigationItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-1 px-3 py-3 rounded-lg transition-all ${
                      isActive(item.path) 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {/* {item.label} */}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}