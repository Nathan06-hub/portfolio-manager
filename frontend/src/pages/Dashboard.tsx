import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { token, logout } = useAuthContext();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Example call to a protected endpoint (replace with real API when ready)
    if (token) {
      fetch('/dashboard', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject('Failed')))
        .then((data) => setMessage(data.message || 'Dashboard loaded'))
        .catch(() => setMessage('Could not load dashboard data'));
    }
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Tableau de bord</h2>
      <p>{message}</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
};

export default Dashboard;
