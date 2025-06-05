import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Import the new components
import EventHeader from '../../components/admin/EventHeader';
import EventImageSection from '../../components/admin/EventImageSection';
import EventInfoGrid from '../../components/admin/EventInfoGrid';
import EventParticipantsSection from '../../components/admin/EventParticipantsSection';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchParticipants();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      setLoadingParticipants(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/admin/events/${id}/participants`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      setParticipants(response.data.participants || response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/events/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      toast.success('Event deleted successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleViewParticipants = () => {
    navigate(`/admin/events/${id}/participants`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleNavigateBack = () => {
    navigate('/admin/dashboard');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventPast = event && new Date(event.date) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F3E6] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F4F3E6] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#5D0703] mb-4">Event Not Found</h2>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-[#FC703C] text-white rounded-lg hover:bg-[#5D0703] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#F4F3E6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Component */}
        <EventHeader 
          onNavigateBack={handleNavigateBack}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image Component */}
          <EventImageSection 
            event={event}
            imageError={imageError}
            isEventPast={isEventPast}
            onImageError={handleImageError}
          />

          {/* Event Details */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#5D0703] mb-4">{event.title}</h1>
            
            {/* Event Info Grid Component */}
            <EventInfoGrid 
              event={event}
              participants={participants}
              formatDate={formatDate}
            />

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#5D0703] mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Participants Section Component */}
            <EventParticipantsSection 
              participants={participants}
              loadingParticipants={loadingParticipants}
              onViewParticipants={handleViewParticipants}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails;