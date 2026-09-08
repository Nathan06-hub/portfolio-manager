// src/pages/Register.tsx
import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaCheckCircle, FaUserPlus } from 'react-icons/fa';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "L'enregistrement a échoué. Veuillez réessayer.");
      }
      navigate('/login');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 0.85rem 0.75rem 2.4rem',
    borderRadius: '0.65rem',
    border: '1px solid var(--card-border)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <AuthLayout>
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '0 0 1.25rem 0',
          textAlign: 'center',
          color: 'var(--text)',
        }}
      >
        Créer un nouveau compte
      </h2>

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '0.6rem',
            padding: '0.75rem',
            fontSize: '0.88rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)' }}>Adresse email</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="ex: jean.dupont@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)' }}>Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <FaLock
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)' }}>Confirmer le mot de passe</label>
          <div style={{ position: 'relative' }}>
            <FaCheckCircle
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Répétez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '0.5rem',
            padding: '0.8rem',
            borderRadius: '0.65rem',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            fontSize: '0.98rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            transition: 'background-color 0.2s, transform 0.1s',
          }}
        >
          <FaUserPlus />
          {loading ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        Vous avez déjà un compte ?{' '}
        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  );
}
