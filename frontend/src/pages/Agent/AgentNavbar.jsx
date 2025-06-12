"use client"

import { Building, FileText, Home, Bell, MessageSquare, User, ChevronDown } from "lucide-react";
import React, {  useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "../AuthModal";
import { useEffect } from "react";

export const AgentNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout, isLoggingOut, refetch } = useAuth();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "properties", label: "Properties", icon: Building },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "enquiries", label: "Enquiries", icon: FileText },
  ];

  const currentPage = location.pathname.split('/')[2] || 'dashboard';

  const handleNavigation = (tabId) => {
    navigate(`/agent/${tabId}`);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/agent/profile');
    } else {
      setIsLoginOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium text-gray-900 self-center">eestate</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profilePic} className="object-cover" />
                      <AvatarFallback className="bg-gray-200">
                        {user?.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    {/* <DropdownMenuItem onClick={handleProfileClick}>
                      Profile
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-1"
                >
                  <User className="w-6 h-6 text-gray-600" />
                  <span className="sr-only">Login</span>
                </button>
              )}
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

      <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};