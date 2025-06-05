import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCheck, FaUsers } from 'react-icons/fa';

const EventParticipantsSection = ({ 
  participants, 
  loadingParticipants, 
  onViewParticipants 
}) => {
  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#5D0703]">
          Participants ({participants.length})
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewParticipants}
          className="px-4 py-2 bg-[#FC703C] text-white rounded-lg hover:bg-[#5D0703] transition-colors flex items-center"
        >
          <FaUserCheck className="mr-2" />
          View All Participants
        </motion.button>
      </div>

      {loadingParticipants ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
        </div>
      ) : participants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.slice(0, 6).map((participant) => (
            <div key={participant._id} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-[#5D0703]">{participant.name}</h4>
              <p className="text-sm text-gray-600">USN: {participant.usn}</p>
              <p className="text-sm text-gray-500">Year {participant.year} • {participant.branch}</p>
              <p className="text-xs text-gray-400">
                Registered: {new Date(participant.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {participants.length > 6 && (
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <p className="text-gray-600">
                +{participants.length - 6} more participants
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No participants registered yet</p>
        </div>
      )}
    </div>
  );
};

export default EventParticipantsSection;