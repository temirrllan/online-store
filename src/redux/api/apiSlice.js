// Файл: src/redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from 'jwt-decode';
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 2) Кастомная обёртка: проверяем токен, если истёк — редиректим
// Наша обёртка
const baseQueryWithTokenCheck = async (args, api, extraOptions) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      // Здесь 'token' уже объявлен
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        console.log("Токен истёк");
        localStorage.removeItem("token");
        const currentPath = window.location.pathname + window.location.search;
window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`;

        return { error: { status: 401, data: "Token expired" } };
      }
    } catch (err) {
      console.error("Ошибка при декодировании токена:", err);
      localStorage.removeItem("token");
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
      return { error: { status: 401, data: "Bad token" } };
    }
  }

  // Если всё ок
  const result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

// 3) Создаём createApi, передавая baseQuery: baseQueryWithTokenCheck
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTokenCheck, 
  tagTypes: ["Cart", "Favorites"], // ← добавь "Favorites"
  endpoints: (builder) => ({
    // 1) Список всех каталогов (GET /v1/catalog/catalogs)
    getAllCatalogs: builder.query({
      query: () => "v1/catalog/catalogs",
      keepUnusedDataFor: 60,
    }),

    // Пример: Узнать общее число товаров
    getCatalogTotal: builder.query({
      query: (catalogId) => ({
        url: "v1/catalog/products/search",
        method: "POST",
        body: { catalogId, page: 1, pageSize: 999999 },
      }),
    }),

    // Пример: Товары для конкретной страницы
    getCatalogProductsPage: builder.query({
      query: ({ catalogId, page, pageSize = 10 }) => ({
        url: "v1/catalog/products/search",
        method: "POST",
        body: { catalogId, page, pageSize },
      }),
    }),

    // Товары по catalogId (если нужно)
    getProductsByCatalogId: builder.query({
      query: ({ catalogId, page = 1, pageSize = 10 }) => ({
        url: "v1/catalog/products/search",
        method: "POST",
        body: { catalogId, page, pageSize },
      }),
      keepUnusedDataFor: 300,
    }),

    // Пример: Получить один товар по ID
    getProductById: builder.query({
      query: (productId) => `v1/catalog/products/${productId}`,
      keepUnusedDataFor: 300,
    }),

    getFavorites: builder.query({
      query: () => "v1/users/favorites",
      providesTags: ["Favorites"], // ← добавь это
    }),
    
    addToFavorites: builder.mutation({
      query: (productId) => ({
        url: "v1/users/favorites",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Favorites"], // ← добавь это
    }),
    
    removeFromFavorites: builder.mutation({
      query: (productId) => ({
        url: "v1/users/favorites",
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Favorites"], // ← и сюда
    }),
    

    // Корзина
    getCartItems: builder.query({
      query: () => "v1/cart/items",
      providesTags: ["Cart"],
      keepUnusedDataFor: 300,
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "v1/cart/add",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: "v1/cart/remove",
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),
// Новый эндпоинт: Обновление количества товара в корзине
updateCartQuantity: builder.mutation({
  query: ({ productId, quantity }) => ({
    url: "v1/cart/update",
    method: "PATCH",
    body: { productId, quantity },
  }),
  invalidatesTags: ["Cart"],
  keepUnusedDataFor: 120,
}),
    // Поиск товаров
    searchProducts: builder.mutation({
      query: () => ({
        url: "v1/catalog/products/search",
        method: "POST",
      }),
      keepUnusedDataFor: 120,
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "v1/orders",
        method: "POST",
        body: {
          street: orderData.street,
          city: orderData.city,
          home: orderData.home,
          flat: orderData.flat,
          comment: orderData.comment,
          total: orderData.total,
          items: orderData.items,
        },
      }),
    }),
    getProductFilters: builder.query({
      query: (category_id) =>
        `v1/catalog/products/filters?category_id=${category_id}`,
      providesTags: ["Filters"],
      keepUnusedDataFor: 300,
    }),
googleAuth: builder.mutation({
  query: ({ idToken }) => ({
    url: 'api/auth/google', // или '/api/auth/google' если baseUrl указывает на корень API
    method: 'POST',
    body: { idToken }
  })
}),

    getProductReviews: builder.query({
      query: ({ productId, page = 1, pageSize = 10 }) => ({
        url: `v1/products/${productId}/reviews`,
        params: { page, pageSize },
      }),
      transformResponse: (response) => ({
        ...response,
        averageRating: parseFloat(response.averageRating),
        totalReviews: parseInt(response.totalReviews, 10),
      }),
      // при необходимости кешируем или сбрасываем:
      keepUnusedDataFor: 60,
      // можно добавить тэги для инвалидации:
      providesTags: (result, error, { productId }) =>
        result
          ? [
              ...result.reviews.map(({ id }) => ({ type: 'Review', id })),
              { type: 'Review', id: `LIST_${productId}` },
            ]
          : [{ type: 'Review', id: `LIST_${productId}` }],
    }),
  }),
});

// Экспорт хуков
export const {
  useGetAllCatalogsQuery,
  useGetCatalogTotalQuery,
  useGetCatalogProductsPageQuery,
  useGetProductsByCatalogIdQuery,
  useGetProductByIdQuery,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetCartItemsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useSearchProductsMutation,
  useCreateOrderMutation,
  useGetProductFiltersQuery, 
  useGetProductReviewsQuery,
  useGoogleAuthMutation,

} = apiSlice;
