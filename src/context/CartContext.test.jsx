import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, CartContext } from './CartContext';
import { useContext } from 'react';

function TestComponent() {
  const { cartCount, setCartCount } = useContext(CartContext);
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <button data-testid="update" onClick={() => setCartCount(3)}>Update</button>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes cartCount to 0 when localStorage is empty', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('initializes cartCount from localStorage when value exists', () => {
    localStorage.setItem('cart_count', '5');

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  it('initializes cartCount to 0 when localStorage has invalid data', () => {
    localStorage.setItem('cart_count', 'abc');

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('setCartCount updates state and persists to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await user.click(screen.getByTestId('update'));

    expect(screen.getByTestId('count')).toHaveTextContent('3');
    expect(localStorage.getItem('cart_count')).toBe('3');
  });

  it('renders children', () => {
    render(
      <CartProvider>
        <div data-testid="child">Hello</div>
      </CartProvider>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });
});
