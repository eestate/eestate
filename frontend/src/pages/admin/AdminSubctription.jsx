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
// Subscription Management Component
const AdminSubscription = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Subscription Management</h1>
      
      {/* Plans */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { name: 'Basic', price: '$0', period: 'per month', features: ['10 property listings', 'Basic support'], color: 'gray' },
          { name: 'Professional', price: '$9.99', period: 'per month', features: ['Unlimited listings', 'Priority support', 'Advanced analytics'], color: 'blue' },
          { name: 'Premium', price: '$24.99', period: 'per month', features: ['Everything in Pro', 'White-label solution', 'Custom integrations'], color: 'purple' },
        ].map((plan, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500"> {plan.period}</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-600">✓ {feature}</li>
              ))}
            </ul>
            <button className={`w-full py-2 px-4 rounded ${
              plan.color === 'blue' ? 'bg-blue-500 text-white' : 
              plan.color === 'purple' ? 'bg-purple-500 text-white' : 
              'bg-gray-500 text-white'
            }`}>
              Edit Plan
            </button>
          </div>
        ))}
      </div>
      
      {/* Subscribers */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Current Subscribers</h3>
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg">
              <Filter size={16} />
              <span>All Plans</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Plan</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Next Payment</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sarah Williams', email: 'sarah@example.com', plan: 'Premium', status: 'Active', nextPayment: 'Feb 15, 2024', amount: '$24.99' },
                { name: 'Michael Brown', email: 'michael@example.com', plan: 'Professional', status: 'Active', nextPayment: 'Feb 20, 2024', amount: '$9.99' },
                { name: 'David Wilson', email: 'david@example.com', plan: 'Premium', status: 'Active', nextPayment: 'Feb 18, 2024', amount: '$24.99' },
                { name: 'Emma Johnson', email: 'emma@example.com', plan: 'Professional', status: 'Cancelled', nextPayment: 'Expired', amount: '$9.99' },
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
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.nextPayment}</td>
                  <td className="p-4 font-medium">{user.amount}</td>
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

export default AdminSubscription