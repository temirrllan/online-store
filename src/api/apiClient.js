// Файл: frontend/src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Используем переменную окружения
  headers: {
    'Content-Type': 'application/json',
  },
});

// Пример глобального перехватчика для обработки ответов
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Можно добавить глобальную обработку ошибок, например, уведомления об ошибке авторизации
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
