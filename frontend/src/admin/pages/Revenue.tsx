import React, { useEffect, useState } from 'react';
import { ChevronDown, Download, TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Users } from 'lucide-react';
import { api } from '../services/api';
import type { Transaction } from '../types';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ComposedChart, Scatter
} from 'recharts';

const Revenue: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await api.transactions.getAll();
      setTransactions(data);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  // Monthly revenue data
  const monthlyRevenue = [
    { name: 'Jan', revenue: 18500, target: 17000, growth: 8.2 },
    { name: 'Feb', revenue: 22300, target: 20000, growth: 11.5 },
    { name: 'Mar', revenue: 26800, target: 25000, growth: 7.2 },
    { name: 'Apr', revenue: 23400, target: 24000, growth: -2.5 },
    { name: 'May', revenue: 29700, target: 27000, growth: 10.0 },
    { name: 'Jun', revenue: 32100, target: 30000, growth: 7.0 },
    { name: 'Jul', revenue: 38500, target: 35000, growth: 10.0 },
    { name: 'Aug', revenue: 42300, target: 40000, growth: 5.8 },
    { name: 'Sep', revenue: 39800, target: 42000, growth: -5.2 },
    { name: 'Oct', revenue: 45400, target: 44000, growth: 3.2 },
    { name: 'Nov', revenue: 49700, target: 48000, growth: 3.5 },
    { name: 'Dec', revenue: 52100, target: 50000, growth: 4.2 },
  ];

  // Revenue by tour type
  const revenueByTourType = [
    { name: 'Adventure', value: 35 },
    { name: 'Cultural', value: 25 },
    { name: 'Beach', value: 20 },
    { name: 'Urban', value: 15 },
    { name: 'Mountain', value: 5 },
  ];

  // Revenue by payment method
  const revenueByPaymentMethod = [
    { name: 'Credit Card', value: 65 },
    { name: 'PayPal', value: 20 },
    { name: 'Bank Transfer', value: 10 },
    { name: 'Crypto', value: 5 },
  ];

  // Revenue by customer age group
  const revenueByAgeGroup = [
    { name: '18-24', revenue: 42300 },
    { name: '25-34', revenue: 78500 },
    { name: '35-44', revenue: 95700 },
    { name: '45-54', revenue: 48200 },
    { name: '55-64', revenue: 15400 },
    { name: '65+', revenue: 4200 },
  ];

  // Revenue vs Bookings
  const revenueVsBookings = [
    { name: 'Jan', revenue: 18500, bookings: 85 },
    { name: 'Feb', revenue: 22300, bookings: 102 },
    { name: 'Mar', revenue: 26800, bookings: 120 },
    { name: 'Apr', revenue: 23400, bookings: 98 },
    { name: 'May', revenue: 29700, bookings: 135 },
    { name: 'Jun', revenue: 32100, bookings: 142 },
    { name: 'Jul', revenue: 38500, bookings: 168 },
    { name: 'Aug', revenue: 42300, bookings: 185 },
    { name: 'Sep', revenue: 39800, bookings: 172 },
    { name: 'Oct', revenue: 45400, bookings: 198 },
    { name: 'Nov', revenue: 49700, bookings: 215 },
    { name: 'Dec', revenue: 52100, bookings: 225 },
  ];

  // Revenue by destination
  const revenueByDestination = [
    { name: 'Europe', revenue: 125000 },
    { name: 'Asia', revenue: 85000 },
    { name: 'North America', revenue: 65000 },
    { name: 'South America', revenue: 35000 },
    { name: 'Africa', revenue: 15000 },
    { name: 'Australia', revenue: 10000 },
  ];

  const COLORS = ['#8b5cf6', '#6d28d9', '#4c1d95', '#2e1065', '#7e22ce', '#a855f7'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Revenue Overview
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 flex items-center gap-2 bg-white">
            This Month <ChevronDown className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-indigo-600" />
            </div>
            <h4 className="text-gray-600">Total Revenue</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">$284,392</p>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <p className="text-sm">+15.3% from last month</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="text-gray-600">Average Order Value</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">$1,247</p>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <p className="text-sm">+5.2% from last month</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Users className="h-5 w-5 text-rose-600" />
            </div>
            <h4 className="text-gray-600">Conversion Rate</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">3.2%</p>
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="h-4 w-4" />
            <p className="text-sm">-0.4% from last month</p>
          </div>
        </div>
      </div>

      {/* Monthly Revenue vs Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Monthly Revenue vs Target
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyRevenue}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' || name === 'target' ? `$${value}` : `${value}%`,
                  name === 'revenue' ? 'Revenue' : name === 'target' ? 'Target' : 'Growth'
                ]} />
                <Legend />
                <Bar dataKey="revenue" barSize={20} fill="#8b5cf6" />
                <Line type="monotone" dataKey="target" stroke="#ff7300" />
                <Scatter dataKey="growth" fill="red" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Tour Type */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Revenue by Tour Type
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByTourType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueByTourType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Payment Method */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Revenue by Payment Method
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Age Group */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Revenue by Customer Age Group
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByAgeGroup}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8b5cf6">
                  {revenueByAgeGroup.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Bookings */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Revenue vs Bookings
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueVsBookings}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value}` : value,
                  name === 'revenue' ? 'Revenue' : 'Bookings'
                ]} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#6d28d9"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Destination */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Revenue by Destination
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={revenueByDestination}
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8b5cf6">
                  {revenueByDestination.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600">Tour Package</th>
                <th className="text-left py-3 px-4 text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{transaction.userName}</td>
                  <td className="py-3 px-4 text-gray-600">{transaction.tourName}</td>
                  <td className="py-3 px-4 text-gray-800">${transaction.amount}</td>
                  <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-700'
                        : transaction.status === 'Refunded'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;