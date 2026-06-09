import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { productService } from '../services/productService';
import ProductDetailsPage from './ProudctDetailsPage';

const mockProduct = {
  id: '0001',
  brand: 'Acer',
  model: 'Liquid',
  price: '299',
  imgUrl: '/img/acer-liquid.png',
  cpu: 'Quad-core 2.3GHz',
  ram: '4GB',
  os: 'Android 11',
  displayResolution: '1080x2340',
  battery: '4000mAh',
  cameras: '48MP + 8MP',
  dimentions: '158x73x8mm',
  weight: '180',
  options: {
    storages: [
      { code: 1, name: '64GB' },
      { code: 2, name: '128GB' },
    ],
    colors: [
      { code: 5, name: 'Negro' },
      { code: 8, name: 'Blanco' },
    ],
  },
};

describe('ProductDetailsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.stubGlobal('alert', vi.fn());
  });

  function renderPage() {
    return render(
      <CartProvider>
        <MemoryRouter initialEntries={['/product/0001']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    );
  }

  function getSelects() {
    return screen.getAllByRole('combobox');
  }

  it('shows loading state on mount', () => {
    vi.spyOn(productService, 'getProductById').mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText('Cargando detalles del dispositivo...')).toBeInTheDocument();
  });

  it('shows error state when product fetch fails', async () => {
    vi.spyOn(productService, 'getProductById').mockRejectedValue(new Error('API error'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No se encontro la informacion del producto.')).toBeInTheDocument();
    });
  });

  it('renders product details after successful fetch', async () => {
    vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Acer')).toBeInTheDocument();
      expect(screen.getByText('Liquid')).toBeInTheDocument();
      expect(screen.getByText('299€')).toBeInTheDocument();
    });

    expect(screen.getByText('Quad-core 2.3GHz')).toBeInTheDocument();
    expect(screen.getByText('4GB')).toBeInTheDocument();
    expect(screen.getByAltText('Acer Liquid')).toBeInTheDocument();
  });

  it('auto-selects first storage and color options', async () => {
    vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);

    renderPage();

    await waitFor(() => {
      const [storageSelect, colorSelect] = getSelects();
      expect(storageSelect).toHaveValue('1');
      expect(colorSelect).toHaveValue('5');
    });
  });

  it('calls addToCart with correct body on submit', async () => {
    const user = userEvent.setup();
    vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);
    const addToCartSpy = vi.spyOn(productService, 'addToCart').mockResolvedValue({ count: 1 });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Acer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /añadir al carrito/i }));

    await waitFor(() => {
      expect(addToCartSpy).toHaveBeenCalledWith({
        id: '0001',
        colorCode: 5,
        storageCode: 1,
      });
    });
  });

  it('updates cart count after successful addToCart', async () => {
    const user = userEvent.setup();
    vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);
    vi.spyOn(productService, 'addToCart').mockResolvedValue({ count: 3 });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Acer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /añadir al carrito/i }));

    await waitFor(() => {
      expect(localStorage.getItem('cart_count')).toBe('3');
    });
  });

  it('shows alert on addToCart error', async () => {
    const user = userEvent.setup();
    vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);
    vi.spyOn(productService, 'addToCart').mockRejectedValue(new Error('Network error'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Acer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /añadir al carrito/i }));

    await waitFor(() => {
      expect(globalThis.alert).toHaveBeenCalledWith(
        'Hubo un error al agregar el producto al carrito.'
      );
    });
  });

  it('disables button while submitting', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    const promise = new Promise((resolve) => { resolvePromise = resolve; });
    vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);
    vi.spyOn(productService, 'addToCart').mockReturnValue(promise);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Acer')).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /añadir al carrito/i });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText('Añadiendo...')).toBeInTheDocument();

    resolvePromise({ count: 1 });
  });

  it('renders back link to product list', async () => {
    vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/volver al listado/i)).toBeInTheDocument();
    });

    const backLink = screen.getByText(/volver al listado/i).closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });
});
