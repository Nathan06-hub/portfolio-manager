import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from '../styles/Dashboard.module.css';
import { FaArrowUp, FaArrowDown, FaWallet, FaExchangeAlt, FaPlus, FaBullseye } from 'react-icons/fa';

interface SummaryData {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
}

const Dashboard: React.FC = () => {
  const { token, logout } = useAuthContext();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch('/dashboard/summary', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject('Failed')))
        .then((data: SummaryData) => {
          setSummary(data);
          setError('');
        })
        .catch(() => setError('Impossible de charger les données du tableau de bord. Vérifiez que le backend est bien démarré.'))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '0,00 €';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div style={{ width: '100%', maxWidth: '1080px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
            Vue d'ensemble financière
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Suivi en temps réel de votre patrimoine et de vos flux récents
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/transactions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '0.65rem 1.1rem',
              borderRadius: '0.6rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            <FaPlus /> Nouvelle transaction
          </Link>
          <Link
            to="/goals"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text)',
              border: '1px solid var(--card-border)',
              padding: '0.65rem 1.1rem',
              borderRadius: '0.6rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            <FaBullseye style={{ color: 'var(--primary)' }} /> Mes objectifs
          </Link>
        </div>
      </div>

      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Chargement des indicateurs...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            width: '100%',
            maxWidth: '1080px',
            padding: '1rem',
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {summary && (
        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className={styles.title}>Revenus</span>
              <span style={{ color: 'var(--success)', fontSize: '1.2rem' }}><FaArrowUp /></span>
            </div>
            <div className={styles.value} style={{ color: 'var(--success)' }}>
              {formatCurrency(summary.total_income)}
            </div>
          </div>

          <div className={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className={styles.title}>Dépenses</span>
              <span style={{ color: 'var(--danger)', fontSize: '1.2rem' }}><FaArrowDown /></span>
            </div>
            <div className={styles.value} style={{ color: 'var(--danger)' }}>
              {formatCurrency(summary.total_expense)}
            </div>
          </div>

          <div className={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className={styles.title}>Solde</span>
              <span style={{ color: summary.balance >= 0 ? 'var(--primary)' : 'var(--danger)', fontSize: '1.2rem' }}><FaWallet /></span>
            </div>
            <div className={styles.value} style={{ color: summary.balance >= 0 ? 'var(--text)' : 'var(--danger)' }}>
              {formatCurrency(summary.balance)}
            </div>
          </div>

          <div className={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className={styles.title}>Transactions</span>
              <span style={{ color: '#8b5cf6', fontSize: '1.2rem' }}><FaExchangeAlt /></span>
            </div>
            <div className={styles.value}>
              {summary.transaction_count}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={logout}
        style={{
          marginTop: '1.5rem',
          padding: '0.65rem 1.25rem',
          borderRadius: '0.6rem',
          backgroundColor: 'transparent',
          color: 'var(--danger)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;
