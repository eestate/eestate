"use client";
import { Building, FileText, Home, Bell, MessageSquare, User, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "../AuthModal";
import {
  useGetNotyfQuery,
  useNotificationIsReadMutation,
} from "@/redux/services/AgentApi";
import { format } from "timeago.js";

export const AgentNavbar = () => {
  const UserDetails = JSON.parse(localStorage.getItem("user"));
  const userId = UserDetails?._id;

  const [notyfReaded] = useNotificationIsReadMutation();
  const { data, refetch: notyfRefetch } = useGetNotyfQuery({ userId });

  useEffect(() => {
    console.log("notyf data", data);
  }, [data]);

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout, isLoggingOut, refetch } =
    useAuth();
  const notificationRef = useRef(null);
  const bellRef = useRef(null);

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);



  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = data?.data || [];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "properties", label: "Properties", icon: Building },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "enquiries", label: "Enquiries", icon: FileText },
  ];

  const currentPage = location.pathname.split("/")[2] || "dashboard";

  const handleNavigation = (tabId) => navigate(`/agent/${tabId}`);

  const handleLogout = async () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = async () => {
    await logout();
    window.location.href = "/";
  };



  const handleProfileClick = () => {
    isAuthenticated ? navigate("/agent/agentprofile") : setIsLoginOpen(true);
    setIsLogoutConfirmOpen(false);
    window.location.href = '/';
  };



  const handleSubscriptionClick = () => {
    isAuthenticated ? navigate("/agent/subscription") : setIsLoginOpen(true);
  };

  const toggleNotifications = () => setIsNotificationOpen((prev) => !prev);

  if (isLoading) {
    return (
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium text-gray-900 self-center">
                eestate
              </span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium text-gray-900 self-center">
                eestate
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  ref={bellRef}
                  className="relative p-1"
                  onClick={() => {
                    toggleNotifications();
                    notyfRefetch();
                    notyfReaded({ userId });
                  }}
                >
                  <Bell className="w-5 h-5 text-gray-600" />

                  {notifications.some((noti) => noti.isRead === false) && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  )}
                </button>

                {isNotificationOpen && (
                  <div
                    ref={notificationRef}
                    className="fixed top-16 right-4 w-[90vw] sm:w-80 md:w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <li
                          key={notification?._id}
                          className="flex justify-between items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        >
                          {/* Left: Property image + user name + address */}
                          <div className="flex gap-3 items-start">
                            <img
                              src={notification?.propertyId?.images?.[0]}
                              alt="Property"
                              className="w-10 h-10 rounded-md object-cover mt-1"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {notification?.userId?.name} made an enquiry
                              </p>
                              <p className="text-xs text-gray-600">
                                {
                                  notification?.propertyId?.location
                                    ?.fullAddress
                                }
                              </p>
                            </div>
                          </div>

                          {/* Right: Time ago */}
                          <p className="text-xs text-gray-400 whitespace-nowrap mt-1">
                            {format(notification?.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                    
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user?.profilePic}
                        className="object-cover"
                      />
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
                    <DropdownMenuItem onClick={handleProfileClick}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSubscriptionClick}>
                      Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
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

          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 border-t border-gray-200 mt-2 pt-2">
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

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${
                  isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
