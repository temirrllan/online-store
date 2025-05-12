// src/components/Header/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link to="/" className={styles.logoLink}>
        ITtalkerShop
      </Link>
    </div>
  );
}
