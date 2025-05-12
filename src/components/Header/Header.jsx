// src/components/Header/Header.jsx
import React, { useState } from 'react';
import styles from './Header.module.scss';
import Logo from './Logo';
import SearchWrapper from './SearchWrapper';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import MobileFooter from './MobileFooter';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => setMenuOpen((o) => !o);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Logo />
          <SearchWrapper />
          <DesktopNav />
          <div className={styles.burger} onClick={toggle}>
            {/* можно иконку сюда прямо вставить или в отдельный компонент */}
            <span className={styles.burgerIcon}>☰</span>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={toggle} />
      <MobileFooter />
    </>
  );
}
