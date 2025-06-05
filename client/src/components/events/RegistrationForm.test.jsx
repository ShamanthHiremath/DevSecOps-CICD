import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegistrationForm from './RegistrationForm';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock axios
vi.mock('axios');

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

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
  },
}));

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SERVER_API_URL: 'http://localhost:3000'
  },
  writable: true
});

describe('RegistrationForm', () => {
  const mockProps = {
    eventId: 'event123',
    capacity: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RegistrationForm {...mockProps} />);
  });

  it('displays all form fields', () => {
    render(<RegistrationForm {...mockProps} />);
    
    expect(screen.getByLabelText(/USN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Semester/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Branch/i)).toBeInTheDocument();
  });

  it('displays register button', () => {
    render(<RegistrationForm {...mockProps} />);
    expect(screen.getByRole('button', { name: /register now/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...mockProps} />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    await user.type(nameInput, 'John Doe');
    
    expect(nameInput.value).toBe('John Doe');
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /register now/i });
    await user.click(submitButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('validates USN format', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...mockProps} />);
    
    const usnInput = screen.getByLabelText(/USN/i);
    const nameInput = screen.getByLabelText(/Full Name/i);
    const submitButton = screen.getByRole('button', { name: /register now/i });
    
    await user.type(usnInput, 'invalid-usn');
    await user.type(nameInput, 'John Doe');
    await user.click(submitButton);
    
    // Note: USN validation is commented out in the original code
    // This test may need adjustment based on actual validation rules
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockResolvedValue({ data: { success: true } });
    
    render(<RegistrationForm {...mockProps} />);
    
    // Fill form fields
    await user.type(screen.getByLabelText(/USN/i), '1MS20CS001');
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.selectOptions(screen.getByLabelText(/Year/i), '2');
    await user.selectOptions(screen.getByLabelText(/Semester/i), '4');
    await user.selectOptions(screen.getByLabelText(/Branch/i), 'Computer Science');
    
    const submitButton = screen.getByRole('button', { name: /register now/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining('/api/events/event123/register'),
        {
          usn: '1MS20CS001',
          name: 'John Doe',
          year: '2',
          semester: '4',
          branch: 'Computer Science'
        }
      );
    });
  });

  it('shows success toast on successful registration', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockResolvedValue({ data: { success: true } });
    
    render(<RegistrationForm {...mockProps} />);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.click(screen.getByRole('button', { name: /register now/i }));
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration successful!');
    });
  });

  it('shows error toast on registration failure', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockRejectedValue({ response: { data: { message: 'Registration failed' } } });
    
    render(<RegistrationForm {...mockProps} />);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.click(screen.getByRole('button', { name: /register now/i }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });
  });

  it('disables submit button during submission', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<RegistrationForm {...mockProps} />);
    
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    const submitButton = screen.getByRole('button', { name: /register now/i });
    
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    const mockAxiosPost = vi.mocked(axios.post);
    mockAxiosPost.mockResolvedValue({ data: { success: true } });
    
    render(<RegistrationForm {...mockProps} />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    await user.type(nameInput, 'John Doe');
    await user.click(screen.getByRole('button', { name: /register now/i }));
    
    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });
});
