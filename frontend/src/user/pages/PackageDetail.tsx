"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Star,
  Calendar,
  MapPin,
  Users,
  Sun,
  Hotel,
  Plane,
  Utensils,
  Bus,
  Wifi,
  MessageCircle,
  Share,
  Heart,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react"

// Types for our package data
type PackageHighlight = {
  id: number
  name: string
  description: string
}

type AvailableDate = {
  id: number
  startDate: string
  endDate: string
  spotsAvailable: number
}

type Inclusion = {
  id: number
  name: string
  icon: string
  description: string
}

type PackageReview = {
  id: number
  name: string
  rating: number
  date: string
  comment: string
  avatar?: string
}

type TourGuide = {
  id: number
  name: string
  title: string
  experience: string
  phone: string
  email: string
  avatar?: string
}

type PackageData = {
  id: number
  name: string
  locations: string[]
  price: number
  rating: number
  reviewCount: number
  duration: number
  weather: string
  temperature: string
  accommodationType: string
  description: string
  highlights: PackageHighlight[]
  availableDates: AvailableDate[]
  inclusions: Inclusion[]
  itinerary: { day: number; title: string; description: string }[]
  reviews: PackageReview[]
  tourGuide: TourGuide
  imgs: string[]
}

export default function PackageDetailPage() {
  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<AvailableDate | null>(null)
  const [travelers, setTravelers] = useState(2)

  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [name, setName] = useState("")

  // Fetch package data from API
  useEffect(() => {
    const fetchPackageData = async () => {
      setLoading(true)
      try {
        // In a real app, you would get the package ID from the URL params
        // const { id } = useParams() or similar
        const packageId = 1 // Mock ID

        // Replace with actual API call
        // const response = await fetch(`/api/packages/${packageId}`)
        // if (!response.ok) throw new Error('Failed to fetch package data')
        // const data = await response.json()

        // Mock data for now
        const mockData: PackageData = {
          id: 1,
          name: "Ultimate Japan Explorer",
          locations: ["Tokyo", "Kyoto", "Osaka"],
          price: 2999,
          rating: 4.9,
          reviewCount: 128,
          duration: 12,
          weather: "Mild",
          temperature: "20��C",
          accommodationType: "4-5 Star Hotels",
          description:
            "Immerse yourself in the rich culture and stunning landscapes of Japan with our comprehensive 12-day tour. From the bustling streets of Tokyo to the serene temples of Kyoto and the vibrant food scene of Osaka, experience the perfect blend of tradition and modernity that makes Japan a truly unique destination.",
          highlights: [
            {
              id: 1,
              name: "Traditional Tea Ceremony",
              description: "Experience an authentic Japanese tea ceremony led by a tea master in Kyoto.",
            },
            {
              id: 2,
              name: "Mount Fuji Visit",
              description: "Enjoy breathtaking views of Japan's iconic Mount Fuji and surrounding landscapes.",
            },
            {
              id: 3,
              name: "Bullet Train Experience",
              description: "Travel at high speed on Japan's famous Shinkansen bullet train between major cities.",
            },
            {
              id: 4,
              name: "Temple Tours",
              description:
                "Visit ancient temples and shrines including Kinkaku-ji (Golden Pavilion) and Fushimi Inari.",
            },
          ],
          availableDates: [
            { id: 1, startDate: "Apr 15, 2024", endDate: "Apr 26, 2024", spotsAvailable: 8 },
            { id: 2, startDate: "May 10, 2024", endDate: "May 21, 2024", spotsAvailable: 12 },
            { id: 3, startDate: "Jun 5, 2024", endDate: "Jun 16, 2024", spotsAvailable: 16 },
          ],
          inclusions: [
            {
              id: 1,
              name: "Flight Included",
              icon: "plane",
              description: "Round-trip international flights from major airports",
            },
            {
              id: 2,
              name: "Breakfast + 5 Dinners",
              icon: "utensils",
              description: "Daily breakfast and 5 special dinner experiences",
            },
            {
              id: 3,
              name: "Bullet Train + Private Bus",
              icon: "bus",
              description: "All transportation between destinations",
            },
            {
              id: 4,
              name: "Free WiFi",
              icon: "wifi",
              description: "Complimentary WiFi in all hotels and transportation",
            },
          ],
          itinerary: [
            {
              day: 1,
              title: "Arrival in Tokyo",
              description:
                "Arrive at Narita International Airport. Transfer to your hotel in Tokyo. Welcome dinner with your tour group.",
            },
            {
              day: 2,
              title: "Tokyo Exploration",
              description:
                "Visit Tsukiji Outer Market, Meiji Shrine, and Shibuya Crossing. Evening free to explore on your own.",
            },
            {
              day: 3,
              title: "Tokyo to Mt. Fuji",
              description:
                "Day trip to Mt. Fuji and Hakone. Lake Ashi cruise and Mt. Komagatake Ropeway. Return to Tokyo in the evening.",
            },
            {
              day: 4,
              title: "Tokyo to Kyoto",
              description:
                "Morning free in Tokyo. Afternoon bullet train to Kyoto. Evening walking tour of Gion district.",
            },
            {
              day: 5,
              title: "Kyoto Temples",
              description:
                "Full day tour of Kyoto's famous temples including Kinkaku-ji, Ryoan-ji, and Fushimi Inari Shrine.",
            },
            {
              day: 6,
              title: "Cultural Kyoto",
              description: "Traditional tea ceremony experience. Afternoon visit to Nijo Castle and Nishiki Market.",
            },
            {
              day: 7,
              title: "Kyoto to Nara",
              description:
                "Day trip to Nara. Visit Todai-ji Temple, Nara Park, and Kasuga Taisha Shrine. Return to Kyoto.",
            },
            {
              day: 8,
              title: "Kyoto to Osaka",
              description: "Morning free in Kyoto. Afternoon transfer to Osaka. Evening food tour in Dotonbori.",
            },
            {
              day: 9,
              title: "Osaka Exploration",
              description: "Visit Osaka Castle, Umeda Sky Building, and Kuromon Ichiba Market.",
            },
            {
              day: 10,
              title: "Osaka to Hiroshima",
              description:
                "Day trip to Hiroshima and Miyajima Island. Visit Peace Memorial Park and Itsukushima Shrine.",
            },
            {
              day: 11,
              title: "Osaka Free Day",
              description: "Free day to explore Osaka at your own pace or take an optional excursion.",
            },
            {
              day: 12,
              title: "Departure",
              description: "Transfer to Kansai International Airport for your departure flight.",
            },
          ],
          reviews: [
            {
              id: 1,
              name: "David Wilson",
              rating: 5,
              date: "January 15, 2025",
              comment:
                "This tour exceeded all my expectations! The itinerary was perfectly balanced between organized activities and free time. Our guide Yuki was incredibly knowledgeable and made the whole experience special. The bullet train rides were a highlight!",
            },
            {
              id: 2,
              name: "Jennifer Lee",
              rating: 5,
              date: "December 3, 2024",
              comment:
                "Japan has been on my bucket list for years, and this tour was the perfect way to experience it. The accommodations were excellent, and the included meals gave us a great taste of authentic Japanese cuisine. Highly recommend the spring dates to see the cherry blossoms!",
            },
            {
              id: 3,
              name: "Robert Chen",
              rating: 4,
              date: "November 18, 2024",
              comment:
                "Great tour overall! The only reason I'm giving 4 stars instead of 5 is that I wish we had more time in Kyoto. Everything else was fantastic - especially the Mount Fuji excursion and the tea ceremony. Would definitely book with this company again.",
            },
          ],
          tourGuide: {
            id: 1,
            name: "Yuki Tanaka",
            title: "Senior Tour Guide",
            experience: "10+ years guiding in Japan",
            phone: "+81 90 1234 5678",
            email: "yuki.tanaka@geoguide.com",
            avatar: "/placeholder.svg?height=200&width=200",
          },
          imgs: [
            "/placeholder.svg?height=800&width=1200",
            "/placeholder.svg?height=800&width=1200",
            "/placeholder.svg?height=800&width=1200",
            "/placeholder.svg?height=800&width=1200",
          ],
        }

        setPackageData(mockData)
        setSelectedDate(mockData.availableDates[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPackageData()
  }, [])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !reviewText || !name) return

    try {
      // In a real app, you would submit to an API
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     packageId: packageData?.id,
      //     name,
      //     rating,
      //     comment: reviewText
      //   })
      // })
      // if (!response.ok) throw new Error('Failed to submit review')
      // const data = await response.json()

      // For now, just update the local state
      const newReview = {
        id: (packageData?.reviews.length || 0) + 1,
        name,
        rating,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        comment: reviewText,
      }

      setPackageData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          reviews: [newReview, ...prev.reviews],
        }
      })

      // Reset form
      setRating(0)
      setReviewText("")
      setName("")
    } catch (err) {
      console.error("Error submitting review:", err)
      alert("Failed to submit review. Please try again.")
    }
  }

  const handleBookNow = async () => {
    if (!selectedDate) return

    try {
      // In a real app, you would submit to an API
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     packageId: packageData?.id,
      //     dateId: selectedDate.id,
      //     travelers
      //   })
      // })
      // if (!response.ok) throw new Error('Failed to book package')
      // const data = await response.json()
      // Redirect to confirmation page
      // router.push(`/booking-confirmation/${data.bookingId}`)

      // For now, just show an alert
      alert(`Booking successful! ${travelers} travelers for ${selectedDate.startDate} to ${selectedDate.endDate}`)
    } catch (err) {
      console.error("Error booking package:", err)
      alert("Failed to book package. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Package</h2>
        <p className="text-gray-700 mb-6">{error || "Package data not available"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white">
      {/* Back Button */}
      <div className="mb-6">
        <button className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Packages
        </button>
      </div>

      {/* Package Header */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
        <img src={packageData.imgs[0] || "/placeholder.svg"} alt={packageData.name} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{packageData.name}</h1>
              <div className="flex items-center text-white mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{packageData.locations.join(", ")}</span>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= packageData.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill={star <= packageData.rating ? "currentColor" : "none"}
                  />
                ))}
                <span className="ml-2 text-white">
                  {packageData.rating} ({packageData.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="text-white text-xl md:text-2xl font-bold">
              ${packageData.price.toLocaleString()} <span className="text-sm font-normal">/ person</span>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <Share className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <Heart className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Package Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Package Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <Calendar className="h-6 w-6 text-emerald-600 mb-2" />
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium text-gray-800">{packageData.duration} days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <Sun className="h-6 w-6 text-emerald-600 mb-2" />
                <div className="text-sm text-gray-500">Weather</div>
                <div className="font-medium text-gray-800">
                  {packageData.weather}, {packageData.temperature}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <Hotel className="h-6 w-6 text-emerald-600 mb-2" />
                <div className="text-sm text-gray-500">Accommodation</div>
                <div className="font-medium text-gray-800">{packageData.accommodationType}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <Users className="h-6 w-6 text-emerald-600 mb-2" />
                <div className="text-sm text-gray-500">Group Size</div>
                <div className="font-medium text-gray-800">8-12 people</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6">{packageData.description}</p>

            {/* Highlights */}
            <h3 className="text-xl font-bold mb-3 text-gray-800">Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {packageData.highlights.map((highlight) => (
                <div key={highlight.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">{highlight.name}</div>
                  <div className="text-sm text-gray-600">{highlight.description}</div>
                </div>
              ))}
            </div>

            {/* Inclusions */}
            <h3 className="text-xl font-bold mb-3 text-gray-800">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {packageData.inclusions.map((inclusion) => (
                <div key={inclusion.id} className="flex items-center gap-3">
                  {inclusion.icon === "plane" && <Plane className="h-5 w-5 text-emerald-600" />}
                  {inclusion.icon === "utensils" && <Utensils className="h-5 w-5 text-emerald-600" />}
                  {inclusion.icon === "bus" && <Bus className="h-5 w-5 text-emerald-600" />}
                  {inclusion.icon === "wifi" && <Wifi className="h-5 w-5 text-emerald-600" />}
                  <div>
                    <div className="font-medium text-gray-800">{inclusion.name}</div>
                    <div className="text-sm text-gray-600">{inclusion.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Itinerary */}
            <h3 className="text-xl font-bold mb-3 text-gray-800">Itinerary</h3>
            <div className="space-y-4 mb-8">
              {packageData.itinerary.map((day) => (
                <div key={day.day} className="border-l-2 border-emerald-500 pl-4 pb-4">
                  <div className="font-medium text-gray-800 mb-1">
                    Day {day.day}: {day.title}
                  </div>
                  <div className="text-sm text-gray-600">{day.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Guest Reviews</h2>
            <div className="flex items-center mb-6">
              <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold text-emerald-600">{packageData.rating}</span>
                <span className="text-sm text-emerald-600">/5</span>
              </div>
              <div className="ml-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= packageData.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill={star <= packageData.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <div className="text-gray-500 text-sm">Based on {packageData.reviewCount} reviews</div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {packageData.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{review.name}</div>
                    <div className="text-gray-500 text-sm">{review.date}</div>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill={star <= review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Form */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Write a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <Star
                        className={`h-6 w-6 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill={star <= rating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  id="review"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Share your experience with this package"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Booking Card */}
          <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Book This Package</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <div className="space-y-2">
                {packageData.availableDates.map((date) => (
                  <div
                    key={date.id}
                    onClick={() => setSelectedDate(date)}
                    className={`border p-3 rounded-md cursor-pointer ${selectedDate?.id === date.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {date.startDate} - {date.endDate}
                      </div>
                      <div className="text-sm text-emerald-600">{date.spotsAvailable} spots left</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "traveler" : "travelers"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="text-gray-600">Package Price</div>
                <div>
                  ${packageData.price.toLocaleString()} × {travelers}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Taxes & Fees</div>
                <div>${(packageData.price * travelers * 0.12).toLocaleString()}</div>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <div>Total</div>
                <div>${(packageData.price * travelers * 1.12).toLocaleString()}</div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              disabled={!selectedDate}
              className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Book Now
            </button>

            <div className="mt-4 text-sm text-center text-gray-500">
              No payment required today. Reserve your spot now.
            </div>
          </div>

          {/* Tour Guide */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Tour Guide</h2>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                <img
                  src={packageData.tourGuide.avatar || "/placeholder.svg"}
                  alt={packageData.tourGuide.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-gray-800">{packageData.tourGuide.name}</div>
                <div className="text-sm text-gray-500">{packageData.tourGuide.title}</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">{packageData.tourGuide.experience}</div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{packageData.tourGuide.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{packageData.tourGuide.email}</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Tour Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

