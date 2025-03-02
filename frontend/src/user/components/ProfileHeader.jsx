import React from 'react';
import { User } from '../types/user';
import { 
  MapPin, 
  Calendar, 
  Award, 
  Users, 
  CheckCircle, 
  Route, 
  Star, 
  Shield,
  Edit,
  Share2
} from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative">
      {/* Cover Background */}
      <div className="h-48 w-full bg-blue-600 rounded-t-xl"></div>
      
      {/* Profile Info */}
      <div className="flex flex-col md:flex-row px-6 -mt-20 pb-5">
        <div className="z-10">
          <div className="relative">
            {/* Avatar with Initials instead of image */}
            <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
              {getInitials(user.name)}
            </div>
            {user.verified && (
              <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full shadow-md">
                <CheckCircle size={20} className="text-white" />
              </div>
            )}
          </div>
        </div>
        
        <div className="md:ml-6 mt-4 md:mt-0 flex-1 md:pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                {user.name}
                {user.verified && (
                  <CheckCircle size={16} className="ml-2 text-blue-500" />
                )}
              </h1>
              <p className="text-gray-600 flex items-center">
                <span className="inline-block w-4 mr-1">@</span>
                {user.email}
              </p>
              {user.phoneNumber && (
                <p className="text-gray-600">{user.phoneNumber}</p>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
              <button className="border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center shadow-sm">
                <Share2 size={16} className="mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4">
        <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center text-blue-600">
            <Route size={20} className="mr-1" />
            <span className="font-bold text-xl">{user.distance_travelled}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Distance (km)</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center text-purple-600">
            <Star size={20} className="mr-1" />
            <span className="font-bold text-xl">{user.experience}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Experience</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center text-amber-600">
            <Shield size={20} className="mr-1" />
            <span className="font-bold text-xl">{user.level}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Level</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center text-green-600">
            <Users size={20} className="mr-1" />
            <span className="font-bold text-xl">{user.followers.length}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Followers</p>
        </div>
      </div>
      
      {/* Join Date and Badges */}
      <div className="mt-2 px-6 flex flex-wrap items-center text-sm text-gray-600">
        <div className="flex items-center mr-4 mb-2 bg-gray-100 px-3 py-1 rounded-full">
          <Calendar size={16} className="mr-1 text-gray-500" />
          <span>Joined {new Date(user.registrationDate).toLocaleDateString()}</span>
        </div>
        
        {user.badges && typeof user.badges !== 'number' && (
          <div className="flex items-center mb-2 bg-gray-100 px-3 py-1 rounded-full">
            <Award size={16} className="mr-1 text-amber-500" />
            <span>{user.badges} Badges</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;