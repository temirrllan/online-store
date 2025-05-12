import apiClient from './apiClient';

// Получить список продуктов
export const getProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error("Ошибка получения продуктов:", error);
    throw error;
  }
};

// Другие API-функции, например, getProductById, createProduct и т.д.
