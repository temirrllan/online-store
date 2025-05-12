import React, { useState } from "react";
import { useGetProductReviewsQuery } from "../../redux/api/apiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import styles from "./ProductReviews.module.scss";

const ProductReviews = ({ productId }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data,
    error,
    isLoading,
    isFetching
  } = useGetProductReviewsQuery({ productId, page, pageSize });

  if (isLoading) return <div className={styles.status}>Загрузка отзывов…</div>;
  if (error) return <div className={styles.status}>Не удалось загрузить отзывы</div>;

  const {
    reviews,
    reviewsPagination: { totalPages },
    averageRating,
    totalReviews
  } = data;

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStarSolid}
        className={i < count ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  return (
    <div className={styles.reviews}>
      <div className={styles.header}>
        <div className={styles.avg}>
          <span className={styles.avgValue}>{averageRating.toFixed(1)}</span>
          <div className={styles.avgStars}>{renderStars(Math.round(averageRating))}</div>
          <span className={styles.count}>{totalReviews} отзывов</span>
        </div>
        {/* тут можно добавить Sort / Filter */}
      </div>

      <ul className={styles.list}>
        {reviews.map((r) => (
          <li key={r.id} className={styles.item}>
            <div className={styles.top}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  {r.userName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className={styles.userName}>
                  {r.userName || "Аноним"}
                </span>
              </div>
              <div className={styles.stars}>
                {renderStars(r.rating)}
              </div>
            </div>
            <p className={styles.comment}>{r.comment}</p>
            <span className={styles.date}>
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.pagination}>
        <button
          disabled={page === 1 || isFetching}
          onClick={() => setPage((p) => p - 1)}
        >
          ‹
        </button>
        <span>{page} / {totalPages}</span>
        <button
          disabled={page === totalPages || isFetching}
          onClick={() => setPage((p) => p + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ProductReviews;
