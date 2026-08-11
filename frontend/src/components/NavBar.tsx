import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const linkClass = 'nav-link';
  const activeClass = 'nav-link-active';
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? `${linkClass} ${activeClass}` : linkClass} end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? `${linkClass} ${activeClass}` : linkClass}>
            Transactions
          </NavLink>
        </li>
        <li>
          <NavLink to="/goals" className={({ isActive }) => isActive ? `${linkClass} ${activeClass}` : linkClass}>
            Goals
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
