import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaUserPlus, FaHistory } from 'react-icons/fa';

const EventCard = ({ event, onRegister, onView, isPast = false }) => {
  const isEventPast = isPast || new Date(event.date) < new Date();

  const handleCardClick = () => {
    // Only allow view action for past events, not registration
    if (isEventPast) {
      onView(event);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-48 object-cover"
          style={isEventPast ? { filter: 'grayscale(50%)' } : {}}
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <div className="flex justify-between">
            <span className={`text-white text-xs uppercase font-semibold px-3 py-1 rounded-full ${
              isEventPast ? 'bg-[#5D0703]' : 'bg-[#FC703C]'
            }`}>
              {event.category}
            </span>
            {isEventPast && (
              <span className="bg-[#5D0703] bg-opacity-80 text-white text-xs uppercase font-semibold px-3 py-1 rounded-full flex items-center">
                <FaHistory className="mr-1" /> Past
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-[#5D0703] truncate">{event.title}</h3>
        <div className="flex items-center mt-2 text-[#5D0703] text-sm">
          <FaCalendarAlt className="text-[#FC703C] mr-1" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center mt-2 text-[#5D0703] text-sm">
          <FaMapMarkerAlt className="text-[#FC703C] mr-1" />
          <span className="truncate">{event.location}</span>
        </div>
        <p className="text-[#5D0703] mt-3 text-sm line-clamp-2">
          {event.description}
        </p>
        
        <div className="mt-4 flex gap-2">
          {/* Only show view details button for past events */}
          {isEventPast ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(event)}
              className="w-full flex items-center justify-center bg-gray-100 text-[#5D0703] rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <FaInfoCircle className="mr-2" /> View Details
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onView(event)}
                className="flex-1 flex items-center justify-center bg-gray-100 text-[#5D0703] rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <FaInfoCircle className="mr-2" /> Details
              </motion.button>
              
              {onRegister && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegister(event);
                  }}
                  className="flex-1 flex items-center justify-center bg-[#FC703C] text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-[#5D0703] transition-colors"
                >
                  <FaUserPlus className="mr-2" /> Register
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;