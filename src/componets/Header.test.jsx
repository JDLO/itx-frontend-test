import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Header from './Header';

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderHeader(path = '/') {
    return render(
      <CartProvider>
        <MemoryRouter initialEntries={[path]}>
          <Header />
        </MemoryRouter>
      </CartProvider>
    );
  }

  it('renders logo link', () => {
    renderHeader();

    const logoLink = screen.getByRole('link', { name: /📱 MovilShop/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('shows cart count from context', () => {
    renderHeader();

    expect(screen.getByText(/Carrito:/)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows only Home breadcrumb on root', () => {
    renderHeader('/');

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.queryByText('/ Detalle del producto')).not.toBeInTheDocument();
  });

  it('shows full breadcrumb on product page', () => {
    renderHeader('/product/1');

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByText('/ Detalle del producto')).toBeInTheDocument();
  });
});
