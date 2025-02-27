"use client"

import { useState } from "react"
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Landmark,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

type TripStatus = "current" | "upcoming" | "completed"
type ActivityStatus = "completed" | "in-progress" | "upcoming"

interface Activity {
  id: string
  time: string
  name: string
  status: ActivityStatus
}

interface Trip {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  status: TripStatus
  timeElapsed?: string
  totalDays: number
  spentAmount: number
  budget: number
  placesVisited: number
  plannedPlaces: number
  progress: number
  activities?: Activity[]
}

export default function UserHistory() {
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null)

  // Mock data - replace with API call
  const trips: Trip[] = [
    {
      id: "1",
      name: "Tokyo Explorer",
      location: "Tokyo, Japan",
      startDate: "Mar 10, 2024",
      endDate: "Mar 20, 2024",
      status: "current",
      timeElapsed: "354d 10h 18m",
      totalDays: 10,
      spentAmount: 1250,
      budget: 3000,
      placesVisited: 8,
      plannedPlaces: 15,
      progress: 65,
      activities: [
        { id: "1", time: "9:00 AM", name: "Tsukiji Fish Market Tour", status: "completed" },
        { id: "2", time: "2:00 PM", name: "Sensoji Temple Visit", status: "in-progress" },
        { id: "3", time: "7:00 PM", name: "Shibuya Crossing & Dinner", status: "upcoming" },
      ],
    },
    {
      id: "2",
      name: "Greek Islands Hopping",
      location: "Athens, Santorini, Mykonos",
      startDate: "May 15, 2024",
      endDate: "May 25, 2024",
      status: "upcoming",
      totalDays: 10,
      spentAmount: 0,
      budget: 2500,
      placesVisited: 0,
      plannedPlaces: 12,
      progress: 0,
    },
    {
      id: "3",
      name: "Swiss Alps Adventure",
      location: "Interlaken, Switzerland",
      startDate: "Jan 5, 2024",
      endDate: "Jan 12, 2024",
      status: "completed",
      totalDays: 7,
      spentAmount: 2800,
      budget: 3000,
      placesVisited: 10,
      plannedPlaces: 10,
      progress: 100,
    },
  ]

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case "current":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-emerald-100 text-emerald-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case "completed":
        return "text-emerald-600"
      case "in-progress":
        return "text-blue-600"
      case "upcoming":
        return "text-gray-400"
    }
  }

  const formatProgress = (progress: number) => {
    return `${progress}%`
  }

  const toggleTripExpansion = (tripId: string) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {/* Current Trips */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Current Trip</h2>
        {trips
          .filter((trip) => trip.status === "current")
          .map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border mb-4">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{trip.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {trip.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {trip.startDate} - {trip.endDate}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Report Issue
                    </button>
                    <button className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Trip
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <div className="text-sm text-emerald-600 mb-1 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Time Elapsed
                    </div>
                    <div className="text-2xl font-bold text-emerald-900">{trip.timeElapsed}</div>
                    <div className="text-sm text-emerald-600">of {trip.totalDays} days total</div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-sm text-blue-600 mb-1 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Spent So Far
                    </div>
                    <div className="text-2xl font-bold text-blue-900">${trip.spentAmount}</div>
                    <div className="text-sm text-blue-600">of ${trip.budget} budget</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-sm text-purple-600 mb-1 flex items-center">
                      <Landmark className="w-4 h-4 mr-1" />
                      Places Visited
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{trip.placesVisited}</div>
                    <div className="text-sm text-purple-600">of {trip.plannedPlaces} planned</div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="text-sm text-orange-600 mb-1 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Trip Progress
                    </div>
                    <div className="text-2xl font-bold text-orange-900">{formatProgress(trip.progress)}</div>
                    <div className="relative w-full h-2 bg-orange-200 rounded-full mt-2">
                      <div
                        className="absolute left-0 top-0 h-full bg-orange-500 rounded-full"
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {trip.activities && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Today's Itinerary</h4>
                    <div className="space-y-4">
                      {trip.activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <div className="text-gray-600 w-20">{activity.time}</div>
                            <div className="font-medium">{activity.name}</div>
                          </div>
                          <div className={`${getActivityStatusColor(activity.status)} text-sm capitalize`}>
                            {activity.status.replace("-", " ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </section>

      {/* Upcoming Trips */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
        {trips
          .filter((trip) => trip.status === "upcoming")
          .map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border mb-4">
              <div className="p-6 cursor-pointer" onClick={() => toggleTripExpansion(trip.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{trip.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {trip.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Trip Dates</div>
                      <div className="font-medium">
                        {trip.startDate} - {trip.endDate}
                      </div>
                    </div>
                    {expandedTrip === trip.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedTrip === trip.id && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Duration</div>
                        <div className="font-medium">{trip.totalDays} days</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Budget</div>
                        <div className="font-medium">${trip.budget}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Places to Visit</div>
                        <div className="font-medium">{trip.plannedPlaces} locations</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </section>

      {/* Past Trips */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Trip History</h2>
        {trips
          .filter((trip) => trip.status === "completed")
          .map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border mb-4">
              <div className="p-6 cursor-pointer" onClick={() => toggleTripExpansion(trip.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{trip.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {trip.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Trip Dates</div>
                      <div className="font-medium">
                        {trip.startDate} - {trip.endDate}
                      </div>
                    </div>
                    {expandedTrip === trip.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedTrip === trip.id && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Duration</div>
                        <div className="font-medium">{trip.totalDays} days</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                        <div className="font-medium">${trip.spentAmount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Places Visited</div>
                        <div className="font-medium">
                          {trip.placesVisited} of {trip.plannedPlaces}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Completion</div>
                        <div className="font-medium">{formatProgress(trip.progress)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </section>
    </div>
  )
}

