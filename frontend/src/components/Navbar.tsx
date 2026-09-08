import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { FaChartPie, FaExchangeAlt, FaBullseye, FaTags, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 0.85rem',
    borderRadius: '0.5rem',
    fontSize: '0.92rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px solid var(--card-border)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <NavLink
          to={isAuthenticated ? '/dashboard' : '/login'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
              color: '#ffffff',
              fontSize: '1rem',
            }}
          >
            <FaChartPie />
          </span>
          Portfolio Manager
        </NavLink>

        {isAuthenticated && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <NavLink to="/dashboard" style={navLinkStyle}>
              <FaChartPie />
              Tableau de bord
            </NavLink>
            <NavLink to="/transactions" style={navLinkStyle}>
              <FaExchangeAlt />
              Transactions
            </NavLink>
            <NavLink to="/goals" style={navLinkStyle}>
              <FaBullseye />
              Objectifs
            </NavLink>
            <NavLink to="/categories" style={navLinkStyle}>
              <FaTags />
              Catégories
            </NavLink>
          </nav>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <ThemeToggle />
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.9rem',
              borderRadius: '0.5rem',
              fontSize: '0.88rem',
              fontWeight: 500,
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--danger)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <FaSignOutAlt />
            Se déconnecter
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <NavLink to="/login" style={navLinkStyle}>
              <FaSignInAlt />
              Connexion
            </NavLink>
            <NavLink to="/register" style={navLinkStyle}>
              <FaUserPlus />
              Inscription
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};
