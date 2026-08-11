import React from 'react';
import heroImg from '../assets/hero.png';
import typescriptLogo from '../assets/typescript.svg';
import viteLogo from '../assets/vite.svg';

const Dashboard: React.FC = () => {
  return (
    <section id="center">
      <div className="hero">
        <img src={heroImg} className="base" width={170} height={179} alt="Hero" />
        <img src={typescriptLogo} className="framework" alt="TypeScript logo" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
      </div>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your portfolio manager dashboard.</p>
      </div>
      {/* Placeholder for Chart.js canvas */}
      <canvas id="dashboardChart" style={{ width: '100%', height: '300px' }} />
    </section>
  );
};

export default Dashboard;
