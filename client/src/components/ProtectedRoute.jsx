import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Optional: Verify token with the backend
        // const response = await axios.get('http://localhost:5000/api/admin/verify-token', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // If you don't have a verify endpoint, just check if token exists
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminAuth');
        toast.error('Your session has expired. Please login again.');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen bg-[#F4F3E6] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FC703C] border-t-[#5D0703] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;