
import React, { useState, useEffect } from "react"
import {
  Globe2,
  Calendar,
  MapPin,
  CreditCard,
  Users,
  Cloud,
  ChevronDown,
  Compass,
  Star,
  MessageCircle,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import CircularGallery from "./ui/Circular";
import Spotlight from "./ui/Spotlight";

export default function Landing() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)

  const features = [
    {
      title: "Smart Travel Planning",
      description: "AI-powered itinerary creation based on your preferences",
      image: "https://images.unsplash.com/photo-14694749688-56623f02e42e?q=80&w=2074",
      icon: <Compass className="w-8 h-8 text-emerald-500" />,
    },
    {
      title: "Local Experiences",
      description: "Discover hidden gems and authentic local experiences",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2074",
      icon: <MapPin className="w-8 h-8 text-emerald-500" />,
    },
    {
      title: "Smart Scheduling",
      description: "Optimal travel dates based on your calendar",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
      icon: <Calendar className="w-8 h-8 text-emerald-500" />,
    },
  ]
  const images = [
    {
      "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523",
      "text": "Taj Mahal, Agra"
    },
    {
      "image": "data:image/jpeg;base64,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",
      "text": "Goa Beaches"
    },
    {
      "image": "https://images.unsplash.com/photo-1621772990183-3f6b5f1d0e8d",
      "text": "Varanasi Ghats"
    },
    {
      "image": "https://images.unsplash.com/photo-1585506942814-e99c5fdc51b5",
      "text": "Hampi, Karnataka"
    },
    {
      "image": "https://images.unsplash.com/photo-1581434681386-9c9d5a3d3c0a",
      "text": "Mysore Palace, Karnataka"
    },
    {
      "image": "https://images.unsplash.com/photo-1600172454427-38a8431d9d8e",
      "text": "Jaipur, Rajasthan"
    },
    {
      "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0be19a",
      "text": "Kerala Backwaters"
    },
    {
      "image": "https://images.unsplash.com/photo-1632493560492-67360b2cf99e",
      "text": "Red Fort, Delhi"
    },
    {
      "image": "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef",
      "text": "Amber Palace, Jaipur"
    },
    {
      "image": "https://images.unsplash.com/photo-1587731119358-5addf11f2d0e",
      "text": "Golden Temple, Amritsar"
    },
    {
      "image": "https://images.unsplash.com/photo-1624280433509-b01afeaf36e5",
      "text": "Leh-Ladakh, Jammu & Kashmir"
    },
    {
      "image": "https://images.unsplash.com/photo-1632493560492-67360b2cf99e",
      "text": "Nainital, Uttarakhand"
    },
    {
      "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0be19a",
      "text": "Munnar, Kerala"
    },
    {
      "image": "https://images.unsplash.com/photo-1574875782670-3a5a2f5b3b0a",
      "text": "Ranthambore National Park, Rajasthan"
    },
    {
      "image": "https://images.unsplash.com/photo-1587731119358-5addf11f2d0e",
      "text": "Darjeeling, West Bengal"
    }
  ];
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextFeature = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length)
  }

  const prevFeature = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1))
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950"></div>
        <div className="container mx-auto px-4 z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3">
              <Globe2 className="w-16 h-16 text-emerald-500" />
              <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
                GlobeMate
              </h1>
            </div>
            <p className="text-3xl text-zinc-400 max-w-3xl mx-auto font-light">
              Your AI-Powered Travel Companion for Smarter, Personalized Adventures
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-5 rounded-full text-xl font-medium transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
              <a href="/user"> Start Your Journey</a>
            </button>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </header>

      {/* Features Carousel */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
            Experience Travel Like Never Before
          </h2>
          <div className="relative max-w-6xl mx-auto">
            <button
              onClick={prevFeature}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-800/80 hover:bg-zinc-700/80 transition-all p-2 rounded-full"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={nextFeature}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-800/80 hover:bg-zinc-700/80 transition-all p-2 rounded-full"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            <div className="overflow-hidden relative rounded-3xl bg-zinc-900/50 backdrop-blur-sm">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentFeatureIndex * 100}%)`,
                  width: `${features.length * 100}%`,
                }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0 grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-[400px] overflow-hidden">
                      <img
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                    </div>
                    <div className="space-y-6 p-8">
                      <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                      <p className="text-xl text-zinc-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatureIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentFeatureIndex === index ? "bg-emerald-500 w-6" : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <div style={{ height: '600px', position: 'relative' }}>
  <CircularGallery items={images} bend={3} textColor="#ffffff" borderRadius={0.05} />
</div>
      {/* Stats Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Travelers", icon: <Users className="w-8 h-8 text-emerald-500" /> },
              { number: "100+", label: "Countries Covered", icon: <Globe2 className="w-8 h-8 text-teal-500" /> },
              { number: "4.9", label: "User Rating", icon: <Star className="w-8 h-8 text-emerald-500" /> },
              { number: "24/7", label: "Support", icon: <MessageCircle className="w-8 h-8 text-teal-500" /> },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-4 p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all"
              >
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-zinc-400">{stat.label}</div>
              </div>
            ))}
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Smart Features for Smart Travelers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8 text-emerald-500" />,
                title: "AI-Powered Recommendations",
                description: "Get personalized suggestions based on your preferences and travel history",
              },
              {
                icon: <Calendar className="w-8 h-8 text-teal-500" />,
                title: "Smart Date Planning",
                description: "Find the perfect travel dates by analyzing your calendar",
              },
              {
                icon: <CreditCard className="w-8 h-8 text-emerald-500" />,
                title: "Expense Tracking",
                description: "Effortlessly track and analyze your travel expenses",
              },
              {
                icon: <Shield className="w-8 h-8 text-teal-500" />,
                title: "Safe Travel",
                description: "Real-time safety alerts and travel insurance integration",
              },
              {
                icon: <Award className="w-8 h-8 text-emerald-500" />,
                title: "Exclusive Deals",
                description: "Access to premium discounts and special offers",
              },
              {
                icon: <Cloud className="w-8 h-8 text-teal-500" />,
                title: "Weather Insights",
                description: "Advanced weather forecasting for better planning",
              },
            ].map((feature, index) => (
              <Spotlight spotlightColor="rgba(0, 255, 191, 0.25)" key={index} >

              <div
                key={index}
                className=" backdrop-blur-sm p-8 rounded-3xl  transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
              </Spotlight>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">What Our Travelers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "GlobeMate transformed how I plan my trips. The AI recommendations are spot-on!",
                author: "Sarah K.",
                role: "Adventure Enthusiast",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887",
              },
              {
                quote: "The smart calendar feature saved me hours of planning time. Absolutely brilliant!",
                author: "Michael R.",
                role: "Business Traveler",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887",
              },
              {
                quote: "Best travel companion app I've ever used. The expense tracking is a game-changer.",
                author: "Emily T.",
                role: "Digital Nomad",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-3xl border border-zinc-800">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-emerald-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-zinc-400">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl font-bold text-white">Ready to Transform Your Travel Experience?</h2>
            <p className="text-xl text-zinc-400">
              Join thousands of smart travelers who are already using GlobeMate to plan their perfect trips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full text-xl font-medium hover:opacity-90 transition-all">
                <a href="/user"> Get Started for Free</a>
              </button>
              <button className="bg-zinc-900 text-white px-8 py-4 rounded-full text-xl font-medium hover:bg-zinc-800 transition-all border border-zinc-800">
                <a href="/user"> Watch Demo</a>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

