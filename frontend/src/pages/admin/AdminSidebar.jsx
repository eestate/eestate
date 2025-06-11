import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Home, 
  CreditCard, 
  Calendar,
  Bell,
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminUserManagement from './AdminuserManagement';
import AdminProperty from './AdminProperty';
import AdminSubscription from './AdminSubctription';
import AdminBooking from './AdminBooking';

// Sidebar Component
export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    // { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'property-moderation', label: 'Property Moderation', icon: Home },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-white text-black h-screen flex flex-col">
      <div className="p-4 border-b border-white-700">
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
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id 
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
      
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-red-300 hover:text-black">
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};


// // Header Component
// const Header = ({ activeTab }) => {
//   const getPageTitle = (tab) => {
//     const titles = {
//       'dashboard': 'Dashboard',
//       'analytics': 'Analytics',
//       'user-management': 'User Management',
//       'property-moderation': 'Property Moderation',
//       'subscriptions': 'Subscription Management',
//       'bookings': 'Booking Monitoring'
//     };
//     return titles[tab] || 'Dashboard';
//   };

//   return (
//     <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
//       <h1 className="text-xl font-semibold"></h1>
//       <div className="flex items-center space-x-4">
//         <button className="p-2 text-gray-400 hover:text-gray-600 relative">
//           <Bell size={20} />
//           <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//         </button>
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//           <span className="text-sm font-medium">Admin User</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
    //   case 'analytics':
    //     return <AdminUserManagement />;
      case 'user-management':
        return <AdminUserManagement />;
      case 'property-moderation':
        return <AdminProperty />;
      case 'subscriptions':
        return <AdminSubscription />;
      case 'bookings':
        return <AdminBooking />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} />
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;