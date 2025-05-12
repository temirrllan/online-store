// src/components/Header/DesktopNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCartShopping,
  faHeart,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import styles from './DesktopNav.module.scss';

export default function DesktopNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.navItem}>
        <FontAwesomeIcon icon={faBars} className={styles.icon} />
        <span>Каталог</span>
      </NavLink>
      <NavLink to="/cart" className={styles.navItem}>
        <FontAwesomeIcon icon={faCartShopping} className={styles.icon} />
        <span>Корзина</span>
      </NavLink>
      <NavLink to="/favorites" className={styles.navItem}>
        <FontAwesomeIcon icon={faHeart} className={styles.icon} />
        <span>Избранное</span>
      </NavLink>
      <NavLink to="/profile" className={styles.navItem}>
        <FontAwesomeIcon icon={faUser} className={styles.icon} />
        <span>Профиль</span>
      </NavLink>
    </nav>
  );
}
