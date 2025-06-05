import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';

// Mock Date to ensure consistent year testing
const mockDate = new Date('2024-12-01');
vi.setSystemTime(mockDate);

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('displays the correct copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 | Developed by OpenAHigh/)).toBeInTheDocument();
  });

  it('has the correct styling classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('mt-auto', 'bg-gradient-to-r', 'from-[#FC703C]', 'to-[#5D0703]', 'text-white', 'py-4', 'text-center', 'text-sm');
  });

  it('displays the current year dynamically', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });
});
