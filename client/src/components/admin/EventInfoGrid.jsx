import React from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaGraduationCap,
  FaBuilding,
  FaTag,
  FaUsers
} from 'react-icons/fa';

const EventInfoGrid = ({ event, participants, formatDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="space-y-4">
        <div className="flex items-center">
          <FaCalendarAlt className="text-[#FC703C] mr-3 text-lg" />
          <div>
            <p className="font-medium text-[#5D0703]">Date</p>
            <p className="text-gray-600">{formatDate(event.date)}</p>
          </div>
        </div>

        <div className="flex items-center">
          <FaClock className="text-[#FC703C] mr-3 text-lg" />
          <div>
            <p className="font-medium text-[#5D0703]">Time</p>
            <p className="text-gray-600">{event.time}</p>
          </div>
        </div>

        <div className="flex items-center">
          <FaMapMarkerAlt className="text-[#FC703C] mr-3 text-lg" />
          <div>
            <p className="font-medium text-[#5D0703]">Location</p>
            <p className="text-gray-600">{event.location}</p>
          </div>
        </div>

        <div className="flex items-center">
          <FaGraduationCap className="text-[#FC703C] mr-3 text-lg" />
          <div>
            <p className="font-medium text-[#5D0703]">Eligibility</p>
            <p className="text-gray-600">
              {event.eligibility && event.eligibility.length > 0 
                ? `Year ${event.eligibility.join(', ')}` 
                : 'All years eligible'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <FaBuilding className="text-[#FC703C] mr-3 text-lg" />
          <div>
            <p className="font-medium text-[#5D0703]">Department</p>
            <p className="text-gray-600">{event.department}</p>
          </div>
        </div>

        <div className="flex items-center">
          <FaTag className="text-[#FC703C] mr-3 text-lg" />
          <div>
            <p className="font-medium text-[#5D0703]">Category</p>
            <p className="text-gray-600">{event.category}</p>
          </div>
        </div>

        <div className="flex items-center">
          <FaUsers className="text-[#FC703C] mr-3 text-lg" />
          <div>
            <p className="font-medium text-[#5D0703]">Participants</p>
            <p className="text-gray-600">{participants.length} registered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoGrid;