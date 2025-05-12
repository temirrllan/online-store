// Файл: frontend/src/pages/ProductPage/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import styles from "./ProductPage.module.scss";
import { useAddToFavoritesMutation } from "../../redux/api/apiSlice";
import {
  useAddToCartMutation,
  useGetFavoritesQuery,
  useRemoveFromFavoritesMutation,
} from "../../redux/api/apiSlice";

import { useGetProductByIdQuery } from "../../redux/api/apiSlice";
import Loading from "../../components/UI/Loading";
import Error from "../../components/UI/Error";
import ProductReviews from "../../components/ProductReviews/ProductReviews";



function ProductPage() {
  const [addToFavorites] = useAddToFavoritesMutation();
  const [addToCart] = useAddToCartMutation();
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [addedProductIds, setAddedProductIds] = useState([]);
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    setLoadingProductId(productId);
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      setAddedProductIds((prev) => [...prev, productId]);
      setTimeout(() => {
        setAddedProductIds((prev) => prev.filter((id) => id !== productId));
      }, 3000);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  // 1. Берём productId из URL
  const { productId } = useParams();

  // 2. Делаем запрос GET /v1/catalog/products/:productId
  const { data, error, isLoading } = useGetProductByIdQuery(productId);

  // 3. «Избранное» (локальный стейт)
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: favoritesData } = useGetFavoritesQuery();

  // Устанавливаем isFavorite при получении данных
  useEffect(() => {
    if (favoritesData?.products) {
      const favoriteIds = new Set(
        favoritesData.products.map((item) => item.id)
      );
      setIsFavorite(favoriteIds.has(Number(productId)));
    }
  }, [favoritesData, productId]);

  const handleToggleFavorite = async () => {
    try {
      if (!isFavorite) {
        await addToFavorites(product.id).unwrap();
      } else {
        await removeFromFavorites(product.id).unwrap();
      }
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
    }
  };

  // 4. Функция для рендера звёзд
  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStarSolid}
          className={i < count ? styles.starFilled : styles.starEmpty}
        />
      );
    }
    return stars;
  };

  // 5. Состояние запроса
  if (isLoading) return <Loading />;
  if (error) return <Error message="Ошибка при загрузке товара" />;

  // 6. Если всё ок, у нас есть data
  // Пример ответа:
  // {
  //   "id": 300,
  //   "name": "ThundeRobot ZERO 16",
  //   "category": { "id": 2, "name": "Ноутбуки и компьютеры" },
  //   "images": ["https://..."],
  //   "characteristics": [
  //       { "name": "Вес", "value": "2.6 кг" },
  //       { "name": "Диагональ экрана", "value": "16.0 дюйм" },
  //   ],
  //   "price": 1449989,
  //   "discount": { "amount": 10, "new_price": 1304990.1 }
  // }
  const product = data;
  // Или const { name, category, images, characteristics, price, discount } = data;

  // Подготовим «основное» фото (images[0]) или заглушку
  const mainImage = product.images?.[0] || "/images/noimage.png";

  // Если есть discount, показываем старую/новую цену
  const hasDiscount = product.discount && product.discount.new_price;
  const oldPrice = hasDiscount ? product.price : null;
  const newPrice = hasDiscount ? product.discount.new_price : product.price;

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumbsWrapper}>
          <div className={styles.breadcrumbs}>
            <Link to="/">Главная</Link>
            <span className={styles.separator}>/</span>
            <Link to={`/catalog/${product.category?.id}`}>
              {product.category?.name}
            </Link>
            <span className={styles.separator}>/</span>
            <span>{product.name}</span>
          </div>
        </div>

        <div className={styles.content}>
          {/* ЛЕВАЯ КОЛОНКА - Фото + превью */}
          <div className={styles.left}>
            {product.label && (
              <div className={styles.label}>{product.label}</div>
            )}
            <img
              className={styles.mainImage}
              src={mainImage}
              alt={product.name}
            />
            <div className={styles.thumbnailGallery}>
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`preview-${idx}`}
                  className={styles.thumbnail}
                />
              ))}
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА - Инфо + цена + действия */}
          <div className={styles.right}>
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.meta}>
              <span className={styles.brand}>
                Brand: <Link to="#">Pixsellz</Link>
              </span>
              <span className={styles.status}>
                Status: <span className={styles.inStock}>In Stock</span>
              </span>
            </div>

            <p className={styles.description}>
              Many of us are so used to working on a computer desktop that when
              it comes time to purchase a new computer, we don't consider other
              options.
            </p>

            <div className={styles.priceBox}>
              {oldPrice && <span className={styles.oldPrice}>${oldPrice}</span>}
              <span className={styles.newPrice}>${newPrice}</span>
            </div>

            <div className={styles.actions}>
             
             
              <button
                className={`${styles.addToCartBtn} ${
                  loadingProductId === product.id
                    ? styles.loading
                    : addedProductIds.includes(product.id)
                    ? styles.added
                    : ""
                }`}
                onClick={(e) => handleAddToCart(e, product.id)}
              >
                {loadingProductId === product.id
                  ? "Добавление..."
                  : addedProductIds.includes(product.id)
                  ? "Добавлено"
                  : "Add to cart"}
              </button>

              <button
                className={`${styles.favBtn} ${
                  isFavorite ? styles.favorited : ""
                }`}
                onClick={handleToggleFavorite}
              >
                <FontAwesomeIcon icon={faHeartRegular} />
              </button>
            </div>

            {/* ДЕТАЛИ ТОВАРА */}
            <div className={styles.accordion}>
              <details open>
                <summary>Product Details</summary>
                <ul>
                  {product.characteristics?.map((char, idx) => (
                    <li key={idx}>
                      {char.name}: {char.value}
                    </li>
                  ))}
                </ul>
              </details>

              <details>
                <summary>Shipping Info</summary>
                <p>Standard delivery in 2–4 business days.</p>
              </details>

              <details>
                <summary>About Brand</summary>
                <p>Pixsellz is a popular brand with top-rated quality.</p>
              </details>
            </div>

            {/* ИНФО-БЛОКИ */}
            <div className={styles.infoBoxes}>
              <div className={styles.infoBox}>
                <span>📦</span>
                <p>
                  <strong>Free Delivery</strong>
                  <br />
                  Delivered on Thursday, 10 February 2022
                </p>
              </div>
              <div className={styles.infoBox}>
                <span>↩️</span>
                <p>
                  <strong>Free Returns</strong>
                  <br />
                  Return through your local post office
                </p>
              </div>
              <div className={styles.infoBox}>
                <span>💳</span>
                <p>
                  <strong>Safe Payments</strong>
                  <br />
                  Secure payment with Card or Paypal
                </p>
              </div>
            </div>
          </div>
        </div>
     

      <ProductReviews productId={productId} /> </div>
    </div>
  );
}

export default ProductPage;
