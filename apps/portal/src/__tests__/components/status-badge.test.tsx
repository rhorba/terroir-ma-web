import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/admin/status-badge';

describe('StatusBadge', () => {
  it('renders the status text', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('applies yellow classes for pending', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText('pending');
    expect(badge.className).toContain('bg-yellow-100');
    expect(badge.className).toContain('text-yellow-800');
  });

  it('applies green classes for active', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('active');
    expect(badge.className).toContain('bg-green-100');
    expect(badge.className).toContain('text-green-800');
  });

  it('applies red classes for suspended', () => {
    render(<StatusBadge status="suspended" />);
    const badge = screen.getByText('suspended');
    expect(badge.className).toContain('bg-red-100');
    expect(badge.className).toContain('text-red-800');
  });

  it('applies gray classes for revoked', () => {
    render(<StatusBadge status="revoked" />);
    const badge = screen.getByText('revoked');
    expect(badge.className).toContain('bg-gray-200');
    expect(badge.className).toContain('text-gray-700');
  });

  it('applies blue classes for accredited', () => {
    render(<StatusBadge status="accredited" />);
    const badge = screen.getByText('accredited');
    expect(badge.className).toContain('bg-blue-100');
    expect(badge.className).toContain('text-blue-800');
  });

  it('applies green classes for passed', () => {
    render(<StatusBadge status="passed" />);
    expect(screen.getByText('passed').className).toContain('bg-green-100');
  });

  it('applies red classes for failed', () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText('failed').className).toContain('bg-red-100');
  });

  it('applies gray classes for draft', () => {
    render(<StatusBadge status="draft" />);
    expect(screen.getByText('draft').className).toContain('bg-gray-100');
  });

  it('applies yellow classes for submitted', () => {
    render(<StatusBadge status="submitted" />);
    expect(screen.getByText('submitted').className).toContain('bg-yellow-100');
  });

  it('applies green classes for approved', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('approved').className).toContain('bg-green-100');
  });

  it('applies red classes for rejected', () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText('rejected').className).toContain('bg-red-100');
  });

  it('applies slate classes for expired', () => {
    render(<StatusBadge status="expired" />);
    expect(screen.getByText('expired').className).toContain('bg-slate-100');
  });

  it('falls back to gray for unknown status', () => {
    render(<StatusBadge status="unknown-status" />);
    const badge = screen.getByText('unknown-status');
    expect(badge.className).toContain('bg-gray-100');
    expect(badge.className).toContain('text-gray-700');
  });

  it('renders as a span element', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('active');
    expect(badge.tagName).toBe('SPAN');
  });
});
