import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IPEntryRow } from './IPEntryRow';
import { IPLookupProvider } from '../../contexts/IPLookupProvider';

describe('IPEntryRow', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<IPLookupProvider>{ui}</IPLookupProvider>);
  };

  it('should render input with index number', () => {
    renderWithProvider(<IPEntryRow id={1} index={0} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex. 85.232.252.1/i)).toBeInTheDocument();
  });

  it('should allow user to type IP address', async () => {
    const user = userEvent.setup();
    renderWithProvider(<IPEntryRow id={1} index={0} />);

    const input = screen.getByPlaceholderText(/Ex. 85.232.252.1/i);
    await user.type(input, '8.8.8.8');

    expect(input).toHaveValue('8.8.8.8');
  });

  it('should render multiple entries with different indices', () => {
    const { unmount } = renderWithProvider(<IPEntryRow id={1} index={0} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    unmount();

    renderWithProvider(<IPEntryRow id={2} index={1} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
