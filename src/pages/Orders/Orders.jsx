import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "./Orders.module.scss";

export default function Orders() {
  const ordersData = [
    {
      id: "334920461",
      date: "Feb 16, 2022",
      deliveryMethod: "Express (7–14 days)",
      itemsCount: 3,
      totalAmount: "$549.00",
      statusText: "Estimated delivery: May 14, 2022",
      statusType: "estimated",
      products: [
        {
          name: "MacBook Pro 14″",
          specs: "Space Gray ｜ 1 TB",
          price: "$2 399.00",
        },
        {
          name: "iPad Pro 12.9″",
          specs: "Space Gray ｜ 128 GB ｜ Cellular",
          price: "$2 799.00",
        },
        {
          name: "iPhone 13 Pro Max",
          specs: "Space Gray ｜ 1 TB",
          price: "$549.00",
        },
      ],
    },
    {
      id: "334902829",
      date: "Jan 8, 2022",
      deliveryMethod: "Free (30 days)",
      itemsCount: 1,
      totalAmount: "$549.00",
      statusText: "Delivered on May 14, 2022",
      statusType: "delivered",
      products: [
        {
          name: "AirPods Max",
          specs: "Space Gray",
          price: "$549.00",
        },
      ],
    },
  ];

  return (
    <div className={styles.ordersPage}>
      {/* хлебные крошки */}
      <nav className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <span className={styles.sep}>›</span>
        <Link to="/account">Account</Link>
        <span className={styles.sep}>›</span>
        <span>Orders</span>
      </nav>

      <h2 className={styles.pageTitle}>Orders</h2>

      {ordersData.map((order) => (
        <div key={order.id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <div className={styles.orderID}>Order ID: {order.id}</div>
            <div className={styles.orderActions}>
              <span
                className={`${styles.deliveryStatus} ${
                  order.statusType === "estimated"
                    ? styles.estimated
                    : styles.delivered
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    order.statusType === "estimated" ? faTruck : faCheckCircle
                  }
                  className={styles.statusIcon}
                />
                {order.statusText}
              </span>
              <Link
                to={`/profile/orders/${order.id}`}
                className={styles.btn}
              >
                View order
              </Link>
              {order.statusType === "estimated" && (
                <Link
                  to={`/profile/track/${order.id}`}
                  className={`${styles.btn} ${styles.trackBtn}`}
                >
                  Track order
                </Link>
              )}
            </div>
          </div>

          <div className={styles.orderDetails}>
            <div>
              <div className={styles.orderGap}><span className={styles.detailLabel}>Order date</span></div>
              <span>{order.date}</span>
            </div>
            <div>
            <div className={styles.orderGap}> <span className={styles.detailLabel}>Delivery method</span></div>
              <span>{order.deliveryMethod}</span>
            </div>
            <div>
            <div className={styles.orderGap}><span className={styles.detailLabel}>Items</span></div>
              <span>{order.itemsCount}</span>
            </div>
            <div>
            <div className={styles.orderGap}><span className={styles.detailLabel}>Total amount</span></div>
              <span>{order.totalAmount}</span>
            </div>
          </div>

          <div className={styles.productList}>
            {order.products.map((p, i) => (
              <div key={i} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <div className={styles.productImage} />
                  <div className={styles.productText}>
                    <div className={styles.productName}>{p.name}</div>
                    {p.specs && (
                      <div className={styles.productSpecs}>{p.specs}</div>
                    )}
                  </div>
                </div>
                <div className={styles.productMeta}>
                  <div className={styles.productPrice}>{p.price}</div>
                  <div className={styles.productQty}>Qty: 1</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
