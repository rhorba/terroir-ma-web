import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('returns a single class unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('merges multiple classes', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('removes falsy values', () => {
    expect(cn('text-sm', false, undefined, null, 'font-bold')).toBe('text-sm font-bold');
  });

  it('resolves Tailwind conflicts — later wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('handles conditional object syntax', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500');
  });

  it('handles array inputs', () => {
    expect(cn(['text-sm', 'font-medium'])).toBe('text-sm font-medium');
  });

  it('handles deeply nested conditionals', () => {
    const active = true;
    expect(cn('base', active && 'active', !active && 'inactive')).toBe('base active');
  });

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('merges text-color conflicts', () => {
    expect(cn('text-red-500', 'text-green-700')).toBe('text-green-700');
  });

  it('handles complex mixed inputs', () => {
    const result = cn('flex', { 'items-center': true }, ['gap-2', 'p-4'], undefined);
    expect(result).toBe('flex items-center gap-2 p-4');
  });
});
