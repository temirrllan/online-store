// src/components/Header/MobileFooter.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCartShopping,
  faHeart,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import styles from './MobileFooter.module.scss';

export default function MobileFooter() {
  return (
    <footer className={styles.footer}>
      {[
        { to: '/', icon: faBars, label: 'Каталог' },
        { to: '/cart', icon: faCartShopping, label: 'Корзина' },
        { to: '/favorites', icon: faHeart, label: 'Избранное' },
        { to: '/profile', icon: faUser, label: 'Профиль' },
      ].map(({ to, icon, label }) => (
        <NavLink key={to} to={to} className={styles.link}>
          <FontAwesomeIcon icon={icon} />
          <span>{label}</span>
        </NavLink>
      ))}
    </footer>
  );
}
