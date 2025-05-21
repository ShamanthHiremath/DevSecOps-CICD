import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard, FaGraduationCap, FaCalendarAlt, FaCode, FaArrowRight } from 'react-icons/fa';

const RegistrationForm = ({ eventId, capacity }) => {
  const [formData, setFormData] = useState({
    usn: '',
    name: '',
    year: '',
    semester: '',
    branch: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // USN validation (format: 1MS20CS001)
    // if (!formData.usn.match(/^1MS\d{2}[A-Z]{2}\d{3}$/)) {
    //   newErrors.usn = 'Please enter a valid USN (e.g., 1MS20CS001)';
    // }

    // Year validation (1-4)
    if (formData.year < 1 || formData.year > 4) {
      newErrors.year = 'Year must be between 1 and 4';
    }

    // Semester validation (1-8)
    if (formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = 'Semester must be between 1 and 8';
    }

    // Branch validation
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_API_URL + '/api/admin/register-event', {
        eventId,
        usn: formData.usn.toUpperCase(),
        name: formData.name,
        year: formData.year,
        semester: formData.semester,
        branch: formData.branch
      });

      if (response.data) {
        toast.success('Successfully registered for the event!');
        setFormData({
          usn: '',
          name: '',
          year: '',
          semester: '',
          branch: ''
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Error registering for event');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.3 } },
    tap: { scale: 0.98 }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={formItemVariants}
      >
        <label className="block text-sm font-medium text-[#5D0703] mb-1">
          Full Name <span className="text-[#FC703C]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="text-[#FC703C]" />
          </div>
          <motion.input
            whileFocus="focus"
            whileTap="tap"
            variants={inputVariants}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
      </motion.div>

      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={formItemVariants}
      >
        <label className="block text-sm font-medium text-[#5D0703] mb-1">
          USN <span className="text-[#FC703C]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaIdCard className="text-[#FC703C]" />
          </div>
          <motion.input
            whileFocus="focus"
            whileTap="tap"
            variants={inputVariants}
            type="text"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            placeholder="1MS20CS001"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] ${
              errors.usn ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.usn && (
            <p className="mt-1 text-sm text-red-600">{errors.usn}</p>
          )}
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 gap-4"
        custom={2}
        initial="hidden"
        animate="visible"
        variants={formItemVariants}
      >
        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Year <span className="text-[#FC703C]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaGraduationCap className="text-[#FC703C]" />
            </div>
            <motion.select
              whileFocus="focus"
              whileTap="tap"
              variants={inputVariants}
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] appearance-none bg-white ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Year</option>
              {[1, 2, 3, 4].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </motion.select>
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5D0703] mb-1">
            Semester <span className="text-[#FC703C]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-[#FC703C]" />
            </div>
            <motion.select
              whileFocus="focus"
              whileTap="tap"
              variants={inputVariants}
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] appearance-none bg-white ${
                errors.semester ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </motion.select>
            {errors.semester && (
              <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={formItemVariants}
      >
        <label className="block text-sm font-medium text-[#5D0703] mb-1">
          Branch <span className="text-[#FC703C]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaCode className="text-[#FC703C]" />
          </div>
          <motion.select
            whileFocus="focus"
            whileTap="tap"
            variants={inputVariants}
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC703C] focus:border-[#FC703C] appearance-none bg-white ${
              errors.branch ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science & Engineering</option>
            <option value="ISE">Information Science & Engineering</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CV">Civil Engineering</option>
          </motion.select>
          {errors.branch && (
            <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
          )}
        </div>
      </motion.div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        custom={4}
        initial="hidden"
        animate="visible"
        variants={formItemVariants}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
          isSubmitting
            ? 'bg-[#FFA175] cursor-not-allowed'
            : 'bg-[#FC703C] hover:bg-[#5D0703]'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            Register Now <FaArrowRight className="ml-2" />
          </div>
        )}
      </motion.button>
    </motion.form>
  );
};

export default RegistrationForm;