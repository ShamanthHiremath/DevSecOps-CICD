import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock framer-motion to avoid DOM prop warnings
vi.mock('framer-motion', () => ({
  motion: {
    nav: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <nav ref={ref} {...props}>{children}</nav>
    ),
    div: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <div ref={ref} {...props}>{children}</div>
    ),
    button: React.forwardRef(({ children, whileHover, whileTap, animate, initial, variants, whileInView, transition, viewport, ...props }, ref) => 
      <button ref={ref} {...props}>{children}</button>
    ),
  },
}));

const NavbarWrapper = ({ pathname = '/' }) => {
  vi.doMock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useLocation: () => ({ pathname }),
    };
  });
  
  return (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  it('renders without crashing', () => {
    render(<NavbarWrapper />);
  });

  it('displays the brand logo and text', () => {
    render(<NavbarWrapper />);
    expect(screen.getByText('College Events')).toBeInTheDocument();
  });

  it('displays home and events navigation links', () => {
    render(<NavbarWrapper />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('shows mobile menu toggle button', () => {
    render(<NavbarWrapper />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<NavbarWrapper />);
    const toggleButton = screen.getByRole('button');
    
    fireEvent.click(toggleButton);
    // Mobile menu should be visible
    const mobileHomeLink = screen.getAllByText('Home')[1]; // Second occurrence (mobile)
    expect(mobileHomeLink).toBeInTheDocument();
  });

  it('applies active styling to home link when on home page', () => {
    render(<NavbarWrapper pathname="/" />);
    const homeLink = screen.getAllByText('Home')[0]; // Desktop version
    expect(homeLink.closest('a')).toHaveClass('bg-[#FFA175]', 'text-white');
  });

  it('applies active styling to events link when on events page', () => {
    render(<NavbarWrapper pathname="/events" />);
    const eventsLink = screen.getAllByText('Events')[0]; // Desktop version
    expect(eventsLink.closest('a')).toHaveClass('bg-[#FFA175]', 'text-white');
  });

  it('has correct navigation links with proper href attributes', () => {
    render(<NavbarWrapper />);
    expect(screen.getByRole('link', { name: /College Events/ })).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: /Home/ })[0]).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: /Events/ })[0]).toHaveAttribute('href', '/events');
  });
});
