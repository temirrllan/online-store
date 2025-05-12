// src/components/Header/MobileMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCartShopping,
  faHeart,
  faUser,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import styles from './MobileMenu.module.scss';

export default function MobileMenu({ open, onClose }) {
  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.menu} ${open ? styles.open : ''}`}>
        <div className={styles.content}>
          <button className={styles.close} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <nav className={styles.nav}>
            {[
              { to: '/', icon: faBars, label: 'Каталог' },
              { to: '/cart', icon: faCartShopping, label: 'Корзина' },
              { to: '/favorites', icon: faHeart, label: 'Избранное' },
              { to: '/profile', icon: faUser, label: 'Профиль' },
            ].map(({ to, icon, label }) => (
              <NavLink key={to} to={to} className={styles.item} onClick={onClose}>
                <FontAwesomeIcon icon={icon} className={styles.icon} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
