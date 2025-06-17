import React, { useState } from 'react';
import { 
  Bell,
  Eye,
  Filter,
  CheckCircle,
  Search
} from 'lucide-react';

// Booking Monitoring Component
const AdminBooking = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  const bookings = [
    { 
      property: 'Luxury Beachfront Villa', 
      location: 'Miami, FL',
      guest: 'John Doe', 
      agent: 'Sarah Williams', 
      date: 'Jan 15, 2024', 
      time: '2:00 PM',
      status: 'Confirmed',
      statusColor: 'blue',
      description: 'Viewing appointment for a potential buyer interested in beachfront properties.'
    },
    { 
      property: 'Modern Downtown Apartment', 
      location: 'Austin, TX',
      guest: 'Emma Johnson', 
      agent: 'David Brown', 
      date: 'Jan 18, 2024', 
      time: '10:30 AM',
      status: 'Confirmed',
      statusColor: 'blue',
      description: 'Scheduled tour for a young professional relocating to the city.'
    },
    { 
      property: 'Countryside Farmhouse', 
      location: 'Vermont',
      guest: 'Michael Davis', 
      agent: 'Sarah Williams', 
      date: 'Jan 20, 2024', 
      time: '3:15 PM',
      status: 'Completed',
      statusColor: 'green',
      description: 'Completed viewing for a family interested in rural properties.'
    },
    { 
      property: 'Urban Loft Space', 
      location: 'Chicago, IL',
      guest: 'Lisa Anderson', 
      agent: 'Michael Brown', 
      date: 'Jan 22, 2024', 
      time: '11:00 AM',
      status: 'Cancelled',
      statusColor: 'red',
      description: 'Cancelled due to guest scheduling conflict.'
    },
  ];

  const statusOptions = ['All Status', 'Confirmed', 'Completed', 'Cancelled'];

  const filteredBookings = bookings
    .filter(booking => selectedStatus === 'All Status' || booking.status === selectedStatus)
    .filter(booking => 
      booking.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.agent.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  const handleStatusFilterSelect = (status) => {
    setSelectedStatus(status);
    setShowStatusDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Booking Monitoring</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by property, location, guest, or agent..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <button 
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Filter size={16} />
              <span>{selectedStatus}</span>
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {statusOptions.map((status, index) => (
                  <button 
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleStatusFilterSelect(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Property</th>
                <th className="text-left p-4">Guest</th>
                <th className="text-left p-4">Agent</th>
                <th className="text-left p-4">Date & Time</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{booking.property}</p>
                      <p className="text-sm text-gray-500">{booking.location}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{booking.guest}</td>
                  <td className="p-4 text-gray-600">{booking.agent}</td>
                  <td className="p-4">
                    <div>
                      <p className="text-gray-600">{booking.date}</p>
                      <p className="text-sm text-gray-500">{booking.time}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      booking.statusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                      booking.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => openDetails(booking)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Communications */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Recent Communications</h3>
        </div>
        <div className="p-4 space-y-4">
          {[
            { 
              title: 'John Doe + Sarah Williams',
              message: 'Hi Sarah! Just wanted to confirm tomorrow\'s viewing appointment. Could you please confirm the exact address for the property?',
              time: '15 minutes ago'
            },
            { 
              title: 'Emma Johnson + David Brown',
              message: 'Thank you for scheduling the viewing. Is there parking available at the building or nearby?',
              time: '1 hour ago'
            },
            { 
              title: 'Sarah Williams + Michael Davis',
              message: 'The viewing went well. The client has expressed interest and would like to discuss potential offers.',
              time: '3 hours ago'
            },
          ].map((comm, index) => (
            <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{comm.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{comm.message}</p>
                </div>
                <span className="text-xs text-gray-500 ml-4">{comm.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <button className="text-blue-500 text-sm hover:text-blue-600">
            View all communications →
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button 
              className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeDetails}
            >
              Close
            </button>
            
            <h2 className="text-xl font-semibold mb-4">{selectedBooking.property}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedBooking.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guest</p>
                <p className="font-medium">{selectedBooking.guest}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Agent</p>
                <p className="font-medium">{selectedBooking.agent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{selectedBooking.date} at {selectedBooking.time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Status</p>
                <p className="flex items-center space-x-2">
                  <CheckCircle size={16} className={`${
                    selectedBooking.statusColor === 'blue' ? 'text-blue-500' :
                    selectedBooking.statusColor === 'green' ? 'text-green-500' :
                    'text-red-500'
                  }`} />
                  <span className="font-medium">{selectedBooking.status}</span>
                </p>
              </div>
            </div>
            
            <p className="text-gray-600">{selectedBooking.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard Component (placeholder)
const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
        <p className="text-gray-500">Dashboard content will be displayed here</p>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ activeTab }) => {
  const getPageTitle = (tab) => {
    const titles = {
      'dashboard': 'Dashboard',
      'analytics': 'Analytics',
      'user-management': 'User Management',
      'property-moderation': 'Property Moderation',
      'subscriptions': 'Subscription Management',
      'bookings': 'Booking Monitoring'
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">{getPageTitle(activeTab)}</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="text-sm font-medium">Admin User</span>
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;