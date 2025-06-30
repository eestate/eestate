import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-black text-white flex flex-col justify-between px-6 py-10 sm:py-12 md:py-16 pb-0">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
        {/* Left content */}
        <div className="w-full md:w-1/3 flex flex-col sm:flex-row justify-center md:justify-start gap-10 md:gap-16">
          {/* Navigation Links */}
          <ul className="space-y-3 text-center sm:text-left border-b border-gray-700 sm:border-none pb-4 sm:pb-0">
            <li>
              <Link
                to="/"
                className="font-manrope font-semibold text-sm sm:text-base hover:underline transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="font-manrope font-semibold text-sm sm:text-base hover:underline transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/properties"
                className="font-manrope font-semibold text-sm sm:text-base hover:underline transition"
              >
                Property
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="font-manrope font-semibold text-sm sm:text-base hover:underline transition"
              >
                Contact us
              </Link>
            </li>
          </ul>

          {/* Policy Links */}
          <ul className="space-y-3 text-center sm:text-left border-b border-gray-700 sm:border-none pb-4 sm:pb-0">
            <li>
              <Link
                to="/termsandconditions"
                className="font-manrope font-semibold text-sm sm:text-base hover:underline transition"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacypolicy"
                className="font-manrope font-semibold text-sm sm:text-base hover:underline transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="font-manrope font-semibold text-sm sm:text-base hover:underline transition"
              >
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Right content */}
        <div className="w-full md:w-2/3 flex flex-col items-center md:items-end">
          {/* Social icons */}
          <div className="flex gap-5 mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="bg-white rounded-lg p-3 hover:opacity-80 transition"
            >
              <FacebookIcon size={24} className="text-black" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="bg-white rounded-lg p-3 hover:opacity-80 transition"
            >
              <InstagramIcon size={24} className="text-black" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="bg-white rounded-lg p-3 hover:opacity-80 transition"
            >
              <TwitterIcon size={24} className="text-black" />
            </a>
          </div>

          {/* Brand text */}
          <p className="text-5xl sm:text-7xl md:text-[100px] font-manrope font-light tracking-wide text-white select-none text-center md:text-right">
            eestate
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      {/* <div className="text-center mt-10 border-t border-gray-800 pt-4"> */}
      <p className="font-extralight text-sm sm:text-base font-manrope text-gray-400 select-none text-center">
        © 2025 eestate. All rights reserved
      </p>
      {/* </div> */}
    </footer>
  );
}

export default Footer;
