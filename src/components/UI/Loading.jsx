// Файл: frontend/src/components/UI/Loading.jsx
import React from 'react';
import styles from './Loading.module.scss';

function Loading() {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.threeBody}>
        <div className={styles.threeBodyDot}></div>
        <div className={styles.threeBodyDot}></div>
        <div className={styles.threeBodyDot}></div>
      </div>
    </div>
  );
}

export default Loading;
