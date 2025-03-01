import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, DollarSign, Plus, Loader2 } from 'lucide-react';
import Header from '../components/Header';

interface Booking {
  user: {
    name: string;
    email: string;
  };
  selectedDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Review {
  user: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Package {
  _id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  agency: string;
  agencyLogo: string;
  inclusions: string[];
  highlights: string[];
  dates: Array<{
    date: string;
    availableSpots: number;
    price: number;
  }>;
  accommodation: string;
  groupSize: string;
  difficulty: string;
  weather: string;
  meals: string;
  transportation: string;
  rating: number;
  reviews: Review[];
  bookings: Booking[];
}

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pkg, setPkg] = useState<Package | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch package details');
        }

        const data = await response.json();
        setPkg(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Package not found'}</p>
        <button
          onClick={() => navigate('/manager/packages')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete package');
      }

      navigate('/manager/packages');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete package');
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Tour Package Details">
        <button
          onClick={() => navigate('/manager/packages/add')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Package
        </button>
      </Header>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative h-80">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{pkg.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                {pkg.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5" />
                {pkg.duration}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                ${pkg.price}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
              <p className="text-gray-600">
                Experience the beauty of {pkg.location} with our carefully curated {pkg.duration} tour package.
                This package includes {pkg.inclusions.join(', ')}.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {pkg.highlights.map((highlight, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Bookings</h2>
              <div className="space-y-4">
                {pkg.bookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${booking.user.name}&background=random`}
                        alt={booking.user.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.user.name}</h3>
                        <p className="text-sm text-gray-500">
                          Booked for {new Date(booking.selectedDate).toLocaleDateString()} 
                          ({booking.numberOfPeople} people)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${booking.totalPrice}</div>
                      <span className={`text-sm ${
                        booking.status === 'confirmed' ? 'text-green-600' : 
                        booking.status === 'cancelled' ? 'text-red-600' : 
                        'text-yellow-600'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">Package Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{pkg.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bookings</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium">{pkg.bookings.length}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium">{pkg.reviews.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate(`/manager/packages/edit/${pkg._id}`)}
                  className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Edit Package
                </button>
                <button 
                  onClick={handleDelete}
                  className="w-full bg-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}