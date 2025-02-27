import React, { useEffect, useState } from 'react';
import { Plus, Filter, Pencil, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import type { Booking } from '../types';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await api.bookings.getAll();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Bookings
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 flex items-center gap-2 bg-white">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Booking
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600">Booking ID</th>
                <th className="text-left py-3 px-4 text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600">Tour Package</th>
                <th className="text-left py-3 px-4 text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800 font-medium">{booking.id}</td>
                  <td className="py-3 px-4 text-gray-800">{booking.customerName}</td>
                  <td className="py-3 px-4 text-gray-600">{booking.tourName}</td>
                  <td className="py-3 px-4 text-gray-600">{booking.date}</td>
                  <td className="py-3 px-4 text-gray-800">${booking.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
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
    </div>
  );
};

export default Bookings;