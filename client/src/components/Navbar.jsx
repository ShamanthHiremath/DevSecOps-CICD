import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCalendarAlt, FaGraduationCap, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full top-0 z-50 bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaGraduationCap className="text-2xl mr-2 text-[#FC703C]" />
              <span className="text-xl font-bold text-[#5D0703]">
                College Events
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            <motion.div className="flex space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full flex items-center text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-[#FFA175] text-white' 
                    : 'text-[#5D0703] hover:bg-[#F4F3E6]'
                }`}
              >
                <FaHome className="mr-1" />
                Home
              </Link>
              <Link
                to="/events"
                className={`px-4 py-2 rounded-full flex items-center text-sm font-medium transition-colors ${
                  isActive('/events') 
                    ? 'bg-[#FFA175] text-white' 
                    : 'text-[#5D0703] hover:bg-[#F4F3E6]'
                }`}
              >
                <FaCalendarAlt className="mr-1" />
                Events
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#5D0703] hover:bg-[#F4F3E6] focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <FaBars className="h-6 w-6" />
              ) : (
                <FaTimes className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="sm:hidden bg-white shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive('/') 
                  ? 'bg-[#FFA175] text-white' 
                  : 'text-[#5D0703] hover:bg-[#F4F3E6]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaHome className="mr-2" />
              Home
            </Link>
            <Link
              to="/events"
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive('/events') 
                  ? 'bg-[#FFA175] text-white' 
                  : 'text-[#5D0703] hover:bg-[#F4F3E6]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCalendarAlt className="mr-2" />
              Events
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;