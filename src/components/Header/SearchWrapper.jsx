// src/components/Header/SearchWrapper.jsx
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import styles from './SearchWrapper.module.scss';

export default function SearchWrapper() {
  return (
    <div className={styles.searchWrapper}>
      <SearchBar />
    </div>
  );
}
