import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaArrowRight, FaUsers, FaTrophy, FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';
import AnimatedCounter from '../components/AnimatedCounter';

const Home = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalPrizePool: 0
  });
  const [loading, setLoading] = useState(true);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_API_URL + '/api/events/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#F4F3E6] flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-white bg-gradient-to-r from-[#FC703C] to-[#5D0703]">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div 
          className="relative z-10 text-center px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to Our College Events</h1>
          <p className="text-xl mb-8">Discover, Participate, and Excel in Various Events</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FFA175] hover:bg-[#FC703C] text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center mx-auto"
            onClick={() => navigate('/events')}
          >
            Explore Now <FaArrowRight className="ml-2" />
          </motion.button>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#5D0703] mb-4">Our Achievements</h2>
            <p className="text-lg text-gray-600">Join thousands of students in our exciting events</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Events */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-[#FC703C] to-[#FFA175] rounded-xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-20 h-20 bg-[#5D0703] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <FaCalendarAlt className="text-4xl text-[#FFA175] drop-shadow-lg" />
              </motion.div>
              <div className="text-4xl font-bold mb-2">
                {!loading ? (
                  <AnimatedCounter 
                    end={metrics.totalEvents || 0} 
                    duration={2.5}
                  />
                ) : (
                  <div className="animate-pulse">
                    <div className="h-10 bg-white bg-opacity-20 rounded w-16 mx-auto"></div>
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold opacity-90">Total Events</p>
              <p className="text-sm opacity-70 mt-1">Organized Events</p>
            </motion.div>

            {/* Total Participants */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-[#5D0703] to-[#8B0A05] rounded-xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-20 h-20 bg-[#FFA175] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <FaUsers className="text-4xl text-[#5D0703] drop-shadow-lg" />
              </motion.div>
              <div className="text-4xl font-bold mb-2">
                {!loading ? (
                  <AnimatedCounter 
                    end={metrics.totalParticipants || 0} 
                    duration={2.5}
                  />
                ) : (
                  <div className="animate-pulse">
                    <div className="h-10 bg-white bg-opacity-20 rounded w-16 mx-auto"></div>
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold opacity-90">Total Participants</p>
              <p className="text-sm opacity-70 mt-1">Registered Students</p>
            </motion.div>

            {/* Total Prize Pool */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-[#FFA175] to-[#FC703C] rounded-xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-20 h-20 bg-[#5D0703] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <FaTrophy className="text-4xl text-[#FFA175] drop-shadow-lg" />
              </motion.div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <FaRupeeSign className="text-3xl mr-1" />
                {!loading ? (
                  <AnimatedCounter 
                    end={metrics.totalPrizePool || 0} 
                    duration={3}
                  />
                ) : (
                  <div className="animate-pulse">
                    <div className="h-10 bg-white bg-opacity-20 rounded w-20 ml-1"></div>
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold opacity-90">Total Prize Pool</p>
              <p className="text-sm opacity-70 mt-1">Rewards & Prizes</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* College Info Section */}
      <section className="py-16 px-4 bg-[#F4F3E6]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="text-4xl text-[#5D0703] bg-[#FFA175] p-5 rounded-full">
                <FaGraduationCap />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#5D0703] mb-6">About Our College</h2>
            <p className="text-lg text-[#5D0703]">
              Our college is a premier institution dedicated to academic excellence and holistic development.
              We provide a platform for students to showcase their talents through various events and activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Check Out Events Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#FC703C] rounded-xl shadow-xl p-8 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10 text-9xl">
              <FaCalendarAlt />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <h2 className="text-3xl font-bold mb-4">Check Out Events</h2>
              <p className="text-lg mb-6">
                Explore all upcoming and ongoing events. Register and be a part of the excitement!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/events')}
                className="bg-[#F4F3E6] text-[#5D0703] font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors text-lg flex items-center"
              >
                View Events <FaArrowRight className="ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-[#F4F3E6]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#5D0703] text-center mb-12">Why Join Our Events?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Network with Peers', 'Enhance Your Skills', 'Win Exciting Prizes'].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-[#FFA175] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-[#5D0703] text-center mb-2">{feature}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;