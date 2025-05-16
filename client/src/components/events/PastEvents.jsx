import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EventCard from './EventCard';

const PastEvents = ({ events, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter events to get only past ones (date is in the past)
  const pastEvents = events.filter(event => new Date(event.date) < new Date())
    // Sort by date in descending order (most recent first)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Show only 3 past events initially, show all when expanded
  const displayedEvents = isExpanded ? pastEvents : pastEvents.slice(0, 3);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (pastEvents.length === 0) return null;

  // Custom view handler that only shows details, never registration
  const handleViewPastEvent = (event) => {
    if (onView) onView(event);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full mt-16"
    >
      <div className="border-b-2 border-[#5D0703] pb-2 mb-6">
        <h2 className="text-2xl font-bold text-[#5D0703] flex items-center">
          <FaHistory className="mr-2 text-[#5D0703]" />
          Past Events
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedEvents.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <EventCard
              event={event}
              onView={handleViewPastEvent}
              isPast={true}
              // No onRegister prop passed here, so register button won't appear
            />
          </motion.div>
        ))}
      </div>

      {pastEvents.length > 3 && (
        <motion.div 
          className="text-center mt-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[#F4F3E6] border-2 border-[#5D0703] text-[#5D0703] px-6 py-3 rounded-full font-medium inline-flex items-center hover:bg-[#5D0703] hover:text-white transition-colors duration-300"
          >
            {isExpanded ? (
              <>Show Less <FaChevronUp className="ml-2" /></>
            ) : (
              <>View More Past Events ({pastEvents.length - 3} more) <FaChevronDown className="ml-2" /></>
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PastEvents;