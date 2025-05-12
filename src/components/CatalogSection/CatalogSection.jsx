import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Для навигации
import styles from './CatalogSection.module.scss';
import { useGetAllCatalogsQuery } from '../../redux/api/apiSlice';
import Loading from '../UI/Loading';
import Error from '../UI/Error';

function CatalogSection() {
  const scrollerRef = useRef(null);
  const navigate = useNavigate();

  // Запрос через RTK Query
  const { data, error, isLoading } = useGetAllCatalogsQuery();
  // Массив категорий
  const categories = data?.catalog || [];

  // Прокрутка влево
  const handleScrollLeft = () => {
    scrollerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  // Прокрутка вправо
  const handleScrollRight = () => {
    scrollerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // При загрузке/ошибке — тот же код
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error message="Ошибка при загрузке каталогов" />;
  }


  
  // Функция, вызываемая при клике по карточке
  const handleClickCategory = (id) => {
    // Переходим на /catalog/:id
    navigate(`/catalog/${id}`);
  };
  return (
    <div className={styles.catalog}>
      <div className={styles.catalogInner}>
        <h2 className={styles.catalogTitle}>Каталог</h2>

        <div className={styles.scrollerContainer}>
          {/* ЛЕВАЯ КНОПКА — ВСЕГДА ВИДИМА */}
          <button
            className={`${styles.arrowButton} ${styles.leftArrow}`}
            onClick={handleScrollLeft}
          >
            ❮
          </button>

          {/* Горизонтальный скроллер */}
          <div className={styles.scroller} ref={scrollerRef}>
            {categories.map((cat) => (
              <div key={cat.id} className={styles.card}  onClick={() => handleClickCategory(cat.id)} >
                <div className={styles.imageWrapper}>
                  <img src={cat.image_url} alt={cat.name} />
                </div>
                <div className={styles.categoryName}>{cat.name}</div>
              </div>
            ))}
          </div>

          {/* ПРАВАЯ КНОПКА — ВСЕГДА ВИДИМА */}
          <button
            className={`${styles.arrowButton} ${styles.rightArrow}`}
            onClick={handleScrollRight}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
}

export default CatalogSection;
