// Файл: frontend/src/pages/Payments/Payments.jsx
import React from "react";
import styles from "./Payments.module.scss";

function Payments() {
  // Статичные данные для примера
  const paymentMethods = [
    {
      brand: "Mastercard",
      lastDigits: "34",
      expiry: "11/27",
      holder: "Jane Cooper",
      brandIcon: "MC", // Можно заменить на <img src="..." alt="Mastercard" />
    },
    {
      brand: "Visa",
      lastDigits: "58",
      expiry: "08/27",
      holder: "Jane Cooper",
      brandIcon: "Visa", // Аналогично, можно использовать <img> логотип
    },
  ];

  return (
    <div className={styles.paymentsPage}>
      {/* Хлебные крошки */}
      <div className={styles.breadcrumbs}>Home &gt; Category &gt; Item Page</div>

      {/* Заголовок и кнопка «Add payment +» */}
      <div className={styles.header}>
        <h2>Payments</h2>
        <button className={styles.addPaymentBtn}>Add payment +</button>
      </div>

      {/* Список карт (Payment Cards) */}
      <div className={styles.cardsContainer}>
        {paymentMethods.map((pm, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.cardBrandLine}>
              {/* Бренд с иконкой (можно заменить текстовый "чип" на изображение) */}
              <span className={styles.brandChip}>{pm.brandIcon}</span>
              <span className={styles.brandName}>
                {pm.brand} **{pm.lastDigits}
              </span>
            </div>
            <div className={styles.cardInfo}>
              <span>Exp: {pm.expiry}</span>
              <br />
              <span>{pm.holder}</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.actionLink}>Edit</button>
              <button className={styles.actionLink}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Payments;
