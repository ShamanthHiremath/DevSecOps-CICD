import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventComponent from './EventComponent';

// Mock RegistrationForm
vi.mock('./events/RegistrationForm', () => ({
  default: ({ eventId, capacity }) => (
    <div data-testid="registration-form">
      Registration Form - Event: {eventId}, Capacity: {capacity}
    </div>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  },
}));

const mockEvent = {
  _id: 'event123',
  title: 'Test Event',
  description: 'This is a test event description',
  date: '2025-12-25',
  time: '10:00 AM',
  location: 'Test Venue',
  category: 'Technical',
  capacity: 100,
  registeredCount: 45,
};

describe('EventComponent', () => {
  it('renders without crashing', () => {
    render(<EventComponent event={mockEvent} />);
  });

  it('displays event title', () => {
    render(<EventComponent event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('displays event description', () => {
    render(<EventComponent event={mockEvent} />);
    expect(screen.getByText('This is a test event description')).toBeInTheDocument();
  });  it('displays event date', () => {
    render(<EventComponent event={mockEvent} />);
    const expectedDate = new Date(mockEvent.date).toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('displays event location', () => {
    render(<EventComponent event={mockEvent} />);
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
  });

  it('displays event category', () => {
    render(<EventComponent event={mockEvent} />);
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });
  it('displays capacity information', () => {
    render(<EventComponent event={mockEvent} />);
    expect(screen.getByText('100 participants')).toBeInTheDocument();
  });

  it('renders registration form with correct props', () => {
    render(<EventComponent event={mockEvent} />);
    expect(screen.getByTestId('registration-form')).toHaveTextContent(
      'Registration Form - Event: event123, Capacity: 100'
    );
  });

  it('handles event with no registered count', () => {
    const eventWithoutCount = { ...mockEvent, registeredCount: undefined };
    render(<EventComponent event={eventWithoutCount} />);
    // Should still render without crashing
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });
  it('handles event with zero capacity', () => {
    const eventWithZeroCapacity = { ...mockEvent, capacity: 0 };
    render(<EventComponent event={eventWithZeroCapacity} />);
    expect(screen.getByText('0 participants')).toBeInTheDocument();
  });
});
