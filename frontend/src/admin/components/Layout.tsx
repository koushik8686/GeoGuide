import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, BarChart3, Users, Map, DollarSign, Calendar, Bell, User, Menu, MessageCircle } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6 space-y-6 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <Globe className="h-8 w-8 text-indigo-600" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            GlobeMate
          </h1>
        </div>
        
        <nav className="space-y-2">
          <Link 
            to="/admin"
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
              isActive('/admin') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/users"
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
              isActive('/admin/users') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Users</span>
          </Link>
          <Link 
            to="/admin/tours"
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
              isActive('/admin/tours') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Map className="h-5 w-5" />
            <span>Tour Packages</span>
          </Link>
          <Link 
            to="/admin/revenue"
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
              isActive('/admin/revenue') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="h-5 w-5" />
            <span>Revenue</span>
          </Link>
          <Link 
            to="/admin/bookings"
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
              isActive('/admin/bookings') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 p-4 flex justify-between items-center">
          <button className="md:hidden text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-gray-800">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;