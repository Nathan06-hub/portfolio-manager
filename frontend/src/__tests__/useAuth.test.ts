import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';

describe('useAuth hook', () => {
  beforeEach(() => localStorage.clear());

  it('should load token from localStorage on mount', () => {
    localStorage.setItem('access_token', 'my-token');
    const { result } = renderHook(() => useAuth());
    expect(result.current.token).toBe('my-token');
  });

  it('login stores token in localStorage', () => {
    const { result } = renderHook(() => useAuth());
    act(() => result.current.login('new-token'));
    expect(localStorage.getItem('access_token')).toBe('new-token');
    expect(result.current.token).toBe('new-token');
  });

  it('logout clears token', () => {
    const { result } = renderHook(() => useAuth());
    act(() => result.current.login('temp-token'));
    act(() => result.current.logout());
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(result.current.token).toBeNull();
  });
});
