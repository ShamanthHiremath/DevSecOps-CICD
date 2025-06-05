import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaUsers, FaChartBar, FaCalendarCheck, FaSignOutAlt, 
         FaEdit, FaTrash, FaExclamationTriangle, FaFilter, FaSearch, FaTimes, 
         FaSortAmountDown, FaSortAmountUp, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
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

  const handleViewDetails = (event, e) => {
    e.stopPropagation();
    // Navigate to event details page or open a modal
    navigate(`/admin/events/${event._id}/details`);
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
      await axios.delete(import.meta.env.VITE_SERVER_API_URL + `/api/events/${eventToDelete._id}`, {
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
        event.category.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      const today = new Date();
      
      if (filter === 'upcoming') {
        filteredEvents = filteredEvents.filter(event => new Date(event.date) >= today);
      } else if (filter === 'past') {
        filteredEvents = filteredEvents.filter(event => new Date(event.date) < today);
      }
    }

    // Apply department filter
    if (departmentFilter) {
      filteredEvents = filteredEvents.filter(event => 
        event.department.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Apply sorting
    filteredEvents.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'participants':
          aValue = a.participantCount || 0;
          bValue = b.participantCount || 0;
          break;
        case 'department':
          aValue = a.department.toLowerCase();
          bValue = b.department.toLowerCase();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filteredEvents;
  };

  // Get unique departments and categories for filter dropdowns
  const departments = [...new Set(events.map(event => event.department))].filter(Boolean);
  const categories = [...new Set(events.map(event => event.category))].filter(Boolean);

  // Clear all filters
  const clearAllFilters = () => {
    setFilter('all');
    setSearch('');
    setDepartmentFilter('');
    setCategoryFilter('');
    setSortBy('date');
    setSortOrder('desc');
  };

  // Check if any filters are active
  const hasActiveFilters = filter !== 'all' || search !== '' || departmentFilter !== '' || categoryFilter !== '';

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

        {/* Enhanced Filters and Search */}
        <motion.div 
          variants={headerVariants}
          className="bg-white rounded-lg shadow-md mb-8 overflow-hidden"
        >
          {/* Filter Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-[#FC703C] to-[#5D0703] text-white">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <FaFilter className="text-lg mr-3" />
                <h3 className="text-lg font-medium">Filter & Search Events</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-[#FC703C] bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {hasActiveFilters && (
                  <span className="ml-2 bg-white text-[#FC703C] rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                    {[filter !== 'all', search, departmentFilter, categoryFilter].filter(Boolean).length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Quick Search - Always Visible */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Quick search by title, department, category, or description..."
                className="block w-full pl-10 pr-12 py-3 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] bg-gray-50 focus:bg-white transition-colors"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-gray-600"
                >
                  Filter
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5D0703] mb-2">Event Status</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] bg-white text-[#5D0703]"
                  >
                    <option value="all">All Events</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past Events</option>
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5D0703] mb-2">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] bg-white text-[#5D0703]"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5D0703] mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] bg-white text-[#5D0703]"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-[#5D0703] mb-2">Sort By</label>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] bg-white text-[#5D0703]"
                    >
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                      <option value="participants">Participants</option>
                      <option value="department">Department</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] text-[#5D0703]"
                      title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                      {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearAllFilters}
                    className="w-full sm:w-auto px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium flex items-center justify-center"
                  >
                    <FaTimes className="mr-2" />
                    Clear All Filters
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Results Summary */}
          <div className="bg-white px-6 py-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-between text-sm">
              <div className="flex flex-wrap items-center space-x-4">
                <span className="text-[#5D0703]">
                  Showing <span className="font-semibold text-[#5D0703]">{filteredEvents.length}</span> of <span className="font-semibold text-[#5D0703]">{events.length}</span> events
                </span>
                
                {/* Active Filter Tags */}
                <div className="flex flex-wrap gap-2">
                  {filter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#f7a688] bg-opacity-20 text-[#9c2c03]">
                      {filter === 'upcoming' ? 'Upcoming' : 'Past Events'}
                      <button onClick={() => setFilter('all')} className="ml-1 hover:text-[#5D0703]">
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {departmentFilter && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Dept: {departmentFilter}
                      <button onClick={() => setDepartmentFilter('')} className="ml-1 hover:text-blue-600">
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {categoryFilter && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Cat: {categoryFilter}
                      <button onClick={() => setCategoryFilter('')} className="ml-1 hover:text-green-600">
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Search: "{search}"
                      <button onClick={() => setSearch('')} className="ml-1 hover:text-purple-600">
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[#FC703C] hover:text-[#5D0703] font-medium flex items-center mt-2 sm:mt-0"
                >
                  <FaTimes className="h-3 w-3 mr-1" />
                  Clear All
                </button>
              )}
            </div>
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
                className="bg-white rounded-lg shadow-lg overflow-hidden relative"
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
                  
                  <div className="flex justify-between items-center mb-4">
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

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleViewDetails(event, e)}
                      className="flex-1 bg-[#FC703C] hover:bg-[#5D0703] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewParticipants(event._id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#5D0703] px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <FaUsers className="mr-2" />
                      Participants
                    </motion.button>
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