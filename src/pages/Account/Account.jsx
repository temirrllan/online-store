import React, { useEffect, useState } from "react";
import styles from "./Account.module.scss";

function Account() {
  // Состояние для имени (username)
  const [username, setUsername] = useState("");

  // При монтировании считываем username из localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Обработчик изменения поля ввода
  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  // Обработчик сохранения данных
  const handleSave = () => {
    localStorage.setItem("username", username);
    alert("Данные сохранены!");
  };

  return (
    <div className={styles.account}>
      <h2 className={styles.title}>Личные данные</h2>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="name"
          value={username}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <button className={styles.saveBtn} onClick={handleSave}>
        Сохранить
      </button>
    </div>
  );
}

export default Account;
