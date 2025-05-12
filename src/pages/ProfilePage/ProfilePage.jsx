// File: frontend/src/pages/ProfilePage/ProfilePage.jsx

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./ProfilePage.module.scss";
import {
  faUser,
  faBoxOpen,
  faKey,
  faTruck,
  faCreditCard
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const tabs = [
  { to: "/profile/account",  label: "Account",  icon: faUser },
  { to: "/profile/orders",   label: "Orders",   icon: faBoxOpen },
  { to: "/profile/password", label: "Password", icon: faKey },
  { to: "/profile/delivery", label: "Delivery", icon: faTruck },
  { to: "/profile/payments", label: "Payments", icon: faCreditCard },
];

function ProfilePage() {
  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Вместо sidebar — адаптивная панель табов */}
        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `${styles.tabItem} ${isActive ? styles.active : ""}`
              }
            >
              <FontAwesomeIcon icon={tab.icon} className={styles.icon} />
              <span className={styles.label}>{tab.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Контент выбранной страницы */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
