/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom'; // <--- THIS IS THE KEY FIX
import App from './App';
import { CartProvider } from './context/CartContext';

describe('Buckeye Marketplace Frontend Tests', () => {
  it('renders the main title', () => {
    render(
      <CartProvider>
          <App />
      </CartProvider>
    );
    expect(screen.getByText(/Buckeye Marketplace/i)).toBeInTheDocument();
  });

  it('shows the My Orders link', () => {
    render(
      <CartProvider>
          <App />
      </CartProvider>
    );
    expect(screen.getByText(/My Orders/i)).toBeInTheDocument();
  });

  it('shows the View Cart link', () => {
    render(
      <CartProvider>
          <App />
      </CartProvider>
    );
    expect(screen.getByText(/View Cart/i)).toBeInTheDocument();
  });
});