// File: frontend/src/pages/CategoryPage/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faHeartRegular,
  faArrowLeft,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import {
  useGetAllCatalogsQuery,
  useGetProductFiltersQuery,
  useGetProductsByCatalogIdQuery,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useAddToCartMutation,
  useGetCatalogTotalQuery
} from '../../redux/api/apiSlice';
import Loading from '../../components/UI/Loading';
import Error from '../../components/UI/Error';
import styles from './CategoryPage.module.scss';

function CategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const catalogId = Number(id);

  // локальное состояние для отображения ошибки
  const [errorMessage, setErrorMessage] = useState(null);

  // состояния и запросы
  const {
    data: filtersData,
    isLoading: filtersLoading,
    error: filtersError
  } = useGetProductFiltersQuery(catalogId);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [viewType, setViewType] = useState('grid');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedRange, setSelectedRange] = useState({ min: null, max: null });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: catalogsData } = useGetAllCatalogsQuery();
  const currentCatalog =
    catalogsData?.catalog?.find(c => c.id === catalogId) || {};

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError
  } = useGetProductsByCatalogIdQuery({ catalogId, page: currentPage, pageSize });

  const {
    data: favoritesData,
    isLoading: favLoading,
    error: favError
  } = useGetFavoritesQuery();

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [addToCart] = useAddToCartMutation();

  // Собираем список продуктов с признаком избранного
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    if (productsData?.products && favoritesData?.products) {
      const favIds = new Set(favoritesData.products.map(p => p.id));
      setProductList(
        productsData.products.map(p => ({
          ...p,
          isFavorite: favIds.has(p.id)
        }))
      );
    }
  }, [productsData, favoritesData]);

  const { data: totalData } = useGetCatalogTotalQuery(catalogId);
  const totalItems = totalData?.products?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Обработка ошибок из RTK Query
  useEffect(() => {
    if (productsError) setErrorMessage('Ошибка при загрузке товаров');
    else if (favError) setErrorMessage('Ошибка при загрузке избранного');
    else if (filtersError) setErrorMessage('Ошибка при загрузке фильтров');
  }, [productsError, favError, filtersError]);

  // Обработчики фильтров, избранного и корзины
  const handleCheckboxChange = (fid, vid) => {
    setSelectedFilters(prev => {
      const cur = prev[fid] || [];
      return {
        ...prev,
        [fid]: cur.includes(vid) ? cur.filter(x => x !== vid) : [...cur, vid]
      };
    });
  };
  const handleRangeChange = (k, v) =>
    setSelectedRange(prev => ({ ...prev, [k]: Number(v) }));
  const handleViewChange = t => setViewType(t);

  const [loadingProductId, setLoadingProductId] = useState(null);
  const [addedProductIds, setAddedProductIds] = useState([]);

  const handleAddToCart = async (e, pid) => {
    e.stopPropagation();
    setLoadingProductId(pid);
    try {
      await addToCart({ productId: pid, quantity: 1 }).unwrap();
      setAddedProductIds(a => [...a, pid]);
      setTimeout(() => setAddedProductIds(a => a.filter(x => x !== pid)), 3000);
    } catch {
      /* сюда можно добавить setErrorMessage('Ошибка при добавлении в корзину') */
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleToggleFavorite = async (e, pid, curFav) => {
    e.stopPropagation();
    try {
      if (!curFav) await addToFavorites(pid).unwrap();
      else await removeFromFavorites(pid).unwrap();
      setProductList(pl =>
        pl.map(p => (p.id === pid ? { ...p, isFavorite: !p.isFavorite } : p))
      );
    } catch {
      /* setErrorMessage('Ошибка при работе с избранным') */
    }
  };

  const handlePrev = () => currentPage > 1 && setCurrentPage(p => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const goPage = p => p >= 1 && p <= totalPages && setCurrentPage(p);
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [currentPage]);

  // Показываем прелоадер пока грузим
  if (productsLoading || favLoading || filtersLoading) return <Loading />;

  // Если возникла ошибка — показываем модалку Error и ничего больше
  if (errorMessage) {
    return (
      <Error
        message={errorMessage}
        onClose={() => {
          setErrorMessage(null);
          navigate(-1);
        }}
      />
    );
  }

  return (
    <div className={styles.categoryPage}>
      {/* Мобильный хедер */}
      <div className={styles.mobileHeader}>
        <button
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          aria-label="Назад"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className={styles.mobileTitle}>{currentCatalog.name}</h2>
        <button
          className={styles.mobileFilterBtn}
          onClick={() => setFiltersOpen(open => !open)}
          aria-label="Фильтры"
        >
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>

      {/* Десктоп-хлебные крошки и заголовок */}
      <div className={styles.desktopHeader}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Главная</Link>
          <span className={styles.separator}>/</span>
          <span>{currentCatalog.name}</span>
        </nav>
        <h1 className={styles.title}>{currentCatalog.name}</h1>
      </div>

      <div className={styles.content}>
        {/* Фильтры — показываем только если есть хотя бы один фильтр */}
        {filtersData?.filters?.length > 0 && (
          <aside
            className={`${styles.filters} ${
              filtersOpen ? styles.filtersOpen : ''
            }`}
          >
            {filtersData.filters.map(filter => (
              <div key={filter.filter_id} className={styles.filterGroup}>
                <h3 className={styles.filtersTitle}>
                  {filter.filter_name}
                </h3>
                {filter.filter_type === 'checkbox' && (
                  <ul className={styles.filtersList}>
                    {filter.values.map(val => (
                      <li key={val.value_id}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={
                              selectedFilters[filter.filter_id]?.includes(
                                val.value_id
                              ) ?? false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                filter.filter_id,
                                val.value_id
                              )
                            }
                          />
                          <span>{val.value_name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {filter.filter_type === 'range' && (
                  <div className={styles.rangeFilter}>
                    <div>
                      <label>От:</label>
                      <input
                        type="number"
                        placeholder={filter.values.min_price}
                        value={selectedRange.min ?? ''}
                        onChange={e =>
                          handleRangeChange('min', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label>До:</label>
                      <input
                        type="number"
                        placeholder={filter.values.max_price}
                        value={selectedRange.max ?? ''}
                        onChange={e =>
                          handleRangeChange('max', e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.rangeInfo}>
                      {filter.values.min_price}₸ –{' '}
                      {filter.values.max_price}₸
                    </div>
                  </div>
                )}
              </div>
            ))}
          </aside>
        )}

        {/* Список товаров */}
        <main className={styles.productsArea}>
          <div className={styles.topBar}>
            <div className={styles.sorting}>
              <label>Сортировка:</label>
              <select>
                <option>По популярности</option>
                <option>По возрастанию цены</option>
                <option>По убыванию цены</option>
                <option>По новизне</option>
              </select>
            </div>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${
                  viewType === 'grid' ? styles.active : ''
                }`}
                onClick={() => handleViewChange('grid')}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
                </svg>
              </button>
              <button
                className={`${styles.viewBtn} ${
                  viewType === 'list' ? styles.active : ''
                }`}
                onClick={() => handleViewChange('list')}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={
              viewType === 'grid'
                ? styles.productsGrid
                : styles.productsList
            }
          >
            {productList.map(product => (
              <div
                key={product.id}
                className={styles.productCard}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.label && (
                  <div className={styles.productLabel}>{product.label}</div>
                )}
                <button
                  className={`${styles.favBtn} ${
                    product.isFavorite ? styles.favorited : ''
                  }`}
                  onClick={e =>
                    handleToggleFavorite(e, product.id, product.isFavorite)
                  }
                >
                  <FontAwesomeIcon icon={faHeartRegular} />
                </button>
                <div className={styles.productImage}>
                  <img src={product.images} alt={product.name} />
                </div>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productPrice}>
                  {product.discount ? (
                    <>
                      <span className={styles.oldPrice}>
                        {product.price.toLocaleString()} ₽
                      </span>
                      <span className={styles.currentPrice}>
                        {product.discount.new_price.toLocaleString()} ₽
                      </span>
                    </>
                  ) : (
                    <span className={styles.currentPrice}>
                      {product.price.toLocaleString()} ₽
                    </span>
                  )}
                </div>
                <button
                  className={`
                    ${styles.addToCartBtn}
                    ${
                      loadingProductId === product.id
                        ? styles.loading
                        : ''
                    }
                    ${
                      addedProductIds.includes(product.id)
                        ? styles.added
                        : ''
                    }
                  `}
                  onClick={e => handleAddToCart(e, product.id)}
                >
                  {loadingProductId === product.id
                    ? 'Добавление...'
                    : addedProductIds.includes(product.id)
                    ? 'Добавлено'
                    : 'В корзину'}
                </button>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {productsData && (
            <div className={styles.paginationWrapper}>
              <div className={styles.pagination}>
                <button
                  onClick={handlePrev}
                  disabled={currentPage <= 1}
                >
                  Назад
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  p => (
                    <button
                      key={p}
                      onClick={() => goPage(p)}
                      className={
                        p === currentPage ? styles.activePageBtn : ''
                      }
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                >
                  Вперёд
                </button>
              </div>
              <div className={styles.paginationInfo}>
                Страница {currentPage} из {totalPages}, всего товаров:{' '}
                {totalItems}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CategoryPage;
