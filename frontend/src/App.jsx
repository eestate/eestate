import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoutes/ProtectedRoute'
import Profile from './pages/user/Profile'

const App = () => {
  const location = useLocation()

  return (
    <div>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}


export default App