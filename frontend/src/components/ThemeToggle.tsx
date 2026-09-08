import { useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export const ThemeToggle = () => {
  // Initialise le thème depuis le stockage ou la préférence système
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme: 'light' | 'dark') => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    localStorage.setItem('theme', theme);
  };

  // bascule le thème
  const toggle = () => {
    const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // au montage, appliquer le thème initial
  useEffect(() => {
    setTheme(getInitialTheme() as 'light' | 'dark');
  }, []);

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light/dark theme"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.4rem',
        color: 'var(--text)',
        transition: 'color 0.3s',
      }}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
};
