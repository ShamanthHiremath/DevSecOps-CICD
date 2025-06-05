import React from 'react';
import { FaImage } from 'react-icons/fa';

const EventImageSection = ({ event, imageError, isEventPast, onImageError }) => {
  return (
    <div className="relative h-64 md:h-80 overflow-hidden">
      {!imageError && event.image ? (
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full z-8"
          style={isEventPast ? { filter: 'grayscale(50%)' } : {}}
          onError={onImageError}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#FC703C] to-[#5D0703] flex items-center justify-center">
          <div className="text-center text-white">
            <FaImage className="text-6xl mb-4 mx-auto opacity-50" />
            <p className="text-xl font-semibold">{event.title}</p>
          </div>
        </div>
      )}
      
      {/* Lighter overlay only when image exists */}
      {!imageError && event.image && (
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      )}
      
      {/* Status badge with higher z-index */}
      <div className="absolute bottom-4 left-4 z-10">
        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${
          isEventPast 
            ? 'bg-gray-600 text-white' 
            : 'bg-green-600 text-white'
        }`}>
          {isEventPast ? 'Past Event' : 'Upcoming Event'}
        </span>
      </div>
    </div>
  );
};

export default EventImageSection;