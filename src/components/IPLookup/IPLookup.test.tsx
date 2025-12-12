import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IPLookup, type IPLookupProps } from './IPLookup';
import { IPLookupProvider } from '../../contexts/IPLookupProvider';

describe('IPLookup', () => {
  const renderWithProvider = (props: IPLookupProps) => {
    return render(
      <IPLookupProvider>
        <IPLookup {...props} />
      </IPLookupProvider>
    );
  };

  beforeEach(() => {
    document.body.style.overflow = 'unset';
  });

  it('should not render when closed', () => {
    renderWithProvider({ isOpen: false, onClose: vi.fn() });

    expect(screen.queryByText('IP Lookup')).not.toBeInTheDocument();
  });

  it('should render modal when open', () => {
    renderWithProvider({ isOpen: true, onClose: vi.fn() });

    expect(screen.getByText('IP Lookup')).toBeInTheDocument();
    expect(screen.getByText(/Enter one or more IP/i)).toBeInTheDocument();
  });

  it('should render default entry row', () => {
    renderWithProvider({ isOpen: true, onClose: vi.fn() });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex. 85.232.252.1/i)).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProvider({ isOpen: true, onClose });

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProvider({ isOpen: true, onClose });

    const backdrop = screen.getByText('IP Lookup').closest('.backdrop');
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onClose when Escape key pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProvider({ isOpen: true, onClose });

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should show add button', () => {
    renderWithProvider({ isOpen: true, onClose: vi.fn() });

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should add new entry when add button clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider({ isOpen: true, onClose: vi.fn() });

    const addButton = screen.getByRole('button', { name: /add/i });
    await user.click(addButton);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should set body overflow hidden when open', () => {
    renderWithProvider({ isOpen: true, onClose: vi.fn() });

    expect(document.body.style.overflow).toBe('hidden');
  });
});
