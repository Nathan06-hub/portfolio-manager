import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/List.module.css';
import { FaArrowUp, FaArrowDown, FaTrashAlt, FaPlusCircle, FaReceipt } from 'react-icons/fa';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: string | number; // 'income' | 'expense' or 0 | 1
}

const Transactions: React.FC = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTx, setNewTx] = useState({ amount: '', description: '', type: 'income' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/transactions/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTransactions(await res.json());
      }
    } catch {
      setError('Impossible de récupérer les transactions');
    }
  };

  const createTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount) return;
    setLoading(true);
    setError('');

    const payload = {
      amount: parseFloat(newTx.amount),
      description: newTx.description,
      type: newTx.type === 'income' ? 0 : 1,
    };

    try {
      const res = await fetch('/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setNewTx({ amount: '', description: '', type: 'income' });
        fetchTransactions();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Échec de l'enregistrement de la transaction");
      }
    } catch {
      setError('Erreur lors de la communication avec le serveur');
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await fetch(`/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const isIncome = (type: string | number) => {
    return type === 'income' || type === 0;
  };

  return (
    <div className={styles.listContainer}>
      <div style={{ width: '100%', maxWidth: '1080px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
          Historique des transactions
        </h1>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Enregistrez et suivez l'ensemble de vos entrées et sorties d'argent
        </p>
      </div>

      {error && (
        <div style={{
          width: '100%',
          maxWidth: '1080px',
          padding: '0.85rem',
          borderRadius: '0.65rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: 'var(--danger)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={createTransaction}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <input
            className={styles.input}
            type="number"
            step="0.01"
            placeholder="Montant (€)"
            value={newTx.amount}
            onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
            required
          />
        </div>
        <div style={{ flex: 2, minWidth: '220px' }}>
          <input
            className={styles.input}
            type="text"
            placeholder="Description (ex: Salaire, Courses, Loyer)"
            value={newTx.description}
            onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
            required
          />
        </div>
        <div style={{ minWidth: '130px' }}>
          <select
            className={styles.input}
            value={newTx.type}
            onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
          >
            <option value="income">Revenu (+)</option>
            <option value="expense">Dépense (-)</option>
          </select>
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          <FaPlusCircle /> {loading ? 'Ajout...' : 'Ajouter'}
        </button>
      </form>

      <div style={{ width: '100%', maxWidth: '1080px' }}>
        {transactions.length === 0 ? (
          <div style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '1rem',
            border: '1px dashed var(--card-border)',
            color: 'var(--text-muted)'
          }}>
            <FaReceipt style={{ fontSize: '2.5rem', marginBottom: '0.85rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>Aucune transaction enregistrée pour le moment.</p>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem' }}>Utilisez le formulaire ci-dessus pour ajouter votre premier flux.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transactions.map((tx) => {
              const income = isIncome(tx.type);
              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.4rem',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.85rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: income ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: income ? 'var(--success)' : 'var(--danger)',
                        fontSize: '1.1rem',
                      }}
                    >
                      {income ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.98rem' }}>
                        {tx.description || 'Sans description'}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {income ? 'Entrée d\'argent' : 'Dépense'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        color: income ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {income ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </div>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      title="Supprimer la transaction"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.4rem',
                        fontSize: '1rem',
                        borderRadius: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
