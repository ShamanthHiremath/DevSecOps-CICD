import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa';

const EventCard = ({ event, onRegister, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={() => onView(event)}
    >
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <span className="bg-[#FC703C] text-white text-xs font-bold px-3 py-1 rounded-full">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#5D0703] mb-3 truncate">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className="text-[#FC703C] mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="text-[#FC703C] mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaUsers className="text-[#FC703C] mr-2" />
            <span>
              {event.participantCount || 0} / {event.capacity} registered
            </span>
          </div>
        </div>
        
        <div className="mt-auto flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={e => { e.stopPropagation(); onView(event); }}
            className="w-full bg-[#F4F3E6] text-[#5D0703] py-2 px-4 rounded-lg hover:bg-[#FFA175] hover:text-white transition-colors font-medium flex items-center justify-center"
          >
            View Details <FaArrowRight className="ml-1" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={e => { e.stopPropagation(); onRegister(event); }}
            className="w-full bg-[#FC703C] text-white py-2 px-4 rounded-lg hover:bg-[#5D0703] transition-colors font-medium"
          >
            Register Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;