import React, { useState } from 'react';
import { 
  BarChart3, Users, Home, CreditCard, Calendar, Bell, User, 
  TrendingUp, Eye, MoreHorizontal, Filter, Search, CheckCircle 
} from 'lucide-react';

const AdminProperty = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const properties = [
    { 
      name: "Luxury Beachfront Villa", 
      details: "$2,500,000 • 5 beds • 4 baths",
      location: "Miami, FL", 
      agent: "John Doe", 
      status: "Available", 
      submitted: "3 hours ago",
      statusColor: "green",
      description: "Stunning beachfront property with panoramic ocean views, private pool, and direct beach access. Recently renovated with high-end finishes."
    },
    { 
      name: "Modern Downtown Apartment", 
      details: "$850,000 • 2 beds • 2 baths",
      location: "Austin, TX", 
      agent: "Sarah Johnson", 
      status: "Pending", 
      submitted: "5 hours ago",
      statusColor: "yellow",
      description: "Sleek downtown apartment with modern amenities, open floor plan, and city views. Perfect for urban professionals."
    },
    { 
      name: "Suburban Family Home", 
      details: "$450,000 • 4 beds • 3 baths",
      location: "Portland, OR", 
      agent: "Michael Brown", 
      status: "Available", 
      submitted: "1 day ago",
      statusColor: "green",
      description: "Spacious family home in a quiet suburb, featuring a large backyard, modern kitchen, and excellent school district."
    },
    { 
      name: "Urban Loft Space", 
      details: "$720,000 • 1 bed • 1 bath",
      location: "Chicago, IL", 
      agent: "Sarah Williams", 
      status: "Available", 
      submitted: "2 days ago",
      statusColor: "green",
      description: "Chic urban loft with exposed brick, high ceilings, and plenty of natural light. Located in the heart of the city."
    },
  ];

  const openDetails = (property) => {
    setSelectedProperty(property);
  };

  const closeDetails = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Property Moderation</h1>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg">
          <Filter size={16} />
          <span>All Status</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Property</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Agent</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Submitted</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-gray-500">{property.details}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{property.location}</td>
                  <td className="p-4 text-gray-600">{property.agent}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      property.statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{property.submitted}</td>
                  <td className="p-4">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => openDetails(property)}
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

      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button 
              className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeDetails}
            >
              Close
            </button>
            
            <h2 className="text-xl font-semibold mb-4">{selectedProperty.name}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedProperty.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">{selectedProperty.details.split(' • ')[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium">{selectedProperty.details.split(' • ')[1]} • {selectedProperty.details.split(' • ')[2]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Agent</p>
                <p className="font-medium">{selectedProperty.agent}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Status</p>
                <p className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="font-medium">{selectedProperty.status}</span>
                </p>
              </div>
            </div>
            
            <p className="text-gray-600">{selectedProperty.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperty;