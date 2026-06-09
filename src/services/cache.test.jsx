import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheManager } from './cache';

describe('cacheManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve data if not expired', () => {
    const mockData = { id: '0001', brand: 'Acer' };
    cacheManager.set('test_key', mockData);

    const recovered = cacheManager.get('test_key');
    expect(recovered).toEqual(mockData);
  });

  it('should return null if data has expired (more than 1 hour)', () => {
    const mockData = { id: '0001', brand: 'Acer' };
    cacheManager.set('test_key', mockData);

    // Simulamos que adelantamos el reloj 2 horas en el futuro
    const twoHours = 2 * 60 * 60 * 1000;
    const originalNow = Date.now.bind(Date);
    vi.spyOn(Date, 'now').mockImplementation(() => originalNow() + twoHours);

    const recovered = cacheManager.get('test_key');
    expect(recovered).toBeNull();
  });
});