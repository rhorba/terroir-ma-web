import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return {
    ...actual,
    useFormStatus: vi.fn().mockReturnValue({ pending: false }),
  };
});

import { ActionButton } from '@/components/admin/action-button';
import { useFormStatus } from 'react-dom';

const mockUseFormStatus = vi.mocked(useFormStatus);

beforeEach(() => {
  mockUseFormStatus.mockReturnValue({ pending: false } as ReturnType<typeof useFormStatus>);
});

describe('ActionButton', () => {
  it('renders the label text when not pending', () => {
    render(<ActionButton label="Enregistrer" />);
    expect(screen.getByRole('button')).toHaveTextContent('Enregistrer');
  });

  it('renders pendingLabel when form is pending', () => {
    mockUseFormStatus.mockReturnValue({ pending: true } as ReturnType<typeof useFormStatus>);
    render(<ActionButton label="Enregistrer" pendingLabel="Sauvegarde..." />);
    expect(screen.getByRole('button')).toHaveTextContent('Sauvegarde...');
  });

  it('renders default pendingLabel "En cours..." when pending and no pendingLabel given', () => {
    mockUseFormStatus.mockReturnValue({ pending: true } as ReturnType<typeof useFormStatus>);
    render(<ActionButton label="Submit" />);
    expect(screen.getByRole('button')).toHaveTextContent('En cours...');
  });

  it('is disabled when pending is true', () => {
    mockUseFormStatus.mockReturnValue({ pending: true } as ReturnType<typeof useFormStatus>);
    render(<ActionButton label="Save" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<ActionButton label="Save" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is enabled when not pending and not disabled', () => {
    render(<ActionButton label="Save" />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('applies primary green classes by default', () => {
    render(<ActionButton label="Save" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-green-600');
  });

  it('applies danger red classes for danger variant', () => {
    render(<ActionButton label="Delete" variant="danger" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-red-600');
  });

  it('applies secondary gray classes for secondary variant', () => {
    render(<ActionButton label="Cancel" variant="secondary" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-gray-200');
  });

  it('has type="submit"', () => {
    render(<ActionButton label="Go" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
