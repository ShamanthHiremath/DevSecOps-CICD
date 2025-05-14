import React from 'react';
import RegistrationForm from './RegistrationForm';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaUsers, FaInfoCircle } from 'react-icons/fa';

const EventComponent = ({ event }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Event Header */}
      <div className="bg-gradient-to-r from-[#FC703C] to-[#5D0703] p-6 text-white relative">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold mb-2"
        >
          {event.title}
        </motion.h2>
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 flex items-center justify-center">
          <FaInfoCircle className="text-7xl" />
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 bg-[#F4F3E6] p-4 rounded-lg"
        >
          <p className="text-[#5D0703] leading-relaxed">{event.description}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center">
            <div className="text-[#FC703C] mr-3">
              <FaCalendarAlt className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Date</p>
              <p className="font-semibold text-[#5D0703]">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-[#FC703C] mr-3">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Location</p>
              <p className="font-semibold text-[#5D0703]">{event.location}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-[#FC703C] mr-3">
              <FaTag className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Category</p>
              <p className="font-semibold text-[#5D0703]">{event.category}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-[#FC703C] mr-3">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Capacity</p>
              <p className="font-semibold text-[#5D0703]">{event.capacity} participants</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 border-t border-gray-200 pt-6"
        >
          <h3 className="text-xl font-bold text-[#5D0703] mb-4">Register for this Event</h3>
          <RegistrationForm eventId={event._id} capacity={event.capacity} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventComponent;