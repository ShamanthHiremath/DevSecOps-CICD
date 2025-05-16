import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSearch, FaTimesCircle, FaCalendarAlt, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';
import EventCard from '../components/events/EventCard';
import UpcomingEvents from '../components/events/UpcomingEvents';
import PastEvents from '../components/events/PastEvents';
import RegistrationModal from '../components/events/RegistrationModal';

const EventDetailModal = ({ event, isOpen, onClose, onRegister }) => {
  if (!isOpen || !event) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#5D0703] hover:text-[#FC703C] transition-colors"
        >
          <FaTimesCircle className="w-6 h-6" />
        </button>
        <img src={event.image} alt={event.title} className="w-full h-56 object-cover rounded-lg mb-4 shadow-md" />
        <h2 className="text-2xl font-bold text-[#5D0703] mb-2">{event.title}</h2>
        <p className="text-gray-700 mb-2"><span className="font-medium">Department:</span> {event.department}</p>
        
        <div className="flex items-center text-gray-700 mb-2">
          <FaCalendarAlt className="mr-2 text-[#FC703C]" />
          <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()} 
          <span className="ml-2 font-medium">Time:</span> {event.time}
        </div>
        
        <div className="flex items-center text-gray-700 mb-2">
          <FaMapMarkerAlt className="mr-2 text-[#FC703C]" />
          <span className="font-medium">Venue:</span> {event.location}
        </div>
        
        <p className="text-gray-700 mb-2"><span className="font-medium">Category:</span> {event.category}</p>
        <p className="text-gray-700 mb-4"><span className="font-medium">Description:</span> {event.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="bg-[#FFA175] bg-opacity-20 rounded-lg px-4 py-2 text-[#5D0703] font-semibold text-sm flex items-center">
            <FaTrophy className="mr-2 text-[#FC703C]" />1st Prize: ₹{event.firstPrice}
          </div>
          <div className="bg-[#FFA175] bg-opacity-20 rounded-lg px-4 py-2 text-[#5D0703] font-semibold text-sm flex items-center">
            <FaTrophy className="mr-2 text-[#FC703C]" />2nd Prize: ₹{event.secondPrice}
          </div>
          <div className="bg-[#FFA175] bg-opacity-20 rounded-lg px-4 py-2 text-[#5D0703] font-semibold text-sm flex items-center">
            <FaTrophy className="mr-2 text-[#FC703C]" />3rd Prize: ₹{event.thirdPrice}
          </div>
        </div>
        
        {new Date(event.date) >= new Date() && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onRegister(event)}
            className="w-full bg-[#FC703C] text-white py-3 px-4 rounded-lg hover:bg-[#5D0703] transition-colors font-medium shadow-md"
          >
            Register
          </motion.button>
        )}

        {new Date(event.date) < new Date() && (
          <div className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium shadow-md text-center">
            Event Has Ended
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F3E6]">
        <div className="w-16 h-16 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3E6]">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white bg-gradient-to-r from-[#FC703C] to-[#5D0703]">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div 
          className="relative z-10 text-center px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl font-bold mb-4">College Events</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover and register for upcoming events at our college. From technical symposiums to cultural fests, there's something for everyone.
          </p>
        </motion.div>
      </section>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-8 -mt-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-lg mx-auto max-w-2xl flex items-center"
        >
          <FaSearch className="text-[#FC703C] mr-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events by title..."
            className="w-full px-3 py-2 outline-none text-[#5D0703]"
          />
        </motion.div>
      </div>

      {/* Events Sections */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {search ? (
          // When searching, show all filtered events together
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-[#5D0703] mb-6">Search Results</h2>
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EventCard
                      event={event}
                      onRegister={handleRegister}
                      onView={handleView}
                      isPast={new Date(event.date) < new Date()}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[#5D0703] py-12 text-xl font-semibold bg-white rounded-lg shadow-md">
                <FaCalendarAlt className="text-5xl text-[#FC703C] mx-auto mb-4" />
                No events found with the current search criteria
              </div>
            )}
          </motion.div>
        ) : (
          // When not searching, show upcoming and past events separately
          <>
            <UpcomingEvents 
              events={events} 
              onRegister={handleRegister} 
              onView={handleView} 
            />
            
            <PastEvents 
              events={events} 
              onView={handleView} 
            />
          </>
        )}
      </section>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onRegister={handleRegister}
      />

      {/* Registration Modal */}
      {selectedEvent && isModalOpen && (
        <RegistrationModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Events;