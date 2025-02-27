import React, { useState } from 'react';
import { Send, Search, Phone, Video, MoreHorizontal } from 'lucide-react';
import Header from '../components/Header';

const conversations = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'Perfect! See you tomorrow then.',
    time: '2m ago',
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Michael Chen',
    lastMessage: 'How many people are in the group?',
    time: '1h ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // Add more conversations as needed
];

export default function Chat() {
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState(conversations[0]);

  return (
    <div className="space-y-6">
      <Header title="Messages" />
      
      <div className="grid grid-cols-12 bg-white rounded-xl shadow-sm overflow-hidden h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="col-span-4 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-73px)]">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                  activeChat.id === conv.id ? 'bg-indigo-50' : ''
                }`}
              >
                <img src={conv.avatar} alt={conv.name} className="h-12 w-12 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeChat.avatar} alt={activeChat.name} className="h-10 w-10 rounded-full" />
              <div>
                <h3 className="font-medium text-gray-900">{activeChat.name}</h3>
                <span className="text-sm text-green-500">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Sample messages - you would map through actual messages here */}
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <img src={activeChat.avatar} alt="" className="h-8 w-8 rounded-full" />
                <div className="bg-gray-100 rounded-lg rounded-bl-none p-3 max-w-md">
                  <p className="text-gray-900">Hi! I'm interested in the Bali tour package.</p>
                </div>
                <span className="text-xs text-gray-500">2:30 PM</span>
              </div>
              
              <div className="flex items-end gap-2 justify-end">
                <span className="text-xs text-gray-500">2:31 PM</span>
                <div className="bg-indigo-600 text-white rounded-lg rounded-br-none p-3 max-w-md">
                  <p>Hello! Of course, I'd be happy to help. What would you like to know about the package?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}