import React from 'react'
import { Link } from 'react-router-dom'
import {
  MenuIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from 'lucide-react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-black text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <ul className="space-y-2">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/properties">Property</Link>
                </li>
                <li>
                  <Link to="/contact">Contact us</Link>
                </li>
              </ul>
            </div>
            <div className="mb-6 md:mb-0">
              <ul className="space-y-2">
                <li>
                  <Link to="/terms">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/help">Help Center</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="flex gap-4 mb-6">
                <FacebookIcon size={24} />
                <InstagramIcon size={24} />
                <TwitterIcon size={24} />
              </div>
              <div className="text-4xl font-light mb-4">eestate</div>
              <p className="text-sm">© 2025 eestate. All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer