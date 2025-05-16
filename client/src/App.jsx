import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Events from './pages/Events';
// import EventDetails from './pages/EventDetails';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import EventParticipants from './pages/admin/EventParticipants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
// import NotFound from './pages/NotFound';

// Create simple Layout component directly in this file
const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen pt-16 flex flex-col">
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        
        {/* Admin Routes without Layout (they have their own styling) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        
        {/* Protected Admin Routes with Layout */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/events/create" element={
          <ProtectedRoute>
            <Layout>
              <CreateEvent />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/events/edit/:id" element={
          <ProtectedRoute>
            <Layout>
              <EditEvent />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/events/:eventId/participants" element={
          <ProtectedRoute>
            <Layout>
              <EventParticipants />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* 404 Page */}
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
