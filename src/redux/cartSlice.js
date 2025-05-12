// Файл: src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Массив товаров в корзине
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      // Логика добавления товара в state.items
      // Пример: action.payload = { id, name, price, quantity, ... }
      const newItem = action.payload;
      state.items.push(newItem);
      state.totalPrice += newItem.price * newItem.quantity;
    },
    removeItem(state, action) {
      // Удаление товара по id
      const idToRemove = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === idToRemove);
      if (itemIndex >= 0) {
        const removedItem = state.items[itemIndex];
        state.totalPrice -= removedItem.price * removedItem.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity(state, action) {
      // Обновляем количество товара
      // action.payload = { id, quantityDelta }
      const { id, quantityDelta } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        // Вычитаем старую стоимость
        state.totalPrice -= item.price * item.quantity;

        // Меняем количество (не меньше 1)
        item.quantity = Math.max(1, item.quantity + quantityDelta);

        // Прибавляем новую стоимость
        state.totalPrice += item.price * item.quantity;
      }
    },
    clearCart(state) {
      // Полностью очищаем корзину
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
