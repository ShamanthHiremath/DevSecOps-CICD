import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaUsers, FaChartBar, FaCalendarCheck, FaSignOutAlt, 
         FaEdit, FaTrash, FaExclamationTriangle, FaFilter, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.VITE_SERVER_API_URL + '/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    navigate('/admin/events/create');
  };

  const handleViewParticipants = (eventId) => {
    navigate(`/admin/events/${eventId}/participants`);
  };

  const handleEditEvent = (event, e) => {
    e.stopPropagation();
    navigate(`/admin/events/edit/${event._id}`);
  };

  const handleDeletePrompt = (event, e) => {
    e.stopPropagation();
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      toast.success('Event deleted successfully');
      
      // Update the events list without reloading the page
      setEvents(events.filter(event => event._id !== eventToDelete._id));
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const filterEvents = () => {
    let filteredEvents = [...events];
    
    // Apply search filter
    if (search) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.department.toLowerCase().includes(search.toLowerCase()) ||
        event.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filter !== 'all') {
      const today = new Date();
      
      if (filter === 'upcoming') {
        filteredEvents = filteredEvents.filter(event => new Date(event.date) >= today);
      } else if (filter === 'past') {
        filteredEvents = filteredEvents.filter(event => new Date(event.date) < today);
      }
    }
    
    return filteredEvents;
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

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const filteredEvents = filterEvents();

  return (
    <motion.div 
      className="min-h-screen bg-[#F4F3E6]"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Dashboard Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          variants={headerVariants}
        >
          <div>
            <h1 className="text-3xl font-bold text-[#5D0703] mb-2">Admin Dashboard</h1>
            <p className="text-[#FC703C]">Manage college events and participants</p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateEvent}
              className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-[#FC703C] hover:bg-[#5D0703] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC703C] flex items-center"
            >
              <FaCalendarPlus className="mr-2" /> Create Event
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-[#5D0703] bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D0703] flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          variants={headerVariants}
          className="bg-white rounded-lg shadow-md mb-8 overflow-hidden"
        >
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex items-center">
              <FaFilter className="text-[#FC703C] text-lg mr-3" />
              <h3 className="text-lg font-medium text-[#5D0703]">Filter & Search Events</h3>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filter dropdown */}
            <div>
              <label htmlFor="filter-select" className="block text-sm font-medium text-[#5D0703] mb-2">
                Show Events
              </label>
              <div className="relative">
                <select
                  id="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FC703C] focus:border-[#FC703C] sm:text-sm rounded-md"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming Events</option>
                  <option value="past">Past Events</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Search input */}
            <div className="md:col-span-2">
              <label htmlFor="search-input" className="block text-sm font-medium text-[#5D0703] mb-2">
                Search Events
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  id="search-input"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, department, or category..."
                  className="block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-[#FC703C] focus:border-[#FC703C]"
                />
                {search && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      onClick={() => setSearch('')}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Clear search</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Filter summary & stats */}
          <div className="bg-gray-50 px-6 py-3 flex flex-wrap items-center justify-between text-sm">
            <div className="flex flex-wrap items-center text-[#5D0703]">
              <span>Showing: </span>
              <span className="ml-1 font-medium">
                {filteredEvents.length} of {events.length} events
              </span>
              
              {filter !== 'all' && (
                <span className="ml-2 my-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FC703C] bg-opacity-20 text-[#FC703C]">
                  {filter === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                </span>
              )}
              
              {search && (
                <span className="ml-2 my-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#5D0703] bg-opacity-20 text-[#5D0703]">
                  Search: "{search}"
                </span>
              )}
            </div>
            
            {(filter !== 'all' || search) && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearch('');
                }}
                className="mt-2 sm:mt-0 text-[#FC703C] hover:text-[#5D0703] font-medium flex items-center"
              >
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer relative"
                onClick={() => handleViewParticipants(event._id)}
              >
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-48 object-cover"
                    style={new Date(event.date) < new Date() ? { filter: 'grayscale(75%)' } : {}}
                  />
                  <div className="absolute inset-0 bg-black opacity-20"></div>
                  <div className="absolute top-2 left-2 bg-white bg-opacity-80 rounded-lg px-3 py-1 text-sm font-medium text-[#5D0703]">
                    {new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}
                  </div>
                  
                  {/* Edit and Delete buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleEditEvent(event, e)}
                      className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-sm text-[#5D0703]"
                    >
                      <FaEdit className="text-sm" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDeletePrompt(event, e)}
                      className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-sm text-red-600"
                    >
                      <FaTrash className="text-sm" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#5D0703] truncate">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {event.department} • {event.category}
                  </p>
                  <p className="text-gray-700 text-sm mb-3">
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaUsers className="text-[#FC703C] mr-1" />
                      <span className="text-sm font-medium">
                        {event.participantCount || 0} Participants
                      </span>
                    </div>
                    <div className="flex items-center text-[#5D0703]">
                      <FaCalendarCheck className="mr-1" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500 mb-4">
              {search ? `No events matching "${search}"` : 'There are no events to display.'}
            </p>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-[#FC703C] hover:bg-[#5D0703] focus:outline-none inline-flex items-center"
            >
              <FaCalendarPlus className="mr-2" /> Create New Event
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
          >
            <div className="flex items-center justify-center text-red-600 mb-4">
              <FaExclamationTriangle className="text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete the event <strong>"{eventToDelete?.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteEvent}
                className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;