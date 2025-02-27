import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  Edit2,
  Trash2,
  Plus,
  Tag,
  MapPin,
  User,
  Filter,
  ArrowUp,
  ArrowDown,
  Search
} from 'lucide-react';

// Dummy transaction data
const transactions = [
  {
    id: 1,
    amount: 156.50,
    receiver: "Sakura Restaurant",
    location: "Tokyo, Japan",
    date: "2024-03-15",
    category: "Food",
    trip: "Tokyo Explorer"
  },
  {
    id: 2,
    amount: 89.99,
    receiver: "Tokyo Metro",
    location: "Tokyo, Japan",
    date: "2024-03-15",
    category: "Transportation",
    trip: "Tokyo Explorer"
  },
  {
    id: 3,
    amount: 45.00,
    receiver: "TeamLab Borderless",
    location: "Tokyo, Japan",
    date: "2024-03-16",
    category: "Entertainment",
    trip: "Tokyo Explorer"
  },
  {
    id: 4,
    amount: 220.00,
    receiver: "Eiffel Tower Tours",
    location: "Paris, France",
    date: "2024-05-16",
    category: "Entertainment",
    trip: "Paris Adventure"
  },
  {
    id: 5,
    amount: 180.00,
    receiver: "Le Petit Bistro",
    location: "Paris, France",
    date: "2024-05-17",
    category: "Food",
    trip: "Paris Adventure"
  }
];

// Spending by category data for pie chart
const categorySpending = [
  { category: "Food", amount: 850, color: "bg-emerald-500" },
  { category: "Transportation", amount: 450, color: "bg-blue-500" },
  { category: "Entertainment", amount: 620, color: "bg-purple-500" },
  { category: "Shopping", amount: 340, color: "bg-yellow-500" },
  { category: "Accommodation", amount: 1200, color: "bg-red-500" }
];

// Monthly spending data for line chart
const monthlySpending = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 2200 },
  { month: "Apr", amount: 1500 },
  { month: "May", amount: 2800 },
  { month: "Jun", amount: 2100 }
];

function SpendingChart() {
  const maxAmount = Math.max(...monthlySpending.map(item => item.amount));
  
  return (
    <div className="h-64 flex items-end justify-between gap-2">
      {monthlySpending.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.amount / maxAmount) * 100}%` }}
            className="w-full bg-emerald-500 rounded-t-lg"
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
          <div className="text-xs text-gray-600 mt-2">{item.month}</div>
        </div>
      ))}
    </div>
  );
}

function CategoryPieChart() {
  const total = categorySpending.reduce((sum, item) => sum + item.amount, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {categorySpending.map((category, index) => {
          const percentage = (category.amount / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          return (
            <motion.path
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              d={`
                M 50 50
                L ${50 + 40 * Math.cos((startAngle * Math.PI) / 180)} ${
                50 + 40 * Math.sin((startAngle * Math.PI) / 180)
              }
                A 40 40 0 ${angle > 180 ? 1 : 0} 1 ${
                50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180)
              } ${50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180)}
                Z
              `}
              className={category.color}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function AnalyticsPage() {
  const [selectedTrip, setSelectedTrip] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<number | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesTrip = selectedTrip === "all" || transaction.trip === selectedTrip;
    const matchesSearch = transaction.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTrip && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Analytics</h1>
          <p className="text-gray-600">Track and manage your travel expenses</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm text-emerald-600">+12.5%</span>
          </div>
          <h3 className="text-gray-600 mb-2">Total Spent</h3>
          <p className="text-2xl font-bold text-gray-800">$3,460</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-red-600">+8.2%</span>
          </div>
          <h3 className="text-gray-600 mb-2">Average per Trip</h3>
          <p className="text-2xl font-bold text-gray-800">$1,150</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-emerald-600">-3.1%</span>
          </div>
          <h3 className="text-gray-600 mb-2">This Month</h3>
          <p className="text-2xl font-bold text-gray-800">$890</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <PieChart className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-emerald-600">+5.4%</span>
          </div>
          <h3 className="text-gray-600 mb-2">Budget Used</h3>
          <p className="text-2xl font-bold text-gray-800">68%</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Monthly Spending</h3>
          <SpendingChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Spending by Category</h3>
          <div className="flex items-center justify-between">
            <CategoryPieChart />
            <div className="space-y-4">
              {categorySpending.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="text-sm text-gray-600">{category.category}</span>
                  <span className="text-sm font-medium">${category.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedTrip}
              onChange={(e) => setSelectedTrip(e.target.value)}
            >
              <option value="all">All Trips</option>
              <option value="Tokyo Explorer">Tokyo Explorer</option>
              <option value="Paris Adventure">Paris Adventure</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Date</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Receiver</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Location</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Category</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">Trip</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">Amount</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">{transaction.date}</td>
                  <td className="py-4 px-4">{transaction.receiver}</td>
                  <td className="py-4 px-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {transaction.location}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">{transaction.trip}</td>
                  <td className="py-4 px-4 text-right font-medium">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-emerald-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}