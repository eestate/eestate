import { Building, FileText, Home, Bell, MessageSquare, User } from "lucide-react";
import React, { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useGetAgentStatsQuery } from "@/redux/services/AgentApi";
import { useCheckAuthQuery } from "@/redux/services/authApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetAgentBookingsQuery } from "@/redux/services/BookingApi";
const AgentDashboard = () => {
  // Check if user is authenticated and an agent
  const { data: authData, isLoading: authLoading } = useCheckAuthQuery();
  const { data: statsData, isLoading: statsLoading, error } = useGetAgentStatsQuery(undefined, {
    skip: !authData || authData.user?.role !== 'agent',
  });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
  const agentId = user?._id;

 const {
    data: bookings = [],
    isLoading,
  } = useGetAgentBookingsQuery(agentId, {
    skip: !agentId,
  });

    const { totalProperties, activeProperties, soldProperties, totalEnquiries, monthlyStats } = statsData || {};



  useEffect(()=>{
    console.log('all bookings',bookings)
  },[bookings])

  useEffect(()=>{
  console.log('statsData',statsData)
},[statsData])

  if (authLoading || statsLoading || isLoading) {
    return <LoadingSpinner/>
  }

  if (error || !authData || authData.user?.role !== 'agent') {
    return <div className="p-6 bg-gray-50">Unauthorized or error fetching data</div>;
  }



  

  return (
    <div className="p-6 bg-gray-50">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Home className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalProperties || 0}</div>
          <div className="text-sm text-gray-600">Total Properties</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-600 rounded-sm"></div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{activeProperties || 0}</div>
          <div className="text-sm text-gray-600">Active Properties</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{soldProperties || 0}</div>
          <div className="text-sm text-gray-600">Sold Properties</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalEnquiries || 0}</div>
          <div className="text-sm text-gray-600">Total Enquiries</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg border-2 border-blue-500 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Views</h2>
        
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyStats || []}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid 
                strokeDasharray="0" 
                stroke="#f3f4f6" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 6000]}
                ticks={[0, 1500, 3000, 4500, 6000]}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1' }}
              />
              <Line
                type="monotone"
                dataKey="enquiries"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend */}
        <div className="flex items-center justify-center space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-sm text-blue-500">Views</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span className="text-sm text-red-500">Enquiries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;