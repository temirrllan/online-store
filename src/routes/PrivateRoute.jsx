// Файл: src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Нет токена — редиректим
    return <Navigate to="/login" replace />;
  }

  // (Опционально) если хотите проверить истёк ли, можно декодировать
  // const decoded = jwt_decode(token);
  // if (decoded.exp < Date.now()/1000) {
  //   // Токен истёк
  //   localStorage.removeItem('token');
  //   return <Navigate to="/login" replace />;
  // }

  // Иначе показываем защищённую страницу
  return children;
}

export default PrivateRoute;
