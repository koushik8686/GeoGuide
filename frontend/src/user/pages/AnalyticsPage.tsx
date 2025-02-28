"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { axiosInstance } from "../../constants/urls"
import {
  PieChart,
  Calendar,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Tag,
  Wallet,
  CreditCard,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Transaction {
  _id: string
  receiver: string
  amount: number
  category: string
  timestamp: string
  location: {
    latitude: number
    longitude: number
    accuracy: number
  }
  message: string
  rawMessage?: string
}

interface Trip {
  _id: string
  tripName: string
  tripStartTime: string
  StartLocation: string
  EndLocation: string
  trip_type: string
  budget: number
  spentAmount: number
  status: string
  transactions: Transaction[]
  spendingByCategory: Record<string, number>
  visitedPlaces: any[]
  plannedPlaces: any[]
  createdAt: string
  updatedAt: string
}

function SpendingChart({ trips }: { trips: Trip[] }) {
  // Group spending by month
  const monthlySpending = trips.reduce((acc: Record<string, number>, trip) => {
    trip.transactions.forEach((transaction) => {
      const month = new Date(transaction.timestamp).toLocaleString("default", { month: "short" })
      acc[month] = (acc[month] || 0) + transaction.amount
    })
    return acc
  }, {})

  const monthlyData = Object.entries(monthlySpending).map(([month, amount]) => ({
    month,
    amount,
  }))

  const maxAmount = Math.max(...monthlyData.map((item) => item.amount), 1)

  return (
    <div className="h-64 flex items-end justify-between gap-2 mt-6">
      {monthlyData.length > 0 ? (
        monthlyData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full flex justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.amount / maxAmount) * 100}%` }}
                className="w-4/5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ width: "90%" }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{item.month}</div>
            <div className="text-xs font-medium">₹{item.amount}</div>
          </div>
        ))
      ) : (
        <div className="w-full flex items-center justify-center text-gray-500">No spending data available</div>
      )}
    </div>
  )
}

function CategoryPieChart({ trips }: { trips: Trip[] }) {
  // Combine all transactions and group by category
  const categorySpending = trips.reduce((acc: Record<string, { amount: number; color: string }>, trip) => {
    trip.transactions.forEach((transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          amount: 0,
          color: getCategoryColor(transaction.category),
        }
      }
      acc[transaction.category].amount += transaction.amount
    })
    return acc
  }, {})

  const total = Object.values(categorySpending).reduce((sum, item) => sum + item.amount, 0)
  let currentAngle = 0

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="relative w-48 h-48">
        {Object.keys(categorySpending).length > 0 ? (
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {Object.entries(categorySpending).map(([category, data], index) => {
              const percentage = (data.amount / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              currentAngle += angle

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
                  fill={getCategoryColorHex(category)}
                  stroke="white"
                  strokeWidth="1"
                  className="hover:opacity-90 cursor-pointer"
                />
              )
            })}
          </svg>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No category data</div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {Object.entries(categorySpending).map(([category, data], index) => {
          const percentage = (data.amount / total) * 100
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColorHex(category) }} />
              <span className="text-sm text-gray-500 capitalize">{category}</span>
              <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DailySpendingChart({ trips }: { trips: Trip[] }) {
  // Group spending by day for the last 14 days
  const today = new Date()
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)

  const dailySpending: Record<string, number> = {}

  // Initialize all days in the last 14 days with 0
  for (let i = 0; i < 14; i++) {
    const date = new Date(twoWeeksAgo)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]
    dailySpending[dateStr] = 0
  }

  // Fill in actual spending
  trips.forEach((trip) => {
    trip.transactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp)
      if (date >= twoWeeksAgo && date <= today) {
        const dateStr = date.toISOString().split("T")[0]
        dailySpending[dateStr] = (dailySpending[dateStr] || 0) + transaction.amount
      }
    })
  })

  const dailyData = Object.entries(dailySpending)
    .map(([date, amount]) => ({
      date,
      amount,
      label: new Date(date).toLocaleDateString("default", { day: "numeric", month: "short" }),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const maxAmount = Math.max(...dailyData.map((item) => item.amount), 1)
  const points = dailyData
    .map((item, index) => {
      const x = (index / (dailyData.length - 1)) * 100
      const y = 100 - (item.amount / maxAmount) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="h-64 w-full mt-6">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" />

        {/* Line chart */}
        <polyline
          points={points}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Area under the line */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          d={`M0,100 L${points} L100,100 Z`}
          fill="#10b981"
        />

        {/* Data points */}
        {dailyData.map((item, index) => {
          const x = (index / (dailyData.length - 1)) * 100
          const y = 100 - (item.amount / maxAmount) * 100
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="#10b981"
              initial={{ r: 0 }}
              animate={{ r: 1.5 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            />
          )
        })}
      </svg>

      <div className="flex justify-between mt-2">
        {[0, 3, 7, 10, 13].map((index) => (
          <div key={index} className="text-xs text-gray-500">
            {dailyData[index]?.label || ""}
          </div>
        ))}
      </div>
    </div>
  )
}

function BudgetComparisonChart({ trips }: { trips: Trip[] }) {
  return (
    <div className="space-y-4 mt-6">
      {trips.map((trip) => {
        const percentage = (trip.spentAmount / trip.budget) * 100
        const isOverBudget = percentage > 100

        return (
          <div key={trip._id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{trip.tripName}</span>
              <span className="text-sm text-gray-500">
                ₹{trip.spentAmount} / ₹{trip.budget}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
                ></div>
              </div>
              {isOverBudget && (
                <span className="absolute right-0 -top-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  Over budget
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TripStatusChart({ trips }: { trips: Trip[] }) {
  const statusCounts = trips.reduce((acc: Record<string, number>, trip) => {
    acc[trip.status] = (acc[trip.status] || 0) + 1
    return acc
  }, {})

  const total = trips.length

  return (
    <div className="space-y-4 mt-6">
      {Object.entries(statusCounts).map(([status, count]) => {
        const percentage = (count / total) * 100
        return (
          <div key={status} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium capitalize">{status}</span>
              <span className="text-sm text-gray-500">
                {count} trip{count !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${percentage}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getStatusColorClass(status)}`}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStatusColorClass(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-blue-500"
    case "completed":
      return "bg-green-500"
    case "planned":
      return "bg-yellow-500"
    case "cancelled":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    food_and_dining: "bg-emerald-500",
    transportation: "bg-blue-500",
    accommodation: "bg-purple-500",
    shopping: "bg-yellow-500",
    entertainment: "bg-red-500",
    sightseeing: "bg-indigo-500",
    other: "bg-gray-500",
  }
  return colors[category] || colors.other
}

function getCategoryColorHex(category: string): string {
  const colors: Record<string, string> = {
    food_and_dining: "#10b981",
    transportation: "#3b82f6",
    accommodation: "#8b5cf6",
    shopping: "#f59e0b",
    entertainment: "#ef4444",
    sightseeing: "#6366f1",
    other: "#6b7280",
  }
  return colors[category] || colors.other
}

function TripDetailCard({ trip }: { trip: Trip }) {
  const [expanded, setExpanded] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)
  const [transactionSearch, setTransactionSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Calculate category spending for this trip
  const categorySpending = trip.transactions.reduce((acc: Record<string, number>, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
    return acc
  }, {})

  // Calculate percentage of budget used
  const budgetUsedPercentage = (trip.spentAmount / trip.budget) * 100
  const isOverBudget = budgetUsedPercentage > 100

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter and sort transactions
  const filteredTransactions = trip.transactions
    .filter((t) =>
      t.receiver.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(transactionSearch.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  return (
    <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {trip.tripName}
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  trip.status === "active"
                    ? "bg-blue-100 text-blue-800"
                    : trip.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {trip.status}
              </span>
            </h3>
            <p className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              {trip.StartLocation} to {trip.EndLocation}
            </p>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{formatDate(trip.tripStartTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{trip.trip_type}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Budget Usage</span>
            <span className="text-sm font-medium">
              ₹{trip.spentAmount} / ₹{trip.budget}
            </span>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
            ></div>
          </div>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            <div className="border-t border-gray-200 my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Spending by Category</h4>
                <div className="space-y-2">
                  {Object.entries(categorySpending).map(([category, amount]) => (
                    <div key={category} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getCategoryColorHex(category) }}
                      />
                      <span className="text-sm text-gray-500 capitalize">{category}</span>
                      <span className="text-sm font-medium ml-auto">₹{amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Trip Transactions</h4>
                  <button
                    onClick={() => setShowTransactions(!showTransactions)}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    {showTransactions ? "Hide" : "Show"} All
                  </button>
                </div>
                <div className="space-y-2">
                  {trip.transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction._id} className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3 text-gray-500" />
                      <span className="text-sm truncate">{transaction.receiver}</span>
                      <span className="text-sm font-medium ml-auto">₹{transaction.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions Dropdown */}
            {showTransactions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 border-t border-gray-200 pt-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={transactionSearch}
                      onChange={(e) => setTransactionSearch(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                    {sortOrder === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Receiver</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Category</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <motion.tr
                          key={transaction._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm">{formatDate(transaction.timestamp)}</td>
                          <td className="py-3 px-4 text-sm">{transaction.receiver}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs capitalize ${getCategoryColor(transaction.category)} bg-opacity-10 text-gray-800`}
                            >
                              {transaction.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-medium">₹{transaction.amount}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">No matching transactions found</div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTrip, setSelectedTrip] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axiosInstance.get("/api/trips/user")
        setTrips(response.data)
      } catch (error) {
        console.error("Error fetching trips:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  // Filter trips based on time range
  const filteredTrips = trips.filter((trip) => {
    if (timeRange === "all") return true

    const tripDate = new Date(trip.tripStartTime)
    const now = new Date()

    if (timeRange === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      return tripDate >= monthAgo
    }

    if (timeRange === "quarter") {
      const quarterAgo = new Date()
      quarterAgo.setMonth(now.getMonth() - 3)
      return tripDate >= quarterAgo
    }

    if (timeRange === "year") {
      const yearAgo = new Date()
      yearAgo.setFullYear(now.getFullYear() - 1)
      return tripDate >= yearAgo
    }

    return true
  })

  // Calculate total stats
  const totalSpent = filteredTrips.reduce((sum, trip) => sum + trip.spentAmount, 0)
  const averagePerTrip = totalSpent / (filteredTrips.length || 1)
  const totalBudget = filteredTrips.reduce((sum, trip) => sum + trip.budget, 0)
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100

  // Calculate month-over-month change
  const currentMonthSpending = filteredTrips.reduce((sum, trip) => {
    const currentMonth = new Date().getMonth()
    return (
      sum +
      trip.transactions
        .filter((t) => new Date(t.timestamp).getMonth() === currentMonth)
        .reduce((tSum, t) => tSum + t.amount, 0)
    )
  }, 0)

  const previousMonthSpending = filteredTrips.reduce((sum, trip) => {
    const previousMonth = new Date().getMonth() - 1
    return (
      sum +
      trip.transactions
        .filter((t) => new Date(t.timestamp).getMonth() === previousMonth)
        .reduce((tSum, t) => tSum + t.amount, 0)
    )
  }, 0)

  const monthOverMonthChange =
    previousMonthSpending === 0 ? 100 : ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100

  // Get all transactions across all trips
  const allTransactions = filteredTrips.flatMap((trip) =>
    trip.transactions.map((t) => ({
      ...t,
      tripName: trip.tripName,
      tripStartTime: trip.tripStartTime,
    })),
  )

  // Filter transactions based on search and selected trip
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesTrip = selectedTrip === "all" || transaction.tripName === selectedTrip
    const matchesSearch = transaction.receiver.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTrip && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Travel Expense Analytics</h1>
          <p className="text-gray-500">Track, analyze, and optimize your travel spending</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "overview" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "transactions" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "trips" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("trips")}
          >
            Trips
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-2">Total Spent</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">₹{totalSpent.toFixed(0)}</div>
                <div className={`flex items-center ${monthOverMonthChange > 0 ? "text-red-500" : "text-green-500"}`}>
                  {monthOverMonthChange > 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm">{Math.abs(monthOverMonthChange).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">vs. previous month</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-2">Average per Trip</div>
              <div className="text-2xl font-bold">₹{averagePerTrip.toFixed(0)}</div>
              <p className="text-xs text-gray-500 mt-1">across {filteredTrips.length} trips</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-2">Budget Utilization</div>
              <div className="text-2xl font-bold">{budgetUsedPercentage.toFixed(1)}%</div>
              <div className="mt-2 overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                ></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm font-medium text-gray-500 mb-2">Total Budget</div>
              <div className="text-2xl font-bold">₹{totalBudget.toFixed(0)}</div>
              <p className="text-xs text-gray-500 mt-1">remaining: ₹{(totalBudget - totalSpent).toFixed(0)}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 mr-2 text-emerald-500" />
                <h3 className="text-lg font-semibold">Monthly Spending</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Your spending patterns over time</p>
              <SpendingChart trips={filteredTrips} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <PieChart className="h-5 w-5 mr-2 text-emerald-500" />
                <h3 className="text-lg font-semibold">Spending by Category</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">How your money is distributed</p>
              <CategoryPieChart trips={filteredTrips} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <LineChart className="h-5 w-5 mr-2 text-emerald-500" />
                <h3 className="text-lg font-semibold">Daily Spending Trend</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Last 14 days of spending</p>
              <DailySpendingChart trips={filteredTrips} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <Wallet className="h-5 w-5 mr-2 text-emerald-500" />
                <h3 className="text-lg font-semibold">Budget Comparison</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Budget vs. actual spending by trip</p>
              <BudgetComparisonChart trips={filteredTrips} />
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">Track your spending across all trips</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
              >
                <option value="all">All Trips</option>
                {trips.map((trip) => (
                  <option key={trip._id} value={trip.tripName}>
                    {trip.tripName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm">Date</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm">Receiver</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm">Trip</th>
                  <th className="text-right py-4 px-4 text-gray-500 font-medium text-sm">Amount</th>
                  <th className="text-right py-4 px-4 text-gray-500 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <motion.tr
                      key={transaction._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm">{new Date(transaction.timestamp).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-sm">{transaction.receiver}</td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            getCategoryColor(transaction.category)
                          } bg-opacity-10 text-gray-800`}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">{transaction.tripName}</td>
                      <td className="py-4 px-4 text-right font-medium text-sm">₹{transaction.amount.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-emerald-600">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === "trips" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold">Trip Details</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Expand each trip to see detailed information</p>

            <div className="space-y-2">
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => <TripDetailCard key={trip._id} trip={trip} />)
              ) : (
                <div className="py-8 text-center text-gray-500">No trips found</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 mr-2 text-emerald-500" />
                <h3 className="text-lg font-semibold">Trip Status Distribution</h3>
              </div>
              <TripStatusChart trips={filteredTrips} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-2 text-emerald-500" />
                <h3 className="text-lg font-semibold">Popular Destinations</h3>
              </div>
              <div className="space-y-4 mt-6">
                {Array.from(new Set(filteredTrips.map((trip) => trip.EndLocation))).map((location, index) => {
                  const tripsToLocation = filteredTrips.filter((trip) => trip.EndLocation === location)
                  const totalSpent = tripsToLocation.reduce((sum, trip) => sum + trip.spentAmount, 0)

                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium">{location}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {tripsToLocation.length} trip{tripsToLocation.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-sm font-medium">₹{totalSpent}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
