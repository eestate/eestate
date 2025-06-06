
import { Building, FileText, Home, Bell, MessageSquare, User, Send, Paperclip, Mic } from "lucide-react";
import React, { useState } from "react";
import AgentDashboard from "./AgentDashboard";
import AgentProperties from "./AgentProperties";
import AgentMessages from "./AgentMessages";
import AgentEnquiries from "./AgentEnquiries";
const AgentNavbar = ({ onNavigate, currentPage }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "properties", label: "Properties", icon: Building },
      { id: "messages", label: "Messages", icon: MessageSquare },
      { id: "enquiries", label: "Enquiries", icon: FileText },
    ];
  
    const handleNavigation = (tabId) => {
      if (onNavigate) {
        onNavigate(tabId);
      }
    };
  
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    return (
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium text-gray-900 self-center">eestate</span>
            </div>
  
            <div className="flex items-center space-x-4">
              <button className="relative p-1">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              </button>
  
              <div className="relative flex items-center space-x-2">
                <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">machaan</span>
                <button onClick={toggleDropdown} className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-10 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          <div className="flex justify-center space-x-8 border-t border-gray-200 mt-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center space-x-2 px-1 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    currentPage === item.id
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  };
//   export default AgentNavbar

  // Main App Component
  const App = () => {
    const [currentPage, setCurrentPage] = useState("dashboard");
  
    const handleNavigation = (page) => {
      setCurrentPage(page);
    };
  
    const renderCurrentPage = () => {
      switch (currentPage) {
        case "dashboard":
          return <AgentDashboard />;
        case "properties":
          return <AgentProperties />;
        case "messages":
          return <AgentMessages />;
        case "enquiries":
          return <AgentEnquiries />;
        default:
          return <AgentDashboard />;
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100">
        <AgentNavbar 
          onNavigate={handleNavigation} 
          currentPage={currentPage}
        />
        <main className="max-w-7xl mx-auto">
          {renderCurrentPage()}
        </main>
      </div>
    );
  };
  
  export default App