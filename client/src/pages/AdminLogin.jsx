import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', credentials);
      if (res.data && res.data.token) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#F4F3E6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#5D0703] mb-2">
            Admin Login
          </h2>
          <p className="text-[#FC703C]">Enter your credentials to access the admin dashboard</p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-lg sm:px-10 border border-[#FFA175] border-opacity-20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center" 
                role="alert"
              >
                <FaExclamationCircle className="text-red-500 mr-2" />
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
            
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <label htmlFor="email" className="block text-sm font-medium text-[#5D0703] mb-1">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-[#FC703C]" />
                </div>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01 }}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] transition-all duration-200 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </motion.div>

            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <label htmlFor="password" className="block text-sm font-medium text-[#5D0703] mb-1">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-[#FC703C]" />
                </div>
                <motion.input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01 }}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] transition-all duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium bg-[#FC703C] hover:bg-[#5D0703] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC703C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaSignInAlt className="mr-2" />
                    Sign In
                  </div>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 text-center text-sm text-[#5D0703]"
        custom={3}
        initial="hidden"
        animate="visible"
        variants={formItemVariants}
      >
        <p>
          Return to{' '}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            className="font-medium text-[#FC703C] hover:text-[#5D0703] focus:outline-none"
          >
            Home Page
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;