import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.jpg';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-[#404042] text-white">
      <div className="flex items-center">
        <img src={logo} alt="Toota" className="h-16" />
      </div>
      <nav className="hidden md:flex space-x-4">
        <Link to="/" className="hover:text-[#f89f1b]">Home</Link>
        <Link to="/about" className="hover:text-[#f89f1b]">About Us</Link>
        <Link to="/become-driver" className="hover:text-[#f89f1b]">Become a Driver</Link>
      </nav>
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/login/user" className="px-4 py-2 rounded-md bg-[#f89f1b] text-white hover:bg-gray-300 transition-colors duration-300">
          Login
        </Link>
        <Link to="/signup/user" className="px-4 py-2 rounded-md bg-transparent text-white border border-white hover:bg-white hover:text-black transition-colors duration-300">
          Sign Up
        </Link>
      </div>
      <button onClick={toggleMenu} className="md:hidden focus:outline-none">
        <svg
          className="h-6 w-6 text-white hover:text-[#f89f1b]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <nav className={`md:hidden bg-[#404042] text-white shadow-md transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="py-2 px-4 space-y-2">
          <li>
            <Link to="/" className="block py-2 hover:text-[#f89f1b]">Home</Link>
          </li>
          <li>
            <Link to="/about" className="block py-2 hover:text-[#f89f1b]">About Us</Link>
          </li>
          <li>
            <Link to="/become-driver" className="block py-2 hover:text-[#f89f1b]">Become a Driver</Link>
          </li>
          <li>
            <Link to="/login/user" className="block py-2 hover:text-[#f89f1b]">Login</Link>
          </li>
          <li>
            <Link to="/signup/user" className="block py-2 hover:text-[#f89f1b]">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

