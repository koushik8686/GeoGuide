import React, { useEffect, useState } from 'react';
import { User, Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { api } from '../services/api';
import type { User as UserType } from '../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await api.users.getAll();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Users Management
        </h2>
        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
          />
        </div>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 flex items-center gap-2 hover:bg-gray-50">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600">Name</th>
              <th className="text-left py-3 px-4 text-gray-600">Email</th>
              <th className="text-left py-3 px-4 text-gray-600">Joined</th>
              <th className="text-left py-3 px-4 text-gray-600">Status</th>
              <th className="text-right py-3 px-4 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-800">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4 text-gray-600">{user.joinedDate}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-end">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Pencil className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;