// Файл: frontend/src/pages/TrackOrder/TrackOrder.jsx
import React from "react";
import styles from "./TrackOrder.module.scss";

function TrackOrder() {
  // Статичные данные для демонстрации
  const orderInfo = {
    isDelivered: true,
    deliveryDateTime: "Saturday, May 14, 2022 11:21",
    signedBy: "Kondo Niradhara",
    orderID: "334920461",
    serviceType: "Export",
    destination: "Singapore",
    status: "Delivered",
    expectedBy: "May 14, 2022",
  };

  // Точки статуса (Prepared, Booking, Arrived, In transit, Out for delivery, Delivered)
  const statusSteps = [
    { label: "Prepared", isDone: true },
    { label: "Booking", isDone: true },
    { label: "Arrived", isDone: true },
    { label: "In transit", isDone: true },
    { label: "Out for delivery", isDone: true },
    { label: "Delivered", isDone: orderInfo.isDelivered },
  ];

  // История перемещений в виде таблицы
  // (имитируем данные по вашему макету: дата, время, локация, действие)
  const trackingHistory = [
    {
      date: "May 14, 2022",
      time: "11:21",
      location: "Singapore",
      activity: "Delivered",
    },
    {
      date: "May 13, 2022",
      time: "20:57",
      location: "London, United Kingdom",
      activity: "Out for delivery",
    },
    {
      date: "May 13, 2022",
      time: "19:30",
      location: "London, United Kingdom",
      activity: "Arrived hub",
    },
    {
      date: "May 13, 2022",
      time: "09:22",
      location: "London, United Kingdom",
      activity: "In transit to destination",
    },
    {
      date: "May 12, 2022",
      time: "07:21",
      location: "London, United Kingdom",
      activity: "Arrived hub",
    },
    {
      date: "May 12, 2022",
      time: "05:17",
      location: "London, United Kingdom",
      activity: "Booking arranged",
    },
    {
      date: "May 11, 2022",
      time: "17:51",
      location: "London, United Kingdom",
      activity: "Prepared",
    },
  ];

  return (
    <div className={styles.trackOrderPage}>
      <h2 className={styles.pageTitle}>Track order</h2>

      {/* Зелёный блок, если заказ доставлен */}
      {orderInfo.isDelivered && (
        <div className={styles.deliveredBlock}>
          <div>
            <strong>Delivered on:</strong> {orderInfo.deliveryDateTime}
          </div>
          <div>Signed by: {orderInfo.signedBy}</div>
        </div>
      )}

      {/* Основная информация: Order ID, Service type, Destination, Status, Expected by */}
      <div className={styles.orderInfo}>
        <div className={styles.infoItem}>
          <span>Order ID</span>
          <strong>{orderInfo.orderID}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Service type</span>
          <strong>{orderInfo.serviceType}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Destination</span>
          <strong>{orderInfo.destination}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Status</span>
          <strong>{orderInfo.status}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Expected by</span>
          <strong>{orderInfo.expectedBy}</strong>
        </div>
      </div>

      {/* Горизонтальная полоска статусов: Prepared, Booking, Arrived, In transit, Out for delivery, Delivered */}
      <div className={styles.statusSteps}>
        {statusSteps.map((step, idx) => (
          <div key={idx} className={styles.step}>
            <div
              className={`${styles.circle} ${step.isDone ? styles.active : ""}`}
            />
            <div className={styles.stepLabel}>{step.label}</div>
          </div>
        ))}
      </div>

      {/* Таблица истории перемещений */}
      <div className={styles.tableWrapper}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {trackingHistory.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{item.location}</td>
                <td>{item.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrackOrder;
