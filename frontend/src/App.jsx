import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoutes/ProtectedRoute'
import Profile from './pages/user/Profile'
import Footer from './components/Footer'
import PropertyListing from './pages/PropertListing'
import PropertyDetail from './pages/PropertDetail'
import AgentNavbar from './pages/Agent/AgentNavbar'
import About from './pages/About'
import AgentListingPage from './pages/AgentListing'
import AgentDetailsPage from './pages/AgentDetails'

const App = () => {
  const location = useLocation()

  return (
    <div>
      {location.pathname !== '/agent' && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path='/properties' element={<PropertyListing/>} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path='/about' element={<About/>}/>
         <Route path="/agents" element={<AgentListingPage />} />
          <Route path="/agents/:id" element={<AgentDetailsPage />} />
        <Route path='/agent' element={<AgentNavbar/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}


export default App