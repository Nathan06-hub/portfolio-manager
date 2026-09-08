import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/List.module.css';
import { FaTags, FaPlusCircle, FaTrashAlt, FaTag } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/categories/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCategories(await res.json());
    } catch {
      setError('Impossible de charger les catégories');
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        setNewName('');
        fetchCategories();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Impossible de créer la catégorie");
      }
    } catch {
      setError('Erreur lors de la communication avec le serveur');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await fetch(`/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  return (
    <div className={styles.listContainer}>
      <div style={{ width: '100%', maxWidth: '1080px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
          Gestion des catégories
        </h1>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Classez vos dépenses et revenus pour obtenir des analyses claires
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

      <form className={styles.form} onSubmit={createCategory}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            className={styles.input}
            type="text"
            placeholder="Nom de la catégorie (ex: Alimentation, Salaire, Loisirs)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          <FaPlusCircle /> {loading ? 'Ajout...' : 'Ajouter'}
        </button>
      </form>

      <div style={{ width: '100%', maxWidth: '1080px' }}>
        {categories.length === 0 ? (
          <div style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '1rem',
            border: '1px dashed var(--card-border)',
            color: 'var(--text-muted)'
          }}>
            <FaTags style={{ fontSize: '2.5rem', marginBottom: '0.85rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>Aucune catégorie créée pour le moment.</p>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem' }}>Créez votre première catégorie pour organiser vos flux.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 1.1rem',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '999px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                }}
              >
                <FaTag style={{ color: 'var(--primary)', fontSize: '0.85rem' }} />
                <span>{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  title="Supprimer la catégorie"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.15rem',
                    marginLeft: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
