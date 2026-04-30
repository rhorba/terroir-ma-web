import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: class MockQueryClient {
    defaultOptions = {};
  },
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { Providers } from '@/components/providers';

describe('Providers', () => {
  it('renders children', () => {
    render(
      <Providers>
        <p>Child content</p>
      </Providers>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Providers>
        <span>First</span>
        <span>Second</span>
      </Providers>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('wraps children without crashing', () => {
    expect(() =>
      render(
        <Providers>
          <div />
        </Providers>,
      ),
    ).not.toThrow();
  });
});
