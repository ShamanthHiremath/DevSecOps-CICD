import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
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