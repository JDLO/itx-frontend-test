import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders input with placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />);

    expect(screen.getByPlaceholderText('Buscar por marca o modelo')).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    render(<SearchBar value="Acer" onChange={() => {}} />);

    expect(screen.getByPlaceholderText('Buscar por marca o modelo')).toHaveValue('Acer');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Buscar por marca o modelo');
    await user.type(input, 'A');

    expect(onChange).toHaveBeenCalledWith('A');
  });
});
