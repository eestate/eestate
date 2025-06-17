import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/pages/admin/AdminSidebar';
import { 
  BarChart3, 
  Users, 
  Home, 
  CreditCard, 
  Calendar,
  Bell,
} from 'lucide-react';

// Header Component
const Header = ({ activeTab }) => {
  const getPageTitle = (tab) => {
    const titles = {
      'dashboard': 'Dashboard',
      'user-management': 'User Management',
      'property-moderation': 'Property Moderation',
      'subscriptions': 'Subscription Management',
      'bookings': 'Booking Monitoring'
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <div className="fixed top-0 left-64 right-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
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

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="fixed top-0 left-0 h-full w-64 z-20">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="h-16"></div> {/* Spacer for fixed header */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;