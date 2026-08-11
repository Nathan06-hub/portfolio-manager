import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

// A simple layout that centers the auth forms and adds a subtle background gradient.
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4ff, #e0eaff)',
        fontFamily: `'Inter', sans-serif`,
      }}
    >
      <div
        style={{
          padding: '2rem',
          borderRadius: '0.75rem',
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
