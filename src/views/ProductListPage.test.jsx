import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductListPage from './ProductListPage';

const mockProducts = [
  {
    id: '0001',
    brand: 'Acer',
    model: 'Liquid',
    price: '299',
    imgUrl: '/img/acer-liquid.png',
  },
  {
    id: '0002',
    brand: 'Alcatel',
    model: 'OneTouch',
    price: '150',
    imgUrl: '/img/alcatel-onetouch.png',
  },
  {
    id: '0003',
    brand: 'Samsung',
    model: 'Galaxy S24',
    price: '899',
    imgUrl: '/img/samsung-galaxy-s24.png',
  },
];

describe('ProductListPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>
    );
  }

  it('shows loading state on mount', () => {
    vi.spyOn(productService, 'getProducts').mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText('Cargando catalogo...')).toBeInTheDocument();
  });

  it('renders products after successful fetch', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Liquid')).toBeInTheDocument();
      expect(screen.getByText('OneTouch')).toBeInTheDocument();
      expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    });
  });

  it('displays product image, model and price', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Liquid')).toBeInTheDocument();
      expect(screen.getByText('OneTouch')).toBeInTheDocument();
      expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    });

    expect(screen.getByText('$ 299')).toBeInTheDocument();
    expect(screen.getByText('$ 150')).toBeInTheDocument();
    expect(screen.getByText('$ 899')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    const productImages = images.filter(img => img.getAttribute('src')?.startsWith('/img/'));
    expect(productImages).toHaveLength(3);
  });

  it('renders product links to detail page', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Liquid')).toBeInTheDocument();
    });

    const links = screen.getAllByRole('link');
    expect(links.some(link => link.getAttribute('href') === '/product/0001')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '/product/0002')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '/product/0003')).toBe(true);
  });

  describe('filtering', () => {
    it('filters products by brand', async () => {
      const user = userEvent.setup();
      vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

      renderPage();

      await waitFor(() => {
        expect(screen.getByText('Liquid')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por marca o modelo');
      await user.type(searchInput, 'Acer');

      expect(screen.getByText('Liquid')).toBeInTheDocument();
      expect(screen.queryByText('OneTouch')).not.toBeInTheDocument();
      expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument();
    });

    it('filters products by model', async () => {
      const user = userEvent.setup();
      vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

      renderPage();

      await waitFor(() => {
        expect(screen.getByText('Liquid')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por marca o modelo');
      await user.type(searchInput, 'Galaxy');

      expect(screen.queryByText('Liquid')).not.toBeInTheDocument();
      expect(screen.queryByText('OneTouch')).not.toBeInTheDocument();
      expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    });

    it('shows empty message when no products match', async () => {
      const user = userEvent.setup();
      vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

      renderPage();

      await waitFor(() => {
        expect(screen.getByText('Liquid')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por marca o modelo');
      await user.type(searchInput, 'XYZ');

      expect(screen.queryByText('Liquid')).not.toBeInTheDocument();
      expect(screen.queryByText('OneTouch')).not.toBeInTheDocument();
      expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument();
      expect(screen.getByText('No se encontraron dispositivos que coincidan.')).toBeInTheDocument();
    });
  });
});
