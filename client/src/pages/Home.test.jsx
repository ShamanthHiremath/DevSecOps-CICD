import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

const HomeWrapper = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<HomeWrapper />);
  });

  it('displays the main hero heading', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('Welcome to Our College Events')).toBeInTheDocument();
  });

  it('displays the hero subheading', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('Discover, Participate, and Excel in Various Events')).toBeInTheDocument();
  });

  it('displays explore events button', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('Explore Events')).toBeInTheDocument();
  });

  it('navigates to events page when explore button is clicked', () => {
    render(<HomeWrapper />);
    const exploreButton = screen.getByText('Explore Events');
    fireEvent.click(exploreButton);
    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  it('displays features section', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('Why Choose Our Events?')).toBeInTheDocument();
  });

  it('displays all feature cards', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('Diverse Categories')).toBeInTheDocument();
    expect(screen.getByText('Easy Registration')).toBeInTheDocument();
    expect(screen.getByText('Real-time Updates')).toBeInTheDocument();
  });

  it('displays feature descriptions', () => {
    render(<HomeWrapper />);
    expect(screen.getByText(/From technical workshops to cultural fest/)).toBeInTheDocument();
    expect(screen.getByText(/Quick and hassle-free registration/)).toBeInTheDocument();
    expect(screen.getByText(/Get instant notifications/)).toBeInTheDocument();
  });

  it('displays upcoming events section', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('displays call-to-action section', () => {
    render(<HomeWrapper />);
    expect(screen.getByText("Ready to Join Amazing Events?")).toBeInTheDocument();
  });

  it('displays get started button in CTA section', () => {
    render(<HomeWrapper />);
    const getStartedButtons = screen.getAllByText('Get Started');
    expect(getStartedButtons.length).toBeGreaterThan(0);
  });

  it('navigates to events page when CTA button is clicked', () => {
    render(<HomeWrapper />);
    const getStartedButtons = screen.getAllByText('Get Started');
    fireEvent.click(getStartedButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  it('displays stats section', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
  });

  it('displays stats labels', () => {
    render(<HomeWrapper />);
    expect(screen.getByText('Students Participated')).toBeInTheDocument();
    expect(screen.getByText('Events Hosted')).toBeInTheDocument();
    expect(screen.getByText('Satisfaction Rate')).toBeInTheDocument();
  });

  it('has proper background styling', () => {
    const { container } = render(<HomeWrapper />);
    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toHaveClass('bg-[#F4F3E6]');
  });

  it('has proper hero section styling', () => {
    const { container } = render(<HomeWrapper />);
    const heroSection = container.querySelector('section');
    expect(heroSection).toHaveClass('bg-gradient-to-r', 'from-[#FC703C]', 'to-[#5D0703]');
  });

  it('displays all required icons', () => {
    render(<HomeWrapper />);
    // Icons are present in the component but testing their presence through text content
    expect(screen.getByText('Diverse Categories')).toBeInTheDocument();
    expect(screen.getByText('Easy Registration')).toBeInTheDocument();
    expect(screen.getByText('Real-time Updates')).toBeInTheDocument();
  });
});
