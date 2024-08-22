import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.jpg';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#404042] shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4" aria-label="Main Navigation">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" aria-label="Toota Home">
              <img src={logo} alt="Toota Logo" className="h-16" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex flex-grow justify-center space-x-6">
            <Link to="/" className="text-white hover:text-gray-800" aria-label="Home">Home</Link>
            <Link to="/about" className="text-white hover:text-gray-800" aria-label="About Us">About Us</Link>
            <Link to="/become-driver" className="text-white hover:text-gray-800" aria-label="Become a Driver">Become a Driver</Link>
          </div>

          {/* Call to Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login/user" 
              className="px-4 py-2 rounded-md bg-[#f89f1b] text-white hover:bg-gray-300 transition-colors duration-300" 
              aria-label="Login"
            >
              Login
            </Link>
            <Link to="/signup/user" 
              className="px-4 py-2 rounded-md bg-transparent text-white border border-white hover:bg-white hover:text-black transition-colors duration-300" 
              aria-label="Sign Up"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} 
            className="md:hidden focus:outline-none" 
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6 text-white hover:text-[#f89f1b]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden bg-[#404042] text-white shadow-md transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="py-2 px-4 space-y-2" aria-label="Mobile Navigation">
            <li>
              <Link to="/" className="block py-2 hover:text-[#f89f1b]" aria-label="Home">Home</Link>
            </li>
            <li>
              <Link to="/about" className="block py-2 hover:text-[#f89f1b]" aria-label="About Us">About Us</Link>
            </li>
            <li>
              <Link to="/become-driver" className="block py-2 hover:text-[#f89f1b]" aria-label="Become a Driver">Become a Driver</Link>
            </li>
            <li>
              <Link to="/login/user" className="block py-2 hover:text-[#f89f1b]" aria-label="Login">Login</Link>
            </li>
            <li>
              <Link to="/signup/user" className="block py-2 hover:text-[#f89f1b]" aria-label="Sign Up">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;

