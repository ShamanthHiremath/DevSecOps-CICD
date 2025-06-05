import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminLogin from './AdminLogin';
import axios from 'axios';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock axios
vi.mock('axios');

// Mock framer-motion to avoid DOM prop warnings
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <div ref={ref} {...props}>{children}</div>
    ),
    form: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <form ref={ref} {...props}>{children}</form>
    ),
    button: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <button ref={ref} {...props}>{children}</button>
    ),
    h1: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <h1 ref={ref} {...props}>{children}</h1>
    ),
    p: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <p ref={ref} {...props}>{children}</p>
    ),
  },
}));

const AdminLoginWrapper = () => (
  <BrowserRouter>
    <AdminLogin />
  </BrowserRouter>
);

describe('AdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<AdminLoginWrapper />);
  });

  it('displays login form title', () => {
    render(<AdminLoginWrapper />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('displays email and password input fields', () => {
    render(<AdminLoginWrapper />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('displays login button', () => {
    render(<AdminLoginWrapper />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays signup link', () => {
    render(<AdminLoginWrapper />);
    expect(screen.getByText(/create one here/i)).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<AdminLoginWrapper />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput.value).toBe('admin@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits form with correct credentials', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockResolvedValue({ 
      data: { token: 'mock-token' } 
    });
    
    render(<AdminLoginWrapper />);
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/login'),
        {
          email: 'admin@test.com',
          password: 'password123'
        }
      );
    });
  });

  it('stores token and navigates on successful login', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockResolvedValue({ 
      data: { token: 'mock-token' } 
    });
    
    render(<AdminLoginWrapper />);
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(localStorage.getItem('adminAuth')).toBe('true');
      expect(localStorage.getItem('adminToken')).toBe('mock-token');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });
    
    render(<AdminLoginWrapper />);
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('displays generic error message when no specific error provided', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockRejectedValue(new Error('Network error'));
    
    render(<AdminLoginWrapper />);
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
    });
  });

  it('disables submit button during submission', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<AdminLoginWrapper />);
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });

  it('shows loading text during submission', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<AdminLoginWrapper />);
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
  });

  it('handles invalid server response', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockResolvedValue({ data: {} }); // No token in response
    
    render(<AdminLoginWrapper />);
    
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid response from server')).toBeInTheDocument();
    });
  });

  it('navigates to signup page when signup link is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminLoginWrapper />);
    
    const signupLink = screen.getByRole('link', { name: /create one here/i });
    expect(signupLink).toHaveAttribute('href', '/admin/signup');
  });
});
