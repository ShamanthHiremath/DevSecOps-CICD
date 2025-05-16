import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import EventCard from './EventCard';

const UpcomingEvents = ({ events, onRegister, onView }) => {
  // Filter events to get only upcoming ones (date is in the future)
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full"
    >
      <div className="border-b-2 border-[#FC703C] pb-2 mb-6">
        <h2 className="text-2xl font-bold text-[#5D0703] flex items-center">
          <FaCalendarAlt className="mr-2 text-[#FC703C]" />
          Upcoming Events
        </h2>
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EventCard
                event={event}
                onRegister={onRegister}
                onView={onView}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={fadeIn}
          className="text-center bg-white rounded-lg shadow-md p-8"
        >
          <FaCalendarAlt className="text-5xl text-[#FC703C] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-[#5D0703] mb-2">No upcoming events found</h3>
          <p className="text-gray-600">Check back later for new events or browse past events below.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UpcomingEvents;