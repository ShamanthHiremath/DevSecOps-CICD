import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaEdit, FaArrowLeft, FaSpinner } from 'react-icons/fa'; // Changed FaCalendarEdit to FaEdit
import EventForm from '../../components/admin/EventForm';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(import.meta.env.VITE_SERVER_API_URL + `/api/events/${id}`);
        
        // Format date for input field (YYYY-MM-DD)
        const eventDate = new Date(response.data.date);
        const formattedDate = eventDate.toISOString().split('T')[0];
        
        // Prepare event data
        setEvent({
          ...response.data,
          date: formattedDate
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        navigate('/admin/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleUpdateEvent = async (formData) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData object for file upload
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] === null) {
          // Skip null image (when keeping the existing image)
          return;
        }
        data.append(key, formData[key]);
      });

      const response = await axios.put(import.meta.env.VITE_SERVER_API_URL + `/api/events/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      toast.success('Event updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F3E6] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <FaEdit className="text-[#FC703C] text-2xl mr-3" />
            <h2 className="text-3xl font-bold text-[#5D0703]">
              Edit Event
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
            Update the event details below. Make sure to provide all required information.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-[#FFA175] border-opacity-20"
          variants={formVariants}
        >
          <div className="bg-gradient-to-r from-[#FC703C] to-[#5D0703] px-6 py-4">
            <h3 className="text-xl font-semibold text-white">{event.title}</h3>
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
            <EventForm 
              onSubmit={handleUpdateEvent} 
              isSubmitting={isSubmitting} 
              initialValues={event}
              isEditing={true}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditEvent;