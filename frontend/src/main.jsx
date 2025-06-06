import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { store } from './redux/store'

const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
  <GoogleOAuthProvider clientId={CLIENTID}>
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
  </Provider>
)
