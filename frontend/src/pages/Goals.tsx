import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Goals.module.css';
import {
  FaBullseye,
  FaPlusCircle,
  FaTrashAlt,
  FaCalendarAlt,
  FaPiggyBank,
  FaWallet,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

interface SummaryData {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
}

export const Goals: React.FC = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [newGoal, setNewGoal] = useState({ name: '', target_amount: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [contributions, setContributions] = useState<{ [goalId: number]: string }>({});

  const fetchGoalsAndBalance = async () => {
    try {
      const [goalsRes, summaryRes] = await Promise.all([
        fetch('/goals/', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (goalsRes.ok) setGoals(await goalsRes.json());
      if (summaryRes.ok) setSummary(await summaryRes.json());
    } catch {
      setError('Impossible de charger vos données financières');
    }
  };

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target_amount) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const payload = {
      name: newGoal.name,
      target_amount: parseFloat(newGoal.target_amount),
      deadline: newGoal.deadline ? new Date(newGoal.deadline).toISOString() : null,
    };

    try {
      const res = await fetch('/goals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNewGoal({ name: '', target_amount: '', deadline: '' });
        setSuccessMsg(`L'objectif "${payload.name}" a été créé avec succès !`);
        fetchGoalsAndBalance();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Échec de la création de l'objectif");
      }
    } catch {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSavings = async (goal: Goal) => {
    setError('');
    setSuccessMsg('');
    const amountStr = contributions[goal.id];
    const amountToAdd = parseFloat(amountStr);

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      setError('Veuillez saisir un montant positif valide.');
      return;
    }

    const availableBalance = summary ? summary.balance : 0;
    if (amountToAdd > availableBalance) {
      setError(
        `Fonds insuffisants : vous souhaitez épargner ${formatCurrency(amountToAdd)}, mais votre solde actuel n'est que de ${formatCurrency(availableBalance)}.`
      );
      return;
    }

    const newCurrent = (goal.current_amount || 0) + amountToAdd;

    try {
      const res = await fetch(`/goals/${goal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_amount: newCurrent }),
      });

      if (res.ok) {
        setContributions({ ...contributions, [goal.id]: '' });
        setSuccessMsg(`Félicitations ! Vous avez versé ${formatCurrency(amountToAdd)} vers "${goal.name}".`);
        fetchGoalsAndBalance();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Échec de la mise à jour de l'épargne");
      }
    } catch {
      setError("Erreur lors de l'enregistrement de l'épargne");
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      await fetch(`/goals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoalsAndBalance();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    if (token) fetchGoalsAndBalance();
  }, [token]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
  };

  return (
    <div className={styles.container}>
      {/* En-tête avec solde disponible */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Objectifs d'épargne</h1>
          <p className={styles.subtitle}>
            Définissez vos projets financiers, alimentez votre cagnotte et suivez votre progression
          </p>
        </div>

        {summary && (
          <div className={styles.balanceCard}>
            <div className={styles.balanceIcon}>
              <FaWallet />
            </div>
            <div>
              <div className={styles.balanceLabel}>Solde disponible</div>
              <div
                className={styles.balanceValue}
                style={{ color: summary.balance >= 0 ? 'var(--text)' : 'var(--danger)' }}
              >
                {formatCurrency(summary.balance)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages d'alerte */}
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <FaExclamationCircle style={{ marginRight: '0.5rem' }} />
          <strong>Attention :</strong> {error}
        </div>
      )}

      {successMsg && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          <FaCheckCircle style={{ marginRight: '0.5rem' }} />
          {successMsg}
        </div>
      )}

      {/* Formulaire de création moderne */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <FaBullseye style={{ color: 'var(--primary)' }} />
          <span>Créer un nouvel objectif d'épargne</span>
        </div>
        <form onSubmit={createGoal} className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nom du projet</label>
            <input
              className={styles.input}
              type="text"
              placeholder="ex: Vacances, Urgence, Voiture..."
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Montant cible (€)</label>
            <input
              className={styles.input}
              type="number"
              step="10"
              placeholder="ex: 1500"
              value={newGoal.target_amount}
              onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Date d'échéance (optionnelle)</label>
            <input
              className={styles.input}
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            />
          </div>

          <button className={styles.createBtn} type="submit" disabled={loading}>
            <FaPlusCircle /> {loading ? 'Création...' : "Créer l'objectif"}
          </button>
        </form>
      </div>

      {/* Grille des objectifs */}
      <div style={{ width: '100%' }}>
        {goals.length === 0 ? (
          <div className={styles.emptyState}>
            <FaBullseye style={{ fontSize: '2.75rem', marginBottom: '0.85rem', opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>Aucun objectif pour le moment.</p>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem' }}>
              Définissez votre premier projet d'épargne avec le formulaire ci-dessus.
            </p>
          </div>
        ) : (
          <div className={styles.goalsGrid}>
            {goals.map((g) => {
              const current = g.current_amount || 0;
              const target = g.target_amount || 1;
              const percent = Math.min(Math.round((current / target) * 100), 100);
              const isCompleted = percent >= 100;
              const remaining = Math.max(0, target - current);

              return (
                <div key={g.id} className={styles.goalCard}>
                  {/* Haut de la carte */}
                  <div>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardTitleWrapper}>
                        <div
                          className={styles.cardIcon}
                          style={{
                            backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                            color: isCompleted ? 'var(--success)' : 'var(--primary)',
                          }}
                        >
                          <FaPiggyBank />
                        </div>
                        <h3 className={styles.cardTitle}>{g.name}</h3>
                      </div>

                      <button
                        onClick={() => deleteGoal(g.id)}
                        className={styles.deleteBtn}
                        title="Supprimer l'objectif"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>

                    {/* Barre de progression */}
                    <div className={styles.progressSection} style={{ marginTop: '1.25rem' }}>
                      <div className={styles.progressRow}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Progression</span>
                        <span
                          className={styles.progressBadge}
                          style={{
                            backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.12)',
                            color: isCompleted ? 'var(--success)' : 'var(--primary)',
                          }}
                        >
                          {percent}% {isCompleted ? '• Atteint !' : ''}
                        </span>
                      </div>

                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            width: `${percent}%`,
                            background: isCompleted
                              ? 'linear-gradient(90deg, #10b981, #059669)'
                              : 'linear-gradient(90deg, #4f46e5, #818cf8)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Résumé financier 3 colonnes */}
                    <div className={styles.statsGrid} style={{ marginTop: '1.1rem' }}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Épargné</span>
                        <span className={styles.statValue} style={{ color: 'var(--text)' }}>
                          {formatCurrency(current)}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Cible</span>
                        <span className={styles.statValue} style={{ color: 'var(--text-muted)' }}>
                          {formatCurrency(target)}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Reste</span>
                        <span
                          className={styles.statValue}
                          style={{ color: isCompleted ? 'var(--success)' : 'var(--primary)' }}
                        >
                          {formatCurrency(remaining)}
                        </span>
                      </div>
                    </div>

                    {/* Section Alimenter l'épargne */}
                    <div className={styles.saveSection} style={{ marginTop: '1rem' }}>
                      <div className={styles.saveLabel}>
                        <FaPiggyBank style={{ color: 'var(--primary)' }} />
                        <span>Alimenter cet objectif</span>
                      </div>

                      <div className={styles.saveInputRow}>
                        <input
                          type="number"
                          step="1"
                          min="1"
                          placeholder="Montant (€)"
                          value={contributions[g.id] || ''}
                          onChange={(e) => setContributions({ ...contributions, [g.id]: e.target.value })}
                          className={styles.saveInput}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSavings(g)}
                          className={styles.saveBtn}
                          title="Verser ce montant"
                        >
                          <FaPlusCircle /> Épargner
                        </button>
                      </div>

                      {/* Raccourcis rapides */}
                      <div className={styles.quickChips}>
                        {[20, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            className={styles.chip}
                            onClick={() => setContributions({ ...contributions, [g.id]: String(amt) })}
                          >
                            +{amt} €
                          </button>
                        ))}
                        {summary && summary.balance > 0 && (
                          <button
                            type="button"
                            className={styles.chip}
                            style={{ color: 'var(--primary)', borderColor: 'rgba(79, 70, 229, 0.4)' }}
                            onClick={() =>
                              setContributions({
                                ...contributions,
                                [g.id]: String(Math.min(summary.balance, remaining > 0 ? remaining : summary.balance)),
                              })
                            }
                          >
                            Solde max
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pied de carte */}
                  {g.deadline && (
                    <div className={styles.cardFooter}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaCalendarAlt style={{ opacity: 0.7 }} />
                        <span>
                          Échéance : {new Date(g.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
