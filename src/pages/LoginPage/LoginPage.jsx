// Файл: frontend/src/pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import { loginUser } from '../../api/auth'; // Импорт функции

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/";
  

  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);  
  // Обработка изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Сбрасываем ошибки и успех
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.username || !formData.password) {
      setErrorMessage('Пожалуйста, введите имя пользователя и пароль.');
      return;
    }

    try {
      setLoading(true);

      // Запрос к API
      const response = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      console.log('Ответ от сервера:', response);

      // Предположим, сервер возвращает { token: '...' } 
      // Сохраняем token в localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      localStorage.setItem('username', formData.username);
      setSuccessMessage('Вход выполнен успешно!');
      setFormData({ username: '', password: '' });

      // Перенаправляем пользователя, например, на главную или профиль
      setTimeout(() => {
        navigate(redirectTo, { replace: true });

      }, 100);

    } catch (error) {
      console.error('Ошибка входа:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Ошибка при входе');
      } else {
        setErrorMessage('Ошибка соединения с сервером');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>


{loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner}></div>
            </div>
          )}



      <div className={styles.container}>
        <h1 className={styles.title}></h1>

        <form className={styles.form} onSubmit={handleSubmit}>
  <h2 className={styles.heading}>Log in</h2>

  <div className={styles.formGroup}>
    <label htmlFor="username">Username</label>
    <input
      type="text"
      name="username"
      id="username"
      value={formData.username}
      onChange={handleChange}
      placeholder="Input Text"
    />
  </div>

  <div className={styles.formGroup}>
    <label htmlFor="password">Password</label>
    <div className={styles.passwordWrapper}>
      <input
      type={showPassword ? "text" : "password"}
      name="password"
        id="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Input Text"
      />
       <button
      type="button"
      className={styles.eyeIcon}
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label="Показать/скрыть пароль"
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
    </div>
  </div>
  {errorMessage && (
  <div className={styles.errorMessage}>
    {errorMessage}
  </div>
)}
  <div className={styles.row}>
    <label className={styles.checkbox}>
      <input type="checkbox" />
      <span>Remember me</span>
    </label>
    <Link to="/forgot-password" className={styles.forgotPassword}>
      Forgot Password
    </Link>
  </div>

  <button type="submit" className={styles.loginBtn}>Login</button>

  <hr className={styles.divider} />

  <div className={styles.signupLink}>
    Have an account? <Link to="/register">Sign up</Link>
  </div>
</form>

      </div>
    </div>
  );
}

export default LoginPage;
