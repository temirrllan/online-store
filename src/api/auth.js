import apiClient from './apiClient';

/**
 * Регистрирует нового пользователя.
 * @param {Object} userData - Объект с полями { username, password, email, fullName }.
 * @returns {Object} - Ответ от сервера (например, созданный пользователь или сообщение).
 * @throws {Error} - Если произошла ошибка (можно обработать .response, если нужно).
 */
export async function registerUser(userData) {
  try {
    // Эндпоинт: POST /register
    // Полный URL будет: https://ittalker-online-store-8b609d501d03.herokuapp.com/api/register
    const response = await apiClient.post('/register', userData);
    return response.data;
  } catch (error) {
    // Можно пробросить ошибку наверх, чтобы обрабатывать в компоненте
    throw error;
  }
}




/**
 * Авторизует пользователя (логин).
 * @param {Object} credentials - Объект { username, password }.
 * @returns {Object} - Ответ от сервера, содержащий JWT (например, { token: '...' }).
 * @throws {Error} - Если произошла ошибка.
 */
export async function loginUser(credentials) {
    try {
      // POST /login
      const response = await apiClient.post('/login', credentials);
      return response.data; // Ожидаем, что сервер вернёт что-то вроде { token: '...', ... }
    } catch (error) {
      throw error;
    }
  }