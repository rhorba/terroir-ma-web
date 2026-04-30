import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmModal } from '@/components/admin/confirm-modal';

describe('ConfirmModal', () => {
  it('renders the trigger element', () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="Confirm action"
        action={<button>OK</button>}
      />,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('does not show the modal initially', () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="Confirm?"
        action={<button>OK</button>}
      />,
    );
    expect(screen.queryByText('Confirm?')).not.toBeInTheDocument();
  });

  it('opens modal when trigger is clicked', async () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="Confirm action"
        action={<button>OK</button>}
      />,
    );
    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Confirm action')).toBeInTheDocument();
  });

  it('shows children content in the modal', async () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="Confirm?"
        action={<button>OK</button>}
      >
        <p>Are you sure you want to delete this?</p>
      </ConfirmModal>,
    );
    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Are you sure you want to delete this?')).toBeInTheDocument();
  });

  it('renders the action element inside the modal', async () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="Confirm?"
        action={<button type="submit">Confirm delete</button>}
      />,
    );
    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Confirm delete')).toBeInTheDocument();
  });

  it('closes modal when Annuler is clicked', async () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="Are you sure?"
        action={<button>OK</button>}
      />,
    );
    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Annuler'));
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('can be reopened after closing', async () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="Confirm?"
        action={<button>OK</button>}
      />,
    );
    await userEvent.click(screen.getByText('Open'));
    await userEvent.click(screen.getByText('Annuler'));
    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Confirm?')).toBeInTheDocument();
  });

  it('modal title is rendered in an h3', async () => {
    render(
      <ConfirmModal
        trigger={<button>Open</button>}
        title="My Title"
        action={<button>OK</button>}
      />,
    );
    await userEvent.click(screen.getByText('Open'));
    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toHaveTextContent('My Title');
  });
});
