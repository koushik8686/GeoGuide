import React from 'react';
import { MapPin, Users, Star, Link as LinkIcon } from 'lucide-react';
import Header from '../components/Header';

export default function Profile() {
  return (
    <div className="space-y-6">
      <Header title="Profile" />
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
              />
              <h2 className="text-xl font-bold text-gray-900">John Smith</h2>
              <p className="text-gray-500">Professional Tour Guide</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Bali, Indonesia</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>2.5k Followers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="h-5 w-5" />
                <span>4.9 Rating</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-2">
                {['Instagram', 'Twitter', 'LinkedIn'].map(platform => (
                  <a
                    key={platform}
                    href="#"
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
            <p className="text-gray-600">
              Professional tour guide with over 5 years of experience leading groups through Southeast Asia.
              Specialized in cultural and adventure tours, with a passion for connecting travelers with local communities.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Star className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">New Tour Package Added</h4>
                    <p className="text-sm text-gray-500">Added "Bali Paradise Explorer" to available tours</p>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
              <span className="text-sm text-gray-500">View all</span>
            </div>
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={`https://images.unsplash.com/photo-${1500 + i}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                      alt="Reviewer"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Amazing tour guide! Made our trip to Bali unforgettable with great local insights.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}