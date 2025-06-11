import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { ProtectedRoute } from './ProtectedRoutes/ProtectedRoute'
import Profile from './pages/user/Profile'
import Footer from './components/Footer'
import PropertyListing from './pages/PropertListing'
import PropertyDetail from './pages/PropertDetail'
import RoleRouter from './ProtectedRoutes/RoleRouter'
import AgentLayout from './layouts/AgentLayout'
import AgentDashboard from './pages/Agent/AgentDashboard'
import AgentProperties from './pages/Agent/AgentProperties'
import AgentMessages from './pages/Agent/AgentMessages'
import AgentEnquiries from './pages/Agent/AgentEnquiries'
import { AdminSidebar } from './pages/admin/AdminSidebar'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUserManagement from './pages/admin/AdminuserManagement'
import AdminProperty from './pages/admin/AdminProperty'
import AdminSubscription from './pages/admin/AdminSubctription'
import AdminBooking from './pages/admin/AdminBooking'

const App = () => {
  const location = useLocation()
  const isAdminOrAgentRoute = location.pathname.startsWith('/agent') || location.pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrAgentRoute && <Navbar />}
      <RoleRouter />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyListing />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          
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

          <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin']}>
<AdminLayout/>
          </ProtectedRoute>}>

          <Route index element={<AdminDashboard/>}/>
          <Route path='dashboard' element={<AdminDashboard/>}/>
          <Route path='user-management' element={<AdminUserManagement/>}/>
          <Route path='property-moderation' element={<AdminProperty/>}/>
          <Route path='subscriptions' element={<AdminSubscription/>}/>
          <Route path='bookings'  element={<AdminBooking/>}/>          
          </Route>
        </Routes>
      </main>
      
      {!isAdminOrAgentRoute && <Footer />}
    </div>
  )
}

export default App

