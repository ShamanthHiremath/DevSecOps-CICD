import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventCard from './EventCard';

// Mock framer-motion to avoid DOM prop warnings
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <div ref={ref} {...props}>{children}</div>
    ),
    button: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <button ref={ref} {...props}>{children}</button>
    ),
    section: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <section ref={ref} {...props}>{children}</section>
    ),
    h1: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <h1 ref={ref} {...props}>{children}</h1>
    ),
    h2: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <h2 ref={ref} {...props}>{children}</h2>
    ),
    h3: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <h3 ref={ref} {...props}>{children}</h3>
    ),
    p: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <p ref={ref} {...props}>{children}</p>
    ),
  },
}));

const mockEvent = {
  _id: 'event123',
  title: 'Test Event',
  description: 'This is a test event',
  date: '2025-12-25T10:00:00Z',
  location: 'Test Venue',
  category: 'Technical',
  image: 'https://example.com/image.jpg',
  capacity: 100,
  registeredCount: 45,
};

const mockPastEvent = {
  ...mockEvent,
  date: '2023-01-01T10:00:00Z', // Past date
};

describe('EventCard', () => {
  const mockOnRegister = vi.fn();
  const mockOnView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
  });

  it('displays event title', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('displays event image with correct alt text', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    const image = screen.getByAltText('Test Event');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('displays event category', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });
  it('displays event date', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    // The date is formatted using toLocaleDateString(), so we'll look for the formatted version
    const expectedDate = new Date(mockEvent.date).toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
  it('displays event venue', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    expect(screen.getByText('Test Venue')).toBeInTheDocument();  });

  it('shows register button for future events', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('calls onRegister when register button is clicked', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    
    fireEvent.click(screen.getByText('Register'));
    expect(mockOnRegister).toHaveBeenCalledWith(mockEvent);
  });

  it('shows view details button for past events', () => {
    render(
      <EventCard 
        event={mockPastEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
        isPast={true}
      />
    );
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('calls onView when view details button is clicked', () => {
    render(
      <EventCard 
        event={mockPastEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
        isPast={true}
      />
    );
    
    fireEvent.click(screen.getByText('View Details'));
    expect(mockOnView).toHaveBeenCalledWith(mockPastEvent);
  });

  it('applies grayscale filter to past event images', () => {
    render(
      <EventCard 
        event={mockPastEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
        isPast={true}
      />
    );
    
    const image = screen.getByAltText('Test Event');
    expect(image).toHaveStyle({ filter: 'grayscale(50%)' });
  });

  it('shows "PAST" badge for past events', () => {
    render(
      <EventCard 
        event={mockPastEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
        isPast={true}
      />
    );
    expect(screen.getByText('PAST')).toBeInTheDocument();
  });

  it('shows "UPCOMING" badge for future events', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />
    );
    expect(screen.getByText('UPCOMING')).toBeInTheDocument();
  });

  it('handles click on card for past events', () => {
    render(
      <EventCard 
        event={mockPastEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
        isPast={true}
      />
    );
    
    // Click on the card container
    const cardContainer = screen.getByText('Test Event').closest('.bg-white');
    fireEvent.click(cardContainer);
    expect(mockOnView).toHaveBeenCalledWith(mockPastEvent);
  });

  it('displays event description', () => {
    render(
      <EventCard 
        event={mockEvent} 
        onRegister={mockOnRegister} 
        onView={mockOnView} 
      />    );
    expect(screen.getByText('This is a test event')).toBeInTheDocument();
  });
});
