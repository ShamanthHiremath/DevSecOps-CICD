import React from 'react';
import RegistrationForm from './RegistrationForm';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const RegistrationModal = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div 
            className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-gradient-to-r from-[#FC703C] to-[#5D0703] p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Register for Event</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-white hover:text-[#FFA175] transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-5">
              {/* Event Summary */}
              <div className="mb-6 bg-[#F4F3E6] rounded-lg p-4">
                <h4 className="font-bold text-lg text-[#5D0703] mb-2">{event.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-[#5D0703]">
                    <FaCalendarAlt className="mr-2 text-[#FC703C]" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-[#5D0703]">
                    <FaMapMarkerAlt className="mr-2 text-[#FC703C]" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
              
              <h4 className="font-semibold text-[#5D0703] mb-4">Please complete the registration form</h4>
              <RegistrationForm eventId={event._id} capacity={event.capacity} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;