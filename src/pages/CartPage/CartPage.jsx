import React, { useState, useEffect } from "react";
import styles from "./CartPage.module.scss";
import {
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useCreateOrderMutation,
} from "../../redux/api/apiSlice";
import Loading from "../../components/UI/Loading";
import Error from "../../components/UI/Error";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";         // ← не забываем импортировать Link
import empty from "./empty-cart.png"
function CartPage() {
  // Все хуки и состояния
  const { data, error, isLoading } = useGetCartItemsQuery();
  const [removeFromCart, { isLoading: isRemoveLoading }] = useRemoveFromCartMutation();
  const [updateCartQuantity, { isLoading: isUpdateLoading }] = useUpdateCartQuantityMutation();
  const [createOrder, { isLoading: isOrderCreating }] = useCreateOrderMutation();
  
  const [cartItems, setCartItems] = useState([]);
  const [deliveryType, setDeliveryType] = useState("free");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [home, setHome] = useState("");
  const [flat, setFlat] = useState("");
  const [comment, setComment] = useState("");
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [code, setCode] = useState("");

  // При получении данных из API формируем локальную копию корзины
  useEffect(() => {
    if (data?.cart?.products) {
      const mapped = data.cart.products.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        productImage: p.productImage,
        oldPrice: p.oldPrice,
        newPrice: p.newPrice,
        size: p.size || "XL",
        inStock: p.inStock ?? true,
        quantity: p.quantity,
        checked: false,
      }));
      setCartItems(mapped);
    }
  }, [data]);

  // Вычисляем общую сумму заказа
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.newPrice || item.oldPrice || 0) * item.quantity,
    0
  );

  // Функции изменения количества товара, удаления и прочего
  const handleDecreaseQuantity = async (productId, currentQuantity) => {
    if (currentQuantity <= 1) return;
    try {
      setLoadingProductId(productId);
      await updateCartQuantity({ productId, quantity: currentQuantity - 1 }).unwrap();
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: currentQuantity - 1 }
            : item
        )
      );
    } catch (err) {
      console.error("Ошибка уменьшения количества:", err);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleIncreaseQuantity = async (productId, currentQuantity) => {
    try {
      setLoadingProductId(productId);
      await updateCartQuantity({ productId, quantity: currentQuantity + 1 }).unwrap();
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: currentQuantity + 1 }
            : item
        )
      );
    } catch (err) {
      console.error("Ошибка увеличения количества:", err);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await removeFromCart(productId).unwrap();
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Ошибка при удалении товара:", err);
    }
  };

  // Функция применения промокода (если требуется)
  const handleApply = () => {
    console.log("Промокод:", code);
  };

  // Функция для отправки данных заказа
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      const result = await createOrder({
        items,
        street,
        city,
        home,
        flat,
        comment,
        total: totalPrice, // используем определённую переменную totalPrice
      }).unwrap();

      console.log("Заказ успешно создан:", result);

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      alert("Заказ успешно создан!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Ошибка при создании заказа:", err);
      alert("Ошибка при создании заказа");
    }
  };

  // Функция для открытия модального окна
  const handleCheckout = () => {
    if (!cartItems.length) return;
    setIsModalOpen(true);
  };

  // Глобальный флаг загрузки
  const isGlobalLoading =
    isLoading || isRemoveLoading || isUpdateLoading || isOrderCreating || (loadingProductId !== null);

  if (isGlobalLoading) return <Loading />;
  if (error) return <Error message="Ошибка загрузки корзины" />;

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        {/* <h1 className={styles.pageTitle}>Cart</h1> */}
        {cartItems.length === 0 ? (
          // ← пустой стейт
          <div className={styles.emptyState}>
            <div className={styles.emptyCard}>
              <img
      src={empty}
                alt="Пустая корзина"
                className={styles.emptyImage}
              />
              <h2>В вашей корзине пока нет товаров</h2>
              <p>Добавьте что-нибудь из нашего каталога.</p>
              <Link to="/" className={styles.goToCatalogBtn}>
                Перейти в каталог
              </Link>
            </div>
          </div>
      ) : (
        <div className={styles.mainContent}>
          {/* Левая колонка – список товаров */}
          <div className={styles.leftColumn}>
            {cartItems.map((item) => (
              <div key={item.productId} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <div className={styles.itemGap}>
                      <div className={styles.titleRow}>
                        <span className={styles.itemName}>{item.productName}</span>
                      </div>
                      <div className={styles.paramRow}>
                        <span className={styles.oldPrice}>${item.oldPrice.toFixed(2)}</span>
                        {item.inStock ? (
                          <span className={styles.inStock}>In Stock</span>
                        ) : (
                          <span className={styles.outOfStock}>Out of Stock</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.quantityRow}>
                      <button
                        onClick={() =>
                          handleDecreaseQuantity(item.productId, item.quantity)
                        }
                        disabled={loadingProductId === item.productId}
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleIncreaseQuantity(item.productId, item.quantity)
                        }
                        disabled={loadingProductId === item.productId}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.itemsGap}>
                  <div className={styles.priceCol}>
                    ${(item.newPrice || item.oldPrice).toFixed(2)}
                  </div>
                  <div className={styles.actionsCol}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.productId)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Правая колонка */}
          <div className={styles.rightColumn}>
            <div className={styles.deliveryBlock}>
              <h3>Delivery</h3>
              <div className={styles.tabContainer}>
                <input
                  type="radio"
                  id="radioFree"
                  name="delivery"
                  defaultChecked
                  className={styles.radioInput}
                  onChange={() => setDeliveryType("free")}
                />
                <input
                  type="radio"
                  id="radioExpress"
                  name="delivery"
                  className={styles.radioInput}
                  onChange={() => setDeliveryType("express")}
                />
                <div className={styles.labels}>
                  <label htmlFor="radioFree" className={styles.tab}>
                    Free
                  </label>
                  <label htmlFor="radioExpress" className={styles.tab}>
                    Express: $9.99
                  </label>
                </div>
                <span className={styles.glider}></span>
              </div>
              <div className={styles.deliveryDate}>Delivery June 24, 2020</div>
            </div>
            <div className={styles.summaryBlock}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>20% discount</span>
                <span>-$20.00</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{deliveryType === "free" ? "$0.00" : "$9.99"}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${(totalPrice - 20.0 + (deliveryType === "free" ? 0.0 : 9.99)).toFixed(2)}</span>
              </div>
            </div>
            <div className={styles.btnBlock}>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Proceed to checkout
              </button>
              <button className={styles.continueBtn} onClick={() => window.history.back()}>
                Continue shopping
              </button>
            </div>
          </div>
        </div>
         )}
      </div>
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Оформить заказ</h2>
            <form onSubmit={handleSubmitOrder}>
              <div className={styles.formGroup}>
                <label>Улица</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Город</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Дом</label>
                <input
                  type="text"
                  value={home}
                  onChange={(e) => setHome(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Квартира</label>
                <input
                  type="text"
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Комментарий</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <div className={styles.totalBlock}>
                <span>Сумма заказа:</span>
                <strong>{totalPrice.toLocaleString()} ₽</strong>
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </button>
                <button type="submit" disabled={isOrderCreating}>
                  {isOrderCreating ? "Создание..." : "Создать заказ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
