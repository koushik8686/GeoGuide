"use client"

import type React from "react"

import { useState } from "react"
import { Star, MessageCircle, MapPin, Phone, Mail, Calendar } from "lucide-react"

export default function HotelDetailPage() {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [name, setName] = useState("")
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "February 15, 2025",
      comment:
        "Absolutely stunning resort with impeccable service. The beachfront views are breathtaking, and the staff went above and beyond to make our stay memorable.",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "January 28, 2025",
      comment:
        "Beautiful property and excellent amenities. The spa treatments were fantastic. Only giving 4 stars because the restaurant was a bit overpriced for what you get.",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      rating: 5,
      date: "December 12, 2024",
      comment:
        "This was our second stay at Grand Luxury Resort and it was even better than the first! The new infinity pool is spectacular and the room upgrades are worth every penny.",
    },
  ])

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !reviewText || !name) return

    const newReview = {
      id: reviews.length + 1,
      name,
      rating,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      comment: reviewText,
    }

    setReviews([newReview, ...reviews])
    setRating(0)
    setReviewText("")
    setName("")
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white">
      {/* Hotel Header */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src="/placeholder.svg?height=800&width=1200"
          alt="Grand Luxury Resort & Spa"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Grand Luxury Resort & Spa</h1>
              <div className="flex items-center text-white mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Bali, Indonesia</span>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= 4.8 ? "text-yellow-400" : "text-gray-300"}`}
                    fill={star <= 4.8 ? "currentColor" : "none"}
                  />
                ))}
                <span className="ml-2 text-white">4.8 (428 reviews)</span>
              </div>
            </div>
            <div className="text-white text-xl md:text-2xl font-bold">
              $350 <span className="text-sm font-normal">/ night</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Hotel Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">About the Resort</h2>
            <p className="text-gray-600 mb-4">
              Experience luxury in our beachfront resort with stunning panoramic ocean views. Our award-winning property
              offers an exclusive escape with world-class amenities including an infinity pool, private beach access,
              and a full-service spa.
            </p>
            <p className="text-gray-600 mb-4">
              Each of our spacious suites features traditional Balinese architecture combined with modern luxury,
              private balconies, premium bedding, and state-of-the-art technology for the ultimate comfort.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="font-medium text-gray-800">Pool</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="font-medium text-gray-800">Spa</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="font-medium text-gray-800">Restaurant</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="font-medium text-gray-800">Beach Access</div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Guest Reviews</h2>
            <div className="flex items-center mb-6">
              <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold text-emerald-600">4.8</span>
                <span className="text-sm text-emerald-600">/5</span>
              </div>
              <div className="ml-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= 4.8 ? "text-yellow-400" : "text-gray-300"}`}
                      fill={star <= 4.8 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <div className="text-gray-500 text-sm">Based on 428 reviews</div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {reviews.map((review) => (
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
                  placeholder="Share your experience at this hotel"
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
          {/* Manager Information */}
          <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Hotel Manager</h2>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Hotel Manager"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-gray-800">David Anderson</div>
                <div className="text-sm text-gray-500">General Manager</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>+62 812 3456 7890</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>david.anderson@grandluxury.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Manager since 2018</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Manager
            </button>
          </div>

          {/* Hotel Details */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Hotel Details</h2>
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-800 mb-1">Check-in/Check-out</div>
                <div className="text-gray-600">Check-in: 2:00 PM</div>
                <div className="text-gray-600">Check-out: 12:00 PM</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">Contact</div>
                <div className="text-gray-600">+62 361 123 4567</div>
                <div className="text-gray-600">info@grandluxury.com</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">Address</div>
                <div className="text-gray-600">Jl. Pantai Kuta No. 123</div>
                <div className="text-gray-600">Kuta, Bali 80361</div>
                <div className="text-gray-600">Indonesia</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">Property Amenities</div>
                <ul className="text-gray-600 list-disc list-inside">
                  <li>Free WiFi</li>
                  <li>Infinity Pool</li>
                  <li>Spa and Wellness Center</li>
                  <li>24/7 Room Service</li>
                  <li>Beachfront Restaurant</li>
                  <li>Airport Shuttle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

