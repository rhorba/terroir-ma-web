import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '@/components/admin/page-header';

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the title as h1', () => {
    render(<PageHeader title="My Title" />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('My Title');
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Title" subtitle="A helpful description" />);
    expect(screen.getByText('A helpful description')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<PageHeader title="Title" />);
    expect(screen.queryByText('A helpful description')).not.toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <PageHeader
        title="Title"
        action={<button>Nouveau</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Nouveau' })).toBeInTheDocument();
  });

  it('does not render action when action prop is omitted', () => {
    render(<PageHeader title="Title" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders both subtitle and action together', () => {
    render(
      <PageHeader
        title="Cooperatives"
        subtitle="Gérez les coopératives"
        action={<button>Ajouter</button>}
      />,
    );
    expect(screen.getByText('Cooperatives')).toBeInTheDocument();
    expect(screen.getByText('Gérez les coopératives')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeInTheDocument();
  });
});
