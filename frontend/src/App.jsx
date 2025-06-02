import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoutes/ProtectedRoute'

const App = () => {
  const location = useLocation()

  return (
    <div>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}


export default App