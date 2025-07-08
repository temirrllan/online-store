// Файл: frontend/src/pages/RegistrationPage/RegistrationPage.jsx
import React, { useState } from 'react';
import styles from './RegistrationPage.module.scss';
import { Link, useNavigate } from 'react-router-dom'; // Добавляем useNavigate
// Импортируем функцию регистрации из auth.js
import { registerUser } from '../../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import GoogleLoginButton from './../../components/GoogleLoginButton';


function RegistrationPage() {
    const navigate = useNavigate(); // Хук для перенаправления
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeat, setShowRepeat] = useState(false);
    
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      repeatPassword: '',
      email: '',
      fullName: '',
    });
   
        

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // <-- флаг загрузки
  // Обработка изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработка отправки формы (демо)
    // Отправка формы
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Сбросим ошибки перед проверками
      setErrorMessage('');
      setSuccessMessage('');
    
      // Проверка на пустые поля (без fullName)
      if (
        !formData.username ||
        !formData.password ||
        !formData.email ||
        !formData.repeatPassword
      ) {
        setErrorMessage('Пожалуйста, заполните все обязательные поля.');
        return;
      }
    
      // Проверка совпадения паролей
      if (formData.password !== formData.repeatPassword) {
        setErrorMessage("Пароли не совпадают");
        return;
      }
    
      try {
        setLoading(true);
    
        const response = await registerUser({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
        });
    
        console.log('Ответ от сервера:', response);
    
        setFormData({
          username: '',
          password: '',
          repeatPassword: '',
          email: '',
          fullName: '',
        });
    
        setSuccessMessage('Регистрация прошла успешно!');
        setErrorMessage('');
    
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error('Ошибка регистрации:', error);
    
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || 'Ошибка регистрации');
        } else {
          setErrorMessage('Ошибка соединения с сервером');
        }
      } finally {
        setLoading(false);
      }
    };
    
    

  return (
    <div className={styles.registrationPage}>
         <div className={styles.succesCenter}>
                  {/* Успех */}


         </div>


      <div className={styles.container}>
        <h1 className={styles.title}>Регистрация</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
  <h2 className={styles.heading}>Create account</h2>

  {errorMessage && (
    <div className={styles.errorMessage}>
      <FontAwesomeIcon icon={faCircleXmark} className={styles.errorIcon} />
      <span>{errorMessage}</span>
    </div>
  )}

  {successMessage && (
    <div className={styles.successMessage}>
      <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
      <span>{successMessage}</span>
    </div>
  )}

  {/* Username + Full Name в одной строке */}
  <div className={styles.nameRow}>
    <div className={styles.formGroup}>
      <label>Username</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Input Text"
      />
    </div>

    <div className={styles.formGroup}>
      <label>Full name (optional)</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Optional"
      />
    </div>
  </div>

  <div className={styles.formGroup}>
    <label>Email</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Input Text"
    />
  </div>

  <div className={styles.formGroup}>
    <label>Password</label>
    <div className={styles.passwordWrapper}>
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button
        type="button"
        className={styles.eyeIcon}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  </div>

  <div className={styles.formGroup}>
    <label>Repeat password</label>
    <div className={styles.passwordWrapper}>
      <input
        type={showRepeat ? "text" : "password"}
        name="repeatPassword"
        value={formData.repeatPassword}
        onChange={handleChange}
        placeholder="Repeat password"
      />
      <button
        type="button"
        className={styles.eyeIcon}
        onClick={() => setShowRepeat((prev) => !prev)}
      >
        {showRepeat ? "🙈" : "👁️"}
      </button>
    </div>
  </div>

  <button type="submit" className={styles.submitBtn}>
    Create account
  </button>

  <p className={styles.terms}>
    By clicking the 'Sign Up' button, you confirm that you accept our{' '}
    <Link to="#">Terms of Use</Link> and <Link to="#">Privacy Policy</Link>.
  </p>

  <hr className={styles.divider} />

  <div className={styles.bottomLink}>
    Have an account? <Link to="/login">Log In</Link>
  </div>
  <GoogleLoginButton />
</form>



      </div>
    </div>
  );
}

export default RegistrationPage;
