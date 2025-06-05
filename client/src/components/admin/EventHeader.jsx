import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';

const EventHeader = ({ onNavigateBack, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={onNavigateBack}
        className="flex items-center text-[#FC703C] hover:text-[#5D0703] transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </button>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="px-4 py-2 bg-[#FC703C] text-white rounded-lg hover:bg-[#5D0703] transition-colors flex items-center"
        >
          <FaEdit className="mr-2" />
          Edit Event
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <FaTrash className="mr-2" />
          Delete Event
        </motion.button>
      </div>
    </div>
  );
};

export default EventHeader;