import React, { useEffect, useState } from 'react';
import { Users, Map, TrendingUp, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import type { DashboardStats } from '../types';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await api.stats.getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>;
  }

  // Monthly revenue data
  const revenueData = [
    { name: 'Jan', revenue: 18500 },
    { name: 'Feb', revenue: 22300 },
    { name: 'Mar', revenue: 26800 },
    { name: 'Apr', revenue: 23400 },
    { name: 'May', revenue: 29700 },
    { name: 'Jun', revenue: 32100 },
    { name: 'Jul', revenue: 38500 },
    { name: 'Aug', revenue: 42300 },
    { name: 'Sep', revenue: 39800 },
    { name: 'Oct', revenue: 45400 },
    { name: 'Nov', revenue: 49700 },
    { name: 'Dec', revenue: 52100 },
  ];

  // User growth data
  const userGrowthData = [
    { name: 'Jan', users: 15200 },
    { name: 'Feb', users: 16800 },
    { name: 'Mar', users: 18300 },
    { name: 'Apr', users: 19500 },
    { name: 'May', users: 20700 },
    { name: 'Jun', users: 21900 },
    { name: 'Jul', users: 22800 },
    { name: 'Aug', users: 23500 },
    { name: 'Sep', users: 24100 },
    { name: 'Oct', users: 24500 },
    { name: 'Nov', users: 24700 },
    { name: 'Dec', users: 24853 },
  ];

  // Booking by destination
  const bookingsByDestination = [
    { name: 'Europe', value: 45 },
    { name: 'Asia', value: 25 },
    { name: 'North America', value: 20 },
    { name: 'South America', value: 5 },
    { name: 'Africa', value: 3 },
    { name: 'Australia', value: 2 },
  ];

  // Tour package performance
  const tourPerformance = [
    { name: 'Paris Explorer', bookings: 45, revenue: 58455, rating: 4.8 },
    { name: 'Tokyo Adventure', bookings: 32, revenue: 79968, rating: 4.9 },
    { name: 'New York City Tour', bookings: 28, revenue: 27972, rating: 4.7 },
    { name: 'Rome Getaway', bookings: 24, revenue: 28776, rating: 4.6 },
    { name: 'Bali Paradise', bookings: 22, revenue: 43978, rating: 4.8 },
  ];

  // User activity by hour
  const userActivity = [
    { hour: '00', users: 120 },
    { hour: '02', users: 80 },
    { hour: '04', users: 60 },
    { hour: '06', users: 180 },
    { hour: '08', users: 460 },
    { hour: '10', users: 720 },
    { hour: '12', users: 840 },
    { hour: '14', users: 780 },
    { hour: '16', users: 840 },
    { hour: '18', users: 920 },
    { hour: '20', users: 760 },
    { hour: '22', users: 320 },
  ];

  // Tour rating metrics
  const tourRatingMetrics = [
    { subject: 'Accommodation', A: 4.8, B: 4.2 },
    { subject: 'Food', A: 4.6, B: 4.3 },
    { subject: 'Transport', A: 4.7, B: 4.0 },
    { subject: 'Activities', A: 4.9, B: 4.5 },
    { subject: 'Guide', A: 4.8, B: 4.4 },
    { subject: 'Value', A: 4.5, B: 4.1 },
  ];

  const COLORS = ['#8b5cf6', '#6d28d9', '#4c1d95', '#2e1065', '#7e22ce', '#a855f7'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/90">Total Users</h3>
            <Users className="h-6 w-6 text-white/80" />
          </div>
          <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          <div className="flex items-center text-indigo-200 text-sm mt-2">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>{stats.userGrowth}% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/90">Active Tours</h3>
            <Map className="h-6 w-6 text-white/80" />
          </div>
          <p className="text-3xl font-bold">{stats.activeTours}</p>
          <div className="flex items-center text-emerald-200 text-sm mt-2">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>{stats.tourGrowth}% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/90">Revenue</h3>
            <DollarSign className="h-6 w-6 text-white/80" />
          </div>
          <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
          <div className="flex items-center text-rose-200 text-sm mt-2">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>{stats.revenueGrowth}% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/90">Bookings</h3>
            <Calendar className="h-6 w-6 text-white/80" />
          </div>
          <p className="text-3xl font-bold">{stats.totalBookings.toLocaleString()}</p>
          <div className="flex items-center text-amber-200 text-sm mt-2">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>{stats.bookingGrowth}% this month</span>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Revenue Trend (2024)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            User Growth (2024)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userGrowthData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Users']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#6d28d9"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Destination */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Bookings by Destination
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingsByDestination}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingsByDestination.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Bookings']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tour Package Performance */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Top Tour Packages
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tourPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [name === 'revenue' ? `$${value}` : value, name === 'revenue' ? 'Revenue' : 'Bookings']} />
                <Legend />
                <Bar dataKey="bookings" fill="#8b5cf6" />
                <Bar dataKey="revenue" fill="#6d28d9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity by Hour */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            User Activity by Hour
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={userActivity}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => [value, 'Active Users']} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tour Rating Metrics */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Tour Quality Metrics
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={120} data={tourRatingMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar
                  name="Premium Tours"
                  dataKey="A"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Standard Tours"
                  dataKey="B"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip formatter={(value) => [value, 'Rating']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;