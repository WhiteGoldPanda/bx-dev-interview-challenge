import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './app-init';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login form when not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/Sign in to continue/i)).toBeInTheDocument();
  });
});
