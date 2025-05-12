// Файл: src/pages/FavoritesPage/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './FavoritesPage.module.scss';

// Импортируем хуки RTK Query
import { 
  useGetFavoritesQuery, 
  useRemoveFromFavoritesMutation, 
  useAddToCartMutation 
} from '../../redux/api/apiSlice';
import Loading from '../../components/UI/Loading';
import Error from '../../components/UI/Error';

function FavoritesPage() {
  // Получаем список избранных товаров
  const { data, error, isLoading } = useGetFavoritesQuery();

  // Мутация для удаления из избранных с получением isLoading
  const [removeFromFavorites, { isLoading: isRemoveLoading }] = useRemoveFromFavoritesMutation();
  // Мутация для добавления товара в корзину с получением isLoading
  const [addToCart, { isLoading: isAddLoading }] = useAddToCartMutation();

  // Вычисляем, если хоть один запрос выполняется, то отображаем глобальный лоадер
  const isMutationLoading = isRemoveLoading || isAddLoading;

  // Локальное состояние для хранения избранных товаров
  const [favoriteItems, setFavoriteItems] = useState([]);

  // Локальное состояние для уведомлений (без alert)
  const [notification, setNotification] = useState({
    type: '', // "success" или "error"
    message: ''
  });

  // Дополнительное состояние для анимации кнопок "В корзину"
  // Ключ: id товара, значение: "idle" | "loading" | "added"
  const [cartAnimation, setCartAnimation] = useState({});

  // При получении данных с сервера сохраняем товары в локальном стейте
  useEffect(() => {
    if (data?.products) {
      setFavoriteItems(data.products);
    }
  }, [data]);

  // Функция для удаления товара из избранного
  const handleDelete = async (id) => {
    try {
      await removeFromFavorites(id).unwrap();
      setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
      setNotification({ type: 'success', message: 'Товар удалён из избранного' });
      setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    } catch (err) {
      console.error('Ошибка при удалении товара:', err);
      setNotification({ type: 'error', message: 'Не удалось удалить товар' });
      setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    }
  };

  // Функция добавления товара в корзину с анимацией на кнопке
  const handleAddToCart = async (item) => {
    // Если уже в состоянии "loading" для данного товара – выходим, чтобы избежать повторных запросов
    if (cartAnimation[item.id] === 'loading') return;

    setCartAnimation((prev) => ({ ...prev, [item.id]: 'loading' }));
    try {
      // Добавляем товар с количеством 1
      await addToCart({ productId: item.id, quantity: 1 }).unwrap();
      setCartAnimation((prev) => ({ ...prev, [item.id]: 'added' }));
      setNotification({ type: 'success', message: `Товар "${item.name}" добавлен в корзину` });
      setTimeout(() => {
        setCartAnimation((prev) => ({ ...prev, [item.id]: 'idle' }));
        setNotification({ type: '', message: '' });
      }, 1500);
    } catch (err) {
      console.error('Ошибка при добавлении в корзину:', err);
      setCartAnimation((prev) => ({ ...prev, [item.id]: 'idle' }));
      setNotification({ type: 'error', message: 'Не удалось добавить товар в корзину' });
      setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message="Ошибка при загрузке избранных товаров" />;

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Избранное</h1>

        {/* Глобальный оверлей loading, показывающий спиннер */}
        {isMutationLoading && <Loading />}

        {/* Уведомление (можно заменить на собственный компонент уведомлений) */}
        {notification.message && (
          <div
            className={`${styles.notification} ${
              notification.type === 'success' ? styles.success : styles.error
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Список избранных товаров */}
        <div className={styles.itemsColumn}>
          {favoriteItems.length === 0 ? (
            <p>У вас нет избранных товаров.</p>
          ) : (
            favoriteItems.map((item) => (
              <div key={item.id} className={styles.favItem}>
                <div className={styles.itemBody}>
                  <div className={styles.itemImage}>
                    {Array.isArray(item.images) ? (
                      <img src={item.images[0]} alt={item.name} />
                    ) : (
                      <img src={item.image} alt={item.name} />
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{item.name}</div>
                    <div className={styles.prices}>
                      {item.oldPrice && (
                        <span className={styles.oldPrice}>
                          {item.oldPrice.toLocaleString()} ₸
                        </span>
                      )}
                      <span className={styles.currentPrice}>
                        {item.price.toLocaleString()} ₸
                      </span>
                    </div>
                  </div>
                </div>
                {/* Блок с кнопками для каждой карточки */}
                <div className={styles.cardActions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                  >
                    Удалить
                  </button>
                  <button
                    className={`
                      ${styles.addToCartBtn} 
                      ${cartAnimation[item.id] === 'loading' ? styles.loading : ''} 
                      ${cartAnimation[item.id] === 'added' ? styles.added : ''}
                    `}
                    onClick={() => handleAddToCart(item)}
                  >
                    В корзину
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;
