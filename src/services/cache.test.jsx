import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheManager } from './cache';

describe('cacheManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debería guardar y recuperar los datos si no han expirado', () => {
    const mockData = { id: '0001', brand: 'Acer' };
    cacheManager.set('test_key', mockData);

    const recovered = cacheManager.get('test_key');
    expect(recovered).toEqual(mockData);
  });

  it('debería devolver null si los datos han expirado (más de 1 hora)', () => {
    const mockData = { id: '0001', brand: 'Acer' };
    cacheManager.set('test_key', mockData);

    // Simulamos que adelantamos el reloj 2 horas en el futuro
    const twoHours = 2 * 60 * 60 * 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => Date.now() + twoHours);

    const recovered = cacheManager.get('test_key');
    expect(recovered).toBeNull();
  });
});