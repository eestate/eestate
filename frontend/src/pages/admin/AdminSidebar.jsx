

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Home, 
  CreditCard, 
  Calendar,
  Info,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'user-management', label: 'User Management', icon: Users, path: '/admin/user-management' },
    { id: 'property-moderation', label: 'Property Moderation', icon: Home, path: '/admin/property-moderation' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'about', label: 'About', icon: Info, path: '/admin/about' },
    { id: 'content-management', label: 'Admin Content Management', icon: FileText, path: '/admin/content-management' },
  ];

  const currentPage = location.pathname.split('/')[2] || 'dashboard';

  const handleNavigation = (path, id) => {
    navigate(path);
    setActiveTab(id);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-64 bg-white text-black h-full flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold">
            E
          </div>
          <span className="text-xl font-semibold">eestate</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentPage === item.id 
                      ? 'bg-black text-white' 
                      : 'text-black hover:bg-black hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogoutClick} 
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-500 hover:text-red-700"
        >
          <span>Logout</span>
        </button>
      </div>

        {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};