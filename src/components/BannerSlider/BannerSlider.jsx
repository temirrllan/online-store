import React from "react";
import styles from "./BannerSection.module.scss";

function BannerSection() {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerInner}>
        
        {/* Обычный текст (для десктопа) */}
        <div className={styles.bannerText}>
          <h2>Умная колонка</h2>
          <h1>Скидка 30%</h1>
          <p>Скидка 30% при покупке второго товара</p>
        </div>

        {/* Изображение (для десктопа) */}
        <div className={styles.bannerImage}>
          <img src="/images/banner1.png" alt="Колонка Алиса" />
        </div>

        {/* Анимированная бегущая строка, которая будет видна только на мобильных (≤1024px) */}
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeContent}>
            <span>Умная колонка • Телефоны • Ноутбуки • Холодильники • Скидка 30% при покупке второго товара </span>
           
          </div>
        </div>

      </div>
    </div>
  );
}

export default BannerSection;
