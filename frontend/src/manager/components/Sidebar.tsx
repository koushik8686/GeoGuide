import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Hotel, 
  Package, 
  Globe2,
  MessageSquare,
  UserCircle,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard', path: '/manager' },
  { id: 'packages', icon: Package, label: 'Tour Packages', path: '/manager/packages' },
  { id: 'hotels', icon: Hotel, label: 'Hotels', path: '/manager/hotels' },
  { id: 'chat', icon: MessageSquare, label: 'Messages', path: '/manager/chat' },
  { id: 'profile', icon: UserCircle, label: 'Profile', path: '/manager/profile' },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all duration-300"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed w-64 h-full bg-indigo-600 transform transition-transform duration-300 ease-in-out z-40 shadow-xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-indigo-500">
          <div className="p-2 bg-white/10 rounded-lg">
            <Globe2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Globe Mate</h1>
            <p className="text-xs text-indigo-200">Tourism Manager</p>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-white/15 text-white shadow-lg' 
                  : 'text-indigo-100 hover:bg-white/10'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-500">
          <div className="flex items-center gap-3 text-white">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-indigo-400"
            />
            <div>
              <p className="font-medium">John Smith</p>
              <p className="text-xs text-indigo-200">Tour Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}