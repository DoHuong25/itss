import { Routes, Route } from 'react-router-dom';

// --- Layouts ---
import AppLayout from './layouts/AppLayout'; // Layout cho người dùng
import AdminLayout from './pages/admin/AdminLayout'; // Layout cho admin

// --- Components ---
import AdminProtectedRoute from './components/AdminProtectedRoute'; // Component bảo vệ route admin

// --- Public & User Pages ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import NotFoundPage from './pages/NotFoundPage';

// --- Admin Pages ---
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <Routes>
      {/* === KHU VỰC ADMIN === */}
      {/* Tất cả các route bên trong sẽ được bảo vệ bởi AdminProtectedRoute */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          {/* Trang mặc định khi admin vào dashboard */}
          <Route index element={<ProductManagement />} />

          {/* Các trang con của dashboard admin */}
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Route>

      {/* === KHU VỰC USER & CÔNG KHAI === */}
      {/* Các trang sử dụng layout chung (có Header và Footer) */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="order-history" element={<OrderHistoryPage />} />
      </Route>

      {/* Các trang không dùng layout chung (trang đứng riêng) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="payment-success" element={<PaymentSuccessPage />} />
      <Route path="payment-failed" element={<PaymentFailedPage />} />

      {/* Route bắt lỗi 404 cho tất cả các đường dẫn không khớp */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
