import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaList, FaClock, FaTrophy, FaImage, FaFileUpload } from 'react-icons/fa';

const EventForm = ({ onSubmit, isSubmitting, initialValues = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    firstPrice: '',
    secondPrice: '',
    thirdPrice: '',
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  // Set initial values if editing
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialValues,
        // Don't set image from initialValues, as it's a file input
        image: null
      }));
      
      // If there's an image URL from the server, show it as preview
      if (initialValues.image) {
        setImagePreview(initialValues.image);
      }
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (files[0]) {
        setFormData({ ...formData, [name]: files[0] });
        
        // Create preview URL for the selected image
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setImagePreview(fileReader.result);
        };
        fileReader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.firstPrice) newErrors.firstPrice = 'First prize is required';
    if (!formData.secondPrice) newErrors.secondPrice = 'Second prize is required';
    if (!formData.thirdPrice) newErrors.thirdPrice = 'Third prize is required';
    
    // Only require image for new events, not when editing
    if (!isEditing && !formData.image && !imagePreview) {
      newErrors.image = 'Event image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Event Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-[#FC703C]" />
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter event title"
              disabled={isSubmitting}
            />
          </div>
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBuilding className="text-[#FC703C]" />
            </div>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.department ? 'border-red-500' : ''}`}
              placeholder="Enter department name"
              disabled={isSubmitting}
            />
          </div>
          {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-[#FC703C]" />
            </div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.date ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaClock className="text-[#FC703C]" />
            </div>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.time ? 'border-red-500' : ''}`}
              placeholder="e.g. 10:00 AM - 2:00 PM"
              disabled={isSubmitting}
            />
          </div>
          {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-[#FC703C]" />
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.location ? 'border-red-500' : ''}`}
              placeholder="Enter event location"
              disabled={isSubmitting}
            />
          </div>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaList className="text-[#FC703C]" />
            </div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.category ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Competition">Competition</option>
            </select>
          </div>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* First Prize */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            1st Prize Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTrophy className="text-[#FC703C]" />
            </div>
            <input
              type="number"
              name="firstPrice"
              value={formData.firstPrice}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.firstPrice ? 'border-red-500' : ''}`}
              placeholder="Enter amount"
              disabled={isSubmitting}
            />
          </div>
          {errors.firstPrice && <p className="mt-1 text-sm text-red-600">{errors.firstPrice}</p>}
        </div>

        {/* Second Prize */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            2nd Prize Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTrophy className="text-[#FC703C]" />
            </div>
            <input
              type="number"
              name="secondPrice"
              value={formData.secondPrice}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.secondPrice ? 'border-red-500' : ''}`}
              placeholder="Enter amount"
              disabled={isSubmitting}
            />
          </div>
          {errors.secondPrice && <p className="mt-1 text-sm text-red-600">{errors.secondPrice}</p>}
        </div>

        {/* Third Prize */}
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            3rd Prize Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTrophy className="text-[#FC703C]" />
            </div>
            <input
              type="number"
              name="thirdPrice"
              value={formData.thirdPrice}
              onChange={handleChange}
              className={`pl-10 py-2 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.thirdPrice ? 'border-red-500' : ''}`}
              placeholder="Enter amount"
              disabled={isSubmitting}
            />
          </div>
          {errors.thirdPrice && <p className="mt-1 text-sm text-red-600">{errors.thirdPrice}</p>}
        </div>
      </div>

      {/* Description - Full Width */}
      <div>
        <label className="block text-sm font-medium text-[#5D0703] mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`mt-1 focus:ring-[#FC703C] focus:border-[#FC703C] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Enter event description"
          disabled={isSubmitting}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-[#5D0703] mb-1">
          Event Image {!isEditing && <span className="text-red-500">*</span>}
          {isEditing && <span className="text-sm font-normal text-gray-500 ml-2">(Leave blank to keep current image)</span>}
        </label>
        
        <div className="mt-1 flex items-center space-x-6">
          <div className="flex-shrink-0">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Event preview" 
                className="h-32 w-32 object-cover rounded-lg"
              />
            ) : (
              <div className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center">
                <FaImage className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label
              htmlFor="image-upload"
              className={`cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 
                bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC703C] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center">
                <FaFileUpload className="mr-2" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </span>
              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="sr-only"
                disabled={isSubmitting}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200">
        <motion.button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-white font-medium bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC703C] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span>{isEditing ? 'Update Event' : 'Create Event'}</span>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default EventForm;