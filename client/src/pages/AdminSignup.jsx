import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(import.meta.env.VITE_SERVER_API_URL + '/api/admin/signup', formData);
      toast.success('Admin registered successfully!');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
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
            Admin Signup
          </h2>
          <p className="text-[#FC703C]">Create an admin account to manage events</p>
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
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <label htmlFor="name" className="block text-sm font-medium text-[#5D0703] mb-1">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-[#FC703C]" />
                </div>
                <motion.input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01 }}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] transition-all duration-200 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
            >
              <label htmlFor="email" className="block text-sm font-medium text-[#5D0703] mb-1">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-[#FC703C]" />
                </div>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01 }}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] transition-all duration-200 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              custom={2}
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
                  value={formData.password}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01 }}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] transition-all duration-200 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Create a secure password"
                />
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
              className="flex flex-col space-y-3"
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
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign Up <FaArrowRight className="ml-2" />
                  </div>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/admin/login')}
                className="w-full flex justify-center py-3 px-4 border border-[#FC703C] rounded-lg shadow-sm text-[#FC703C] font-medium bg-white hover:bg-[#F4F3E6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC703C] transition-colors duration-200"
              >
                <div className="flex items-center">
                  <FaArrowLeft className="mr-2" />
                  Back to Login
                </div>
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 text-center text-sm text-[#5D0703]"
        custom={4}
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

export default AdminSignup;