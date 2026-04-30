import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from '@/components/admin/data-table';

describe('DataTable', () => {
  it('renders all header columns', () => {
    render(<DataTable head={['Name', 'Status', 'Date']} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('renders children rows when isEmpty is false', () => {
    render(
      <DataTable head={['Name']}>
        <tr>
          <td>Row 1</td>
        </tr>
      </DataTable>,
    );
    expect(screen.getByText('Row 1')).toBeInTheDocument();
  });

  it('shows default empty message when isEmpty is true', () => {
    render(<DataTable head={['Name']} isEmpty />);
    expect(screen.getByText('Aucun élément.')).toBeInTheDocument();
  });

  it('shows custom empty message when isEmpty is true', () => {
    render(<DataTable head={['Name']} isEmpty empty="Pas de données disponibles." />);
    expect(screen.getByText('Pas de données disponibles.')).toBeInTheDocument();
  });

  it('hides children when isEmpty is true', () => {
    render(
      <DataTable head={['Name']} isEmpty>
        <tr>
          <td>Should not appear</td>
        </tr>
      </DataTable>,
    );
    expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
  });

  it('empty cell spans the full column count', () => {
    const { container } = render(
      <DataTable head={['Col1', 'Col2', 'Col3']} isEmpty />,
    );
    const emptyCell = container.querySelector('td');
    expect(emptyCell?.getAttribute('colspan')).toBe('3');
  });

  it('renders a table element', () => {
    const { container } = render(<DataTable head={['A']} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders a thead and tbody', () => {
    const { container } = render(<DataTable head={['A']} />);
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('renders multiple children rows', () => {
    render(
      <DataTable head={['Name', 'Value']}>
        <tr><td>Alice</td><td>100</td></tr>
        <tr><td>Bob</td><td>200</td></tr>
        <tr><td>Carol</td><td>300</td></tr>
      </DataTable>,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('renders correctly with no children and isEmpty not set', () => {
    render(<DataTable head={['Name']} />);
    expect(screen.queryByText('Aucun élément.')).not.toBeInTheDocument();
  });
});
