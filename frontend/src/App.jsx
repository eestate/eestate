
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/user/Profile";
import Footer from "./components/Footer";
import PropertyListing from "./pages/PropertListing";
import PropertyDetail from "./pages/PropertDetail";
import AgentLayout from "./layouts/AgentLayout";
import AgentDashboard from "./pages/Agent/AgentDashboard";
import AgentProperties from "./pages/Agent/AgentProperties";
import AgentMessages from "./pages/Agent/AgentMessages";
import AgentEnquiries from "./pages/Agent/AgentEnquiries";
import { AdminSidebar } from "./pages/admin/AdminSidebar";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserManagement from "./pages/admin/AdminuserManagement";
import AdminProperty from "./pages/admin/AdminProperty";
import AdminSubscription from "./pages/admin/AdminSubctription";
import AdminBooking from "./pages/admin/AdminBooking";
import { AuthStateChecker } from "./components/AuthStateChecker";
import RoleRouter from "./ProtectedRoutes/RoleRouter";
import AgentListingPage from "./pages/AgentListing";
import AgentDetailsPage from "./pages/AgentDetails";
import About from "./pages/About";
import { ProtectedRoute } from "./ProtectedRoutes/ProtectedRoute";
import UserDetails from "./pages/admin/UserDetails";
import AgentDetails from "./pages/admin/AgentDetails";
import AgentProfile from "./pages/Agent/AgentProfile";
import AgentSubscription from "./pages/Agent/AgentSubscription";
import AdminAboutPage from "./pages/admin/AdminAboutPage";
import AdminPropertyDetails from "./pages/admin/AdminPropertyDetails";
import BookingDetails from "./pages/admin/BookingDetails";
import NotificationAlert from "./components/NotificationAlert";


import AgentSuccess from './pages/Agent/AgentSuccess'
import ContactUs from "./pages/ContactUs";
import Help from "./pages/Help";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminContentManagement from "./pages/admin/AdminContentManagement";

const App = () => {
  const location = useLocation();
  const isAdminOrAgentRoute =
    location.pathname.startsWith("/agent") ||
    location.pathname.startsWith("/admin");

    const isAgentRoute = location.pathname.startsWith("/agent");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrAgentRoute && <Navbar />}
      <AuthStateChecker />
      <RoleRouter />

      <main className="flex-grow">
        {isAgentRoute && <NotificationAlert />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyListing />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/listingagents" element={<AgentListingPage />} />
          <Route path="/listingagents/:id" element={<AgentDetailsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact-us" element={<ContactUs/>}/>
          <Route path="/help" element={<Help/>}/>
          <Route path="/termsandconditions" element={<TermsAndConditions/>}/>
           <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>


          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <AgentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AgentDashboard />} />
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="properties" element={<AgentProperties />} />
            <Route path="messages" element={<AgentMessages />} />
            <Route path="enquiries" element={<AgentEnquiries />} />
            <Route path="agentprofile" element={<AgentProfile />} />
            <Route path="subscription" element={<AgentSubscription />} />
            <Route path='subscription/success' element={<AgentSuccess/>}/>
          </Route>

          {/* Admin Routes (if needed) */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="user-management" element={<AdminUserManagement />} />
            {/* user and agent details  */}
            <Route path="user-management/user/:id" element={<UserDetails />} />
            <Route
              path="user-management/agent/:id"
              element={<AgentDetails />}
            />
            <Route
              path="user-management/agent/:id/:id"
              element={<AdminPropertyDetails />}
            />

            <Route path="property-moderation" element={<AdminProperty />} />
            <Route
              path="property-moderation/:id"
              element={<AdminPropertyDetails />}
            />
            <Route path="subscriptions" element={<AdminSubscription />} />
            <Route path="bookings" element={<AdminBooking />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="content-management" element={<AdminContentManagement />} />
          </Route>
        </Routes>
      </main>

      {!isAdminOrAgentRoute && <Footer />}
    </div>
  );
};

export default App;
