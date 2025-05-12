// Файл: frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Импортируем Header
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import CartPage from "./pages/CartPage/CartPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import Account from "./pages/Account/Account";
import Orders from "./pages/Orders/Orders";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import Delivery from "./pages/Delivery/Delivery";
import Payments from "./pages/Payments/Payments";

// Заглушка для Password
const Password = () => <div style={{ padding: "20px" }}>Password Page</div>;

// Обёртка, которая решит, показывать Header или нет
function Layout({ children }) {
  const location = useLocation();
  // Пути, на которых шапка не отображается
  const hideHeaderPaths = ["/login", "/register"];

  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Layout решает, рендерить ли Header */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/catalog/:id"
            element={
              <PrivateRoute>
                <CategoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <PrivateRoute>
                <ProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/*"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          >
            <Route index element={<Account />} />
            <Route path="account" element={<Account />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="track/:orderId" element={<TrackOrder />} />
            <Route path="password" element={<Password />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="payments" element={<Payments />} />
          </Route>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
