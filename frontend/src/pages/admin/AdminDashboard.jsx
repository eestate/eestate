import React from 'react';
import { 
  Users, 
  Home, 
  CreditCard, 
  TrendingUp,
} from 'lucide-react';


// Analytics Component
const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Views</p>
              <p className="text-2xl font-bold">2453</p>
              <p className="text-green-500 text-sm">↗ 8.5%</p>
            </div>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Properties</p>
              <p className="text-2xl font-bold">1234</p>
              <p className="text-green-500 text-sm">↗ 3.2%</p>
            </div>
            <Home className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Users</p>
              <p className="text-2xl font-bold">342</p>
              <p className="text-red-500 text-sm">↘ 2.1%</p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-2xl font-bold">892</p>
              <p className="text-green-500 text-sm">↗ 5.7%</p>
            </div>
            <CreditCard className="text-orange-500" size={24} />
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[40, 60, 45, 80, 65, 90, 75, 85, 95, 100, 110, 120].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Performing Agents */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Top Performing Agents</h3>
        <div className="space-y-4">
          {[
            { name: 'Sarah Williams', sales: '23 properties', amount: '$1.2M' },
            { name: 'David Wilson', sales: '18 properties', amount: '$890K' },
            { name: 'Michael Brown', sales: '15 properties', amount: '$720K' },
          ].map((agent, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-gray-500">{agent.sales}</p>
                </div>
              </div>
              <span className="font-semibold">{agent.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard
