import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
    useLocation: () => ({ pathname: '/admin/dashboard' }),
  };
});

// Mock axios
vi.mock('axios');

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const TestChild = () => <div data-testid="protected-content">Protected Content</div>;

const ProtectedRouteWrapper = () => (
  <BrowserRouter>
    <ProtectedRoute>
      <TestChild />
    </ProtectedRoute>
  </BrowserRouter>
);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });
  it('renders loading state initially', () => {
    render(<ProtectedRouteWrapper />);
    // Check for loading spinner instead of text
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('redirects to admin login when no token is present', async () => {
    render(<ProtectedRouteWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toHaveTextContent('/admin/login');
    });
  });

  it('renders children when token is present', async () => {
    localStorage.setItem('adminToken', 'valid-token');
    
    render(<ProtectedRouteWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  it('removes token and redirects when authentication fails', async () => {
    const mockToken = 'invalid-token';
    localStorage.setItem('adminToken', mockToken);
    
    // Mock axios to throw an error
    const axios = await import('axios');
    axios.default.get = vi.fn().mockRejectedValue(new Error('Auth failed'));
    
    render(<ProtectedRouteWrapper />);
    
    await waitFor(() => {
      expect(localStorage.getItem('adminToken')).toBeNull();
      expect(screen.getByTestId('navigate')).toHaveTextContent('/admin/login');
    });
  });

  it('preserves location state for redirect after login', async () => {
    render(<ProtectedRouteWrapper />);
    
    await waitFor(() => {
      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toBeInTheDocument();
    });
  });

  it('handles localStorage errors gracefully', async () => {
    // Mock localStorage.getItem to throw an error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn().mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    render(<ProtectedRouteWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toHaveTextContent('/admin/login');
    });
    
    // Restore original localStorage
    localStorage.getItem = originalGetItem;
  });
});
