import React from 'react';
import { 
  BarChart3, 
  Users, 
  Home, 
  CreditCard, 
  Calendar,
  Bell,
  User,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Filter,
  Search
} from 'lucide-react';

// User Management Component
const AdminUserManagement = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg">
          <Filter size={16} />
          <span>All Roles</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Joined Date</th>
                <th className="text-left p-4">Properties</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', email: 'john@example.com', role: 'Agent', status: 'Active', date: 'Jan 15, 2024', properties: 5 },
                { name: 'Sarah Williams', email: 'sarah@example.com', role: 'Agent', status: 'Active', date: 'Dec 3, 2023', properties: 12 },
                { name: 'Michael Brown', email: 'michael@example.com', role: 'Agent', status: 'Inactive', date: 'Feb 18, 2024', properties: 3 },
                { name: 'Emma Johnson', email: 'emma@example.com', role: 'Agent', status: 'Active', date: 'Apr 8, 2024', properties: 8 },
                { name: 'David Wilson', email: 'david@example.com', role: 'Agent', status: 'Active', date: 'May 12, 2024', properties: 6 },
              ].map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{user.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.date}</td>
                  <td className="p-4">{user.properties}</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
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

export default AdminUserManagement
