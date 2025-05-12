import React from "react";
import { Link } from "react-router-dom";
import styles from "./OrderDetails.module.scss";

export default function OrderDetails() {
  // Пример данных
  const order = {
    id: "334902461",
    date: "Feb 16, 2022",
    status: "Estimated delivery: May 14, 2022",
    statusType: "estimated", // или "delivered"
    products: [
      { name: "MacBook Pro 14”", specs: "Space Gray ｜ 1 TB", price: "$2 399.00", qty: 1 },
      { name: "iPad Pro 12.9”", specs: "Space Gray ｜ 128 GB ｜ Cellular", price: "$2 799.00", qty: 1 },
      { name: "iPhone 13 Pro Max", specs: "Space Gray ｜ 1 TB", price: "$549.00", qty: 1 },
    ],
    payment: { method: "Visa **** 56" },
    summary: {
      subtotal: "$5 400.00",
      discount: "$0.00",
      taxes: "$270.00",
      total: "$5 670.00",
    },
    delivery: {
      address: "847 Jessy Bridge Apt. 174\nLondon, UK",
      shipping: "Free (30 days)",
    },
    help: {
      phone: "(474) 769‑7391",
      orderIssuesUrl: "#",
      returnsUrl: "#",
    },
  };

  return (
    <div className={styles.orderDetails}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.orderId}>Order ID: {order.id}</h2>
          <div className={styles.orderDate}>Order date: {order.date}</div>
        </div>
        <div className={styles.headerRight}>
          <span
            className={`${styles.status} ${
              order.statusType === "estimated"
                ? styles.estimated
                : styles.delivered
            }`}
          >
            {order.status}
          </span>
          <button className={styles.invoiceBtn}>Invoice</button>
          {order.statusType === "estimated" && (
            <Link to={`/profile/track/${order.id}`} className={`${styles.invoiceBtn} ${styles.trackBtn}`}>
              Track order
            </Link>
          )}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Products */}
      <div className={styles.products}>
        {order.products.map((p, i) => (
          <div key={i} className={styles.product}>
            <div className={styles.productInfo}>
              <div className={styles.productName}>{p.name}</div>
              <div className={styles.productSpecs}>{p.specs}</div>
            </div>
            <div className={styles.productMeta}>
              <div className={styles.productPrice}>{p.price}</div>
              <div className={styles.productQty}>Qty: {p.qty}</div>
            </div>
          </div>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* Bottom blocks */}
      <div className={styles.bottom}>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>Payment</h3>
          <div className={styles.blockContent}>{order.payment.method}</div>
        </div>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>Order Summary</h3>
          <div className={styles.blockContent}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{order.summary.subtotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Discount</span>
              <span>{order.summary.discount}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Taxes</span>
              <span>{order.summary.taxes}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{order.summary.total}</span>
            </div>
          </div>
        </div>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>Need help?</h3>
          <div className={styles.blockContent}>
            <div className={styles.helpPhone}>{order.help.phone}</div>
            <div className={styles.helpLinks}>
              <a href={order.help.orderIssuesUrl}>Order issues ›</a>
              <a href={order.help.returnsUrl}>Returns ›</a>
            </div>
          </div>
        </div>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>Delivery</h3>
          <div className={styles.blockContent}>
            <div className={styles.deliveryAddress}>
              {order.delivery.address.split("\n").map((l, idx) => (
                <div key={idx}>{l}</div>
              ))}
            </div>
            <div className={styles.shippingMethod}>{order.delivery.shipping}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
