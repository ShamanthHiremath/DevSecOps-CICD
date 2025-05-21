import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarPlus, FaSpinner } from 'react-icons/fa';
import CreateEventForm from '../../components/admin/CreateEventForm';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (formData) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData object for file upload
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      const response = await axios.post(import.meta.env.VITE_SERVER_API_URL + '/api/events/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      toast.success('Event created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F4F3E6] py-12"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={headerVariants}
        >
          <div className="flex items-center">
            <FaCalendarPlus className="text-[#FC703C] text-2xl mr-3" />
            <h2 className="text-3xl font-bold text-[#5D0703]">
              Create Event
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-[#5D0703] hover:bg-[#FC703C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D0703] flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </motion.button>
        </motion.div>

        <motion.div 
          className="mb-10"
          variants={headerVariants}
        >
          <p className="text-[#FC703C] max-w-3xl">
            Fill in the details below to add a new event to your system. Make sure to provide all required information for a complete event listing.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-[#FFA175] border-opacity-20"
          variants={formVariants}
        >
          <div className="bg-gradient-to-r from-[#FC703C] to-[#5D0703] px-6 py-4">
            <h3 className="text-xl font-semibold text-white">Event Details</h3>
            <p className="text-white text-opacity-80 text-sm">
              {isSubmitting ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" /> Processing your request...
                </span>
              ) : (
                "Complete all fields marked with an asterisk (*)"
              )}
            </p>
          </div>
          
          <div className="p-6">
            <CreateEventForm onSubmit={handleCreateEvent} isSubmitting={isSubmitting} />
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center text-sm text-[#5D0703]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>
            Need help? Check out the{' '}
            <span className="font-medium text-[#FC703C] hover:text-[#5D0703] cursor-pointer">
              event creation guidelines
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateEvent;