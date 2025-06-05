import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSearch, FaTimesCircle, FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaUserGraduate, FaFilter, FaTimes } from 'react-icons/fa';
import EventCard from '../components/events/EventCard';
import UpcomingEvents from '../components/events/UpcomingEvents';
import PastEvents from '../components/events/PastEvents';
import RegistrationModal from '../components/events/RegistrationModal';

const EventDetailModal = ({ event, isOpen, onClose, onRegister }) => {
  if (!isOpen || !event) return null;
  
  // Add ESC key functionality
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
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
        
        <p className="text-gray-700 mb-4"><span className="font-medium">Category:</span> {event.category}</p>
        
        {/* Eligibility Section */}
        {event.eligibility && event.eligibility.length > 0 && (
          <div className="flex items-center text-gray-700 mb-2">
            <FaUserGraduate className="mr-2 text-[#FC703C]" />
            <span className="font-medium">Eligibility:</span> 
            <span className="ml-1">
              Year {event.eligibility.sort().join(', ')} students
            </span>
          </div>
        )}
        
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
  
  // Enhanced search and filter states
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_API_URL + '/api/events');
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

  // Enhanced filtering logic
  const filteredEvents = events.filter(event => {
    // Search by title, description, or department
    const searchMatch = search === '' || 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.department.toLowerCase().includes(search.toLowerCase());

    // Filter by eligible year
    const yearMatch = selectedYear === '' || 
      (event.eligibility && event.eligibility.includes(selectedYear));

    // Filter by category
    const categoryMatch = selectedCategory === '' || 
      event.category === selectedCategory;

    return searchMatch && yearMatch && categoryMatch;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(events.map(event => event.category))].filter(Boolean);

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSelectedYear('');
    setSelectedCategory('');
  };

  // Check if any filters are active
  const hasActiveFilters = search !== '' || selectedYear !== '' || selectedCategory !== '';

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

      {/* Enhanced Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8 -mt-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg mx-auto max-w-4xl"
        >
          {/* Main Search Bar */}
          <div className="p-4 flex items-center gap-4">
            <div className="flex-1 flex items-center">
              <FaSearch className="text-[#FC703C] mr-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events by title, description, or department..."
                className="w-full px-3 py-2 outline-none text-[#5D0703]"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-[#FC703C] text-white'
                  : 'bg-gray-100 text-[#5D0703] hover:bg-gray-200'
              }`}
            >
              <FaFilter />
              Filters
              {hasActiveFilters && (
                <span className="bg-white text-[#FC703C] rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                  {[search, selectedYear, selectedCategory].filter(Boolean).length}
                </span>
              )}
            </motion.button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5D0703] mb-2">
                    <FaUserGraduate className="inline mr-2" />
                    Eligible Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] text-[#5D0703]"
                  >
                    <option value="">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5D0703] mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] text-[#5D0703]"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-[#5D0703] rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <FaTimes />
                      Clear Filters
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-[#5D0703] mb-2 font-medium">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FC703C] text-white rounded-full text-sm">
                        Search: "{search}"
                        <button
                          onClick={() => setSearch('')}
                          className="hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedYear && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FC703C] text-white rounded-full text-sm">
                        Year: {selectedYear}
                        <button
                          onClick={() => setSelectedYear('')}
                          className="hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FC703C] text-white rounded-full text-sm">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory('')}
                          className="hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Events Sections */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {hasActiveFilters ? (
          // When filtering, show all filtered events together
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#5D0703]">
                {filteredEvents.length > 0 
                  ? `Found ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`
                  : 'No events found'
                }
              </h2>
            </div>
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
                No events found with the current filter criteria
                <div className="mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-6 py-2 bg-[#FC703C] text-white rounded-lg hover:bg-[#5D0703] transition-colors"
                  >
                    Clear All Filters
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // When not filtering, show upcoming and past events separately
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