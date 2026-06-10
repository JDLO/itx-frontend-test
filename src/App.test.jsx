import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { productService } from './services/productService';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders Header with logo', () => {
    vi.spyOn(productService, 'getProducts').mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(screen.getByRole('link', { name: /📱 MovilShop/i })).toBeInTheDocument();
  });

  it('renders ProductListPage on /', async () => {
    vi.spyOn(productService, 'getProducts').mockReturnValue(new Promise(() => {}));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cargando catalogo...')).toBeInTheDocument();
    });
  });

  it('renders ProductDetailsPage on /product/:id', async () => {
    vi.spyOn(productService, 'getProductById').mockReturnValue(new Promise(() => {}));

    window.history.pushState({}, '', '/product/0001');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cargando detalles del dispositivo...')).toBeInTheDocument();
    });
  });
});
