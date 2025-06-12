import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Profile from './pages/user/Profile'
import Footer from './components/Footer'
import PropertyListing from './pages/PropertListing'
import PropertyDetail from './pages/PropertDetail'
import AgentLayout from './layouts/AgentLayout'
import AgentDashboard from './pages/Agent/AgentDashboard'
import AgentProperties from './pages/Agent/AgentProperties'
import AgentMessages from './pages/Agent/AgentMessages'
import AgentEnquiries from './pages/Agent/AgentEnquiries'
import AgentListingPage from './pages/AgentListing'
import AgentDetailsPage from './pages/AgentDetails'
import About from './pages/About'
import { AuthStateChecker } from './components/AuthStateChecker'
import { ProtectedRoute } from './ProtectedRoutes/ProtectedRoute'
import RoleRouter from './ProtectedRoutes/RoleRouter'

const App = () => {
  const location = useLocation()
  const isAdminOrAgentRoute = location.pathname.startsWith('/agent') || location.pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrAgentRoute && <Navbar />}
      <AuthStateChecker />
      <RoleRouter/>
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyListing />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/listingagents" element={<AgentListingPage />} />
          <Route path="/listingagents/:id" element={<AgentDetailsPage />} />
          <Route path="/about" element={<About />} />
          

          
          {/* Protected User Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Agent Routes */}
          <Route 
            path="/agent" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AgentDashboard />} />
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="properties" element={<AgentProperties />} />
            <Route path="messages" element={<AgentMessages />} />
            <Route path="enquiries" element={<AgentEnquiries />} />
          </Route>
          
          {/* Admin Routes (if needed) */}
          {/* <Route path="/admin/*" element={<AdminLayout />} /> */}
        </Routes>
      </main>
      
      {!isAdminOrAgentRoute && <Footer />}
    </div>
  )
}

export default App