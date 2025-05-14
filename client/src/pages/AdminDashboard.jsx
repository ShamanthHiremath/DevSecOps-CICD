import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUserGraduate, FaUsers, 
         FaPlus, FaSignOutAlt, FaArrowLeft, FaFilter, FaSortAlphaDown, 
         FaSortAlphaUp, FaUniversity } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [filterYear, setFilterYear] = useState('');
  const [sortDept, setSortDept] = useState('asc');
  const [search, setSearch] = useState('');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('adminAuth');
    // if (!isAuthenticated) {
    //   navigate('/admin/login');
    //   return;
    // }
    
    // Fetch events from backend
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (error) {
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, [navigate]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setLoading(true);
    // Fetch participants from backend
    axios.get(`http://localhost:5000/api/admin/event-participants/${event._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(res => {
        setParticipants(res.data.participants || []);
      })
      .catch(() => {
        setParticipants([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setParticipants([]);
    setFilterYear('');
    setSortDept('asc');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Filtered events for search
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-[#F4F3E6]"
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto pt-24 pb-6 sm:px-6 lg:px-8">
        {!selectedEvent ? (
          eventsLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="w-16 h-16 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <motion.div 
                className="max-w-5xl mx-auto px-4 pt-4 pb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#5D0703]">Event Management</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/admin/events/create')}
                    className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-[#FC703C] hover:bg-[#5D0703] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC703C] flex items-center"
                  >
                    <FaPlus className="mr-2" /> Create New Event
                  </motion.button>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                  <FaSearch className="text-[#FC703C] mr-3 text-xl" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search events by title..."
                    className="w-full px-4 py-2 outline-none text-[#5D0703] bg-transparent"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      variants={fadeIn}
                      whileHover={{ y: -10 }}
                      onClick={() => handleEventClick(event)}
                      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative">
                        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
                        <div className="absolute bottom-0 left-0 w-full p-4">
                          <span className="bg-[#FC703C] text-white text-xs font-bold px-3 py-1 rounded-full">
                            {event.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#5D0703] mb-3 truncate">{event.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2">
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
                              <strong>Registered:</strong> {event.participantCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={fadeIn}
                    className="col-span-full text-center py-16"
                  >
                    <div className="text-6xl text-[#FC703C] opacity-20 mx-auto mb-4">
                      <FaCalendarAlt />
                    </div>
                    <h3 className="text-2xl font-bold text-[#5D0703]">No events found</h3>
                    <p className="text-[#5D0703] opacity-70">Try adjusting your search criteria</p>
                  </motion.div>
                )}
              </motion.div>
            </>
          )
        ) : (
          // Participants Table
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            {/* Back button and event information */}
            <div className="flex justify-between items-center mb-6 mt-2 px-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToEvents}
                className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-[#5D0703] hover:bg-[#FC703C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D0703] flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Events
              </motion.button>
            </div>

            <div className="bg-gradient-to-r from-[#FC703C] to-[#5D0703] px-6 py-4 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <FaUsers className="mr-2" /> Registered Participants
              </h3>
              <p className="mt-1 text-sm opacity-90">
                Event: {selectedEvent.title} | Total Registrations: {participants.length}
              </p>
            </div>
            
            {/* Filter and Sort Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4 items-center p-4 bg-[#F4F3E6] border-b border-[#FFA175] border-opacity-20"
            >
              <div className="flex items-center">
                <FaFilter className="text-[#FC703C] mr-2" />
                <label className="mr-2 font-medium text-[#5D0703]">Filter by Year:</label>
                <select
                  value={filterYear}
                  onChange={e => setFilterYear(e.target.value)}
                  className="border border-[#FFA175] rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FC703C]"
                >
                  <option value="">All Years</option>
                  {[1,2,3,4].map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <FaUniversity className="text-[#FC703C] mr-2" />
                <label className="mr-2 font-medium text-[#5D0703]">Sort by Department:</label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortDept(sortDept === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center border border-[#FFA175] rounded-md px-3 py-1.5 bg-white hover:bg-[#FFA175] hover:text-white transition-colors duration-200"
                >
                  {sortDept === 'asc' ? (
                    <><FaSortAlphaDown className="mr-1" /> A → Z</>
                  ) : (
                    <><FaSortAlphaUp className="mr-1" /> Z → A</>
                  )}
                </motion.button>
              </div>
            </motion.div>
            
            <div className="border-t border-gray-200">
              {loading ? (
                <div className="px-4 py-12 text-center">
                  <div className="w-16 h-16 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin mx-auto"></div>
                </div>
              ) : participants.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <div className="text-6xl text-[#FC703C] opacity-20 mx-auto mb-4">
                    <FaUserGraduate />
                  </div>
                  <h3 className="text-xl font-bold text-[#5D0703]">No participants yet</h3>
                  <p className="text-[#5D0703] opacity-70">There are no registrations for this event</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#F4F3E6]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#5D0703] uppercase tracking-wider">
                          USN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#5D0703] uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#5D0703] uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#5D0703] uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#5D0703] uppercase tracking-wider">
                          Branch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#5D0703] uppercase tracking-wider">
                          Registration Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants
                        .filter(p => !filterYear || p.year === String(filterYear))
                        .sort((a, b) => {
                          if (!a.branch || !b.branch) return 0;
                          if (sortDept === 'asc') return a.branch.localeCompare(b.branch);
                          return b.branch.localeCompare(a.branch);
                        })
                        .map((participant, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-[#F4F3E6] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#5D0703]">
                            {participant.usn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {participant.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {participant.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {participant.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {participant.branch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(participant.createdAt).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;