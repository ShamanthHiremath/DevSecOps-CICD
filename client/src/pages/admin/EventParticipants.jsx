import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUsers, FaUserTimes, FaDownload, FaSearch } from 'react-icons/fa';

const EventParticipants = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        // Fetch event details
        const eventResponse = await axios.get(import.meta.env.VITE_SERVER_API_URL + `/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        setEvent(eventResponse.data);
        
        // Try the proper admin endpoint for participants 
        try {
          const participantsResponse = await axios.get(import.meta.env.VITE_SERVER_API_URL + `/api/admin/events/${eventId}/participants`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
          });
          
          
          // Ensure participants is always an array and handle different response structures
          let participantsData = [];
          
          if (participantsResponse.data) {
            if (Array.isArray(participantsResponse.data)) {
              participantsData = participantsResponse.data;
            } else if (participantsResponse.data.participants && Array.isArray(participantsResponse.data.participants)) {
              participantsData = participantsResponse.data.participants;
            } else if (typeof participantsResponse.data === 'object') {
              // If it's an object with entries that are participants
              participantsData = Object.values(participantsResponse.data);
            }
          }
          
          setParticipants(participantsData);
        } catch (participantsError) {
          console.error("Error fetching participants:", participantsError);
          // If the admin endpoint fails, try a fallback or set empty array
          setParticipants([]);
          toast.error("Could not load participants data");
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Failed to load event details');
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate]);

  // Filter participants based on search term
  const filteredParticipants = Array.isArray(participants) 
    ? participants.filter(participant => {
        // Handle different possible data structures
        const userName = participant?.user?.name || participant?.name || '';
        const userEmail = participant?.user?.usn || participant?.usn || '';
        const userCollege = participant?.user?.year || participant?.year || '';
        const userDept = participant?.user?.branch || participant?.branch || '';
        
        return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
               userCollege.toLowerCase().includes(searchTerm.toLowerCase()) ||
               userDept.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  // Pagination logic
  const indexOfLastParticipant = currentPage * itemsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - itemsPerPage;
  const currentParticipants = filteredParticipants.slice(indexOfFirstParticipant, indexOfLastParticipant);
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  // Export participant data to CSV
  const exportToCSV = () => {
    if (!Array.isArray(participants) || participants.length === 0) {
      toast.info('No participants to export');
      return;
    }

    // Create CSV headers
    const headers = ['Name', 'USN', 'branch', 'Year', 'Semester', 'Registration Date'];
    
    // Format participant data
    const data = participants.map(p => [
      p.user?.name || 'N/A',
      p.user?.usn || 'N/A',
      p.user?.year || 'N/A',
      p.user?.branch || 'N/A',
      p.user?.semester || 'N/A',
      p.createdAt ? new Date(p.createdAt).toLocaleString() : 'N/A'
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set filename with event title and date
    const fileName = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_participants_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Participants data exported successfully');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F3E6] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#F4F3E6] py-10"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={headerVariants}
        >
          <div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 text-[#5D0703] hover:text-[#FC703C] transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-3xl font-bold text-[#5D0703]">{event.title}</h1>
            </div>
            <p className="text-[#FC703C] mt-1">
              {new Date(event.date).toLocaleDateString()} • {event.location}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-[#5D0703] hover:bg-[#FC703C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D0703] flex items-center"
              disabled={!Array.isArray(participants) || participants.length === 0}
            >
              <FaDownload className="mr-2" /> Export CSV
            </motion.button>
          </div>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex items-center">
              <FaUsers className="text-[#FC703C] text-lg mr-3" />
              <h3 className="text-lg font-medium text-[#5D0703]">Registered Participants</h3>
              <div className="ml-auto bg-[#FC703C] bg-opacity-20 text-[#5D0703] text-sm font-semibold py-1 px-3 rounded-full">
                {Array.isArray(participants) ? participants.length : 0} {(Array.isArray(participants) && participants.length === 1) ? 'Participant' : 'Participants'}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  placeholder="Search by name, email, college or branch..."
                  className="pl-10 py-2 block w-full shadow-sm border-gray-300 rounded-md focus:ring-[#FC703C] focus:border-[#FC703C]"
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Clear search</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Participants Table */}
            {filteredParticipants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        USN
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentParticipants.map((participant) => {
                      // Extract user data handling different possible structures
                      const userData = participant?.user || participant;
                      const userName = userData?.name || 'Unknown User';
                      const userSem = userData?.semster || 'N/A';
                      const userUsn = userData?.usn || 'N/A';
                      const userbranch = userData?.branch || 'N/A';
                      const userYear = userData?.year || 'N/A';
                      const registrationDate = participant?.createdAt || participant?.registrationDate || 'N/A';
                      
                      return (
                        <tr key={participant._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#FC703C] bg-opacity-20 flex items-center justify-center">
                                <span className="text-[#5D0703] font-semibold">
                                  {userName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {userName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{userUsn}</div>
                            {/* <div className="text-sm text-gray-500">{userPhone}</div> */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{userbranch}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{userYear}</div>
                            {/* <div className="text-sm text-gray-500">{userYear}</div> */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof registrationDate === 'string' 
                              ? registrationDate 
                              : new Date(registrationDate).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <FaUserTimes className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No participants found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm 
                    ? `No participants matching "${searchTerm}"` 
                    : 'No one has registered for this event yet.'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredParticipants.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstParticipant + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastParticipant, filteredParticipants.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredParticipants.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {[...Array(totalPages).keys()].map(number => (
                        <button
                          key={number + 1}
                          onClick={() => setCurrentPage(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === number + 1
                              ? 'z-10 bg-[#FC703C] border-[#FC703C] text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventParticipants;