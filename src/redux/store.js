// Файл: src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Импортируем apiSlice
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    // Ваш существующий cartReducer
    cart: cartReducer,

    // Подключаем RTK Query reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
