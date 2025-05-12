import React from "react";
import styles from "./Delivery.module.scss";

export default function Delivery() {
  // Пример статичных адресов
  const addresses = [
    {
      name: "Jane Cooper",
      addressLine1: "6391 Elgin St. Celina",
      addressLine2: "Delaware, US",
      phone: "(907) 555-0101",
    },
    {
      name: "Jane Cooper",
      addressLine1: "3891 Ranchview Dr. Richardson",
      addressLine2: "California, US",
      phone: "(316) 555-0116",
    },
  ];

  return (
    <div className={styles.deliveryPage}>
      {/* Хлебные крошки */}
      <nav className={styles.breadcrumbs}>
        Home &gt; Category &gt; Delivery
      </nav>

      {/* Заголовок + кнопка */}
      <div className={styles.header}>
        <h2 className={styles.title}>Delivery</h2>
        <button className={styles.addAddressBtn}>Add address +</button>
      </div>

      {/* Список адресов */}
      <div className={styles.addressContainer}>
        {addresses.map((addr, idx) => (
          <div key={idx} className={styles.addressCard}>
            <div className={styles.name}>{addr.name}</div>
            <div className={styles.line}>{addr.addressLine1}</div>
            <div className={styles.line}>{addr.addressLine2}</div>
            <div className={styles.phone}>{addr.phone}</div>
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
