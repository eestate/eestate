import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Home, 
  CreditCard, 
  Calendar,
  Info ,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'user-management', label: 'User Management', icon: Users, path: '/admin/user-management' },
    { id: 'property-moderation', label: 'Property Moderation', icon: Home, path: '/admin/property-moderation' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'about', label: 'About', icon: Info, path: '/admin/about' },

  ];

  const currentPage = location.pathname.split('/')[2] || 'dashboard';

  const handleNavigation = (path, id) => {
    navigate(path);
    setActiveTab(id);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
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
          onClick={handleLogout} 
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-500 hover:text-red-700"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};