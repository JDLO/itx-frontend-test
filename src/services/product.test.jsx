import { beforeEach, describe, expect, it, vi } from "vitest";
import { productService } from "./productService";
import { cacheManager } from "./cache";

describe('productService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('getProducts Should do fetch to the API if not exists data in cache then save it', async () => {
    const mockProducts = [
      { id: '0001', brand: 'Acer', model: 'Liquid', price: '100' },
      { id: '0002', brand: 'Alcatel', model: 'OneTouch', price: '150' }
    ];

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });

    const result = await productService.getProducts();

    expect(result).toEqual(mockProducts);
    expect(window.fetch).toHaveBeenCalledWith('/api/product');

    const cacheData = cacheManager.get('product_list');
    expect(cacheData).toEqual(mockProducts);

  });

  it('addToCart should send POST request with correct payload', async ()=> {
    const mockCartResponse = { count: 5 };
    const payload = { id: '0001', colorCode: 1, storageCode: 2 };

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockCartResponse,
    });

    const result = await productService.addToCart(payload);

    expect(result).toEqual(mockCartResponse);
    expect(window.fetch).toHaveBeenCalledWith('/api/cart', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }))
  });

  it('Should throw a error if the response from the API is not correct', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    });

    await expect(productService.getProducts()).rejects.toThrow('Error al obtener productos');
  });

})