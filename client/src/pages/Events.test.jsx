import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Events from './Events';

// Mock UpcomingEvents and PastEvents components
vi.mock('../components/events/UpcomingEvents', () => ({
  default: () => <div data-testid="upcoming-events">Upcoming Events Component</div>,
}));

vi.mock('../components/events/PastEvents', () => ({
  default: () => <div data-testid="past-events">Past Events Component</div>,
}));

// Mock framer-motion to avoid DOM prop warnings
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <div ref={ref} {...props}>{children}</div>
    ),
    h1: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <h1 ref={ref} {...props}>{children}</h1>
    ),
  },
}));

const EventsWrapper = () => (
  <BrowserRouter>
    <Events />
  </BrowserRouter>
);

describe('Events', () => {
  it('renders without crashing', () => {
    render(<EventsWrapper />);
  });
  it('displays the page title', () => {
    render(<EventsWrapper />);
    expect(screen.getByText('College Events')).toBeInTheDocument();
  });

  it('renders UpcomingEvents component', () => {
    render(<EventsWrapper />);
    expect(screen.getByTestId('upcoming-events')).toBeInTheDocument();
  });

  it('renders PastEvents component', () => {
    render(<EventsWrapper />);
    expect(screen.getByTestId('past-events')).toBeInTheDocument();
  });

  it('has proper page structure with correct styling', () => {
    const { container } = render(<EventsWrapper />);
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('bg-[#F4F3E6]');
  });
  it('displays page content in correct order', () => {
    render(<EventsWrapper />);
    
    const title = screen.getByText('College Events');
    const upcomingEvents = screen.getByTestId('upcoming-events');
    const pastEvents = screen.getByTestId('past-events');
    
    expect(title).toBeInTheDocument();
    expect(upcomingEvents).toBeInTheDocument();
    expect(pastEvents).toBeInTheDocument();
    
    // Check if title appears before components
    expect(title.compareDocumentPosition(upcomingEvents)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(upcomingEvents.compareDocumentPosition(pastEvents)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('has proper padding and spacing', () => {
    const { container } = render(<EventsWrapper />);
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('p-4');
  });
});
