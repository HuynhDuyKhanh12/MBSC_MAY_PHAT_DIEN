import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import Cart from "./pages/Cart/Cart";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/Blog/BlogDetail";
import RepairRegister from "./pages/RepairRegister/RepairRegister";
import Promotions from "./pages/Promotions/Promotions";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Repair from "./pages/Repair/Repair";
import Auth from "./pages/Auth/Auth";

import { ReviewListPage } from "./admin/pages/reviews";
import AdminLayout from "./admin/AdminLayout";
import WishlistListPage from "./admin/pages/wishlists/WishlistListPage";

import {
  BrandListPage,
  BrandCreatePage,
  BrandEditPage,
  BrandTrashPage,
} from "./admin/pages/brands";

import {
  CategoryListPage,
  CategoryCreatePage,
  CategoryEditPage,
  CategoryTrashPage,
} from "./admin/pages/categories";

import {
  UserListPage,
  UserCreatePage,
  UserEditPage,
  UserTrashPage,
} from "./admin/pages/users";

import {
  ProductListPage,
  ProductCreatePage,
  ProductEditPage,
  ProductTrashPage,
} from "./admin/pages/products";

import {
  CouponListPage,
  CouponCreatePage,
  CouponEditPage,
  CouponTrashPage,
} from "./admin/pages/coupons";

import {
  OrderListPage,
  OrderViewPage,
  OrderEditPage,
} from "./admin/pages/orders";

import {
  ServiceRequestListPage,
  ServiceRequestViewPage,
  ServiceRequestEditPage,
} from "./admin/pages/service-requests";

// ===== Placeholder (CHỈ giữ cho module chưa làm) =====
function PagePlaceholder({ title }: { title: string }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>{title}</h2>
    </div>
  );
}

function DashboardPage() {
  return <PagePlaceholder title="Dashboard" />;
}

function AuditLogListPage() {
  return <PagePlaceholder title="Audit Logs" />;
}

// ===== Auth Admin =====
function PrivateAdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(userRaw);
    const role = user?.role?.name || user?.role;

    if (
      role === "ADMIN" ||
      role === "SUPER_ADMIN" ||
      role === "WEB_MANAGER"
    ) {
      return <>{children}</>;
    }

    return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/auth" replace />;
  }
}

// ===== APP =====
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/productlist/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/repair-register" element={<RepairRegister />} />
        <Route path="/repair" element={<Repair />} />
        <Route path="/auth" element={<Auth />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <AdminLayout />
            </PrivateAdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          {/* USERS */}
          <Route path="users" element={<UserListPage />} />
          <Route path="users/create" element={<UserCreatePage />} />
          <Route path="users/edit/:id" element={<UserEditPage />} />
          <Route path="users/trash" element={<UserTrashPage />} />

          {/* BRANDS */}
          <Route path="brands" element={<BrandListPage />} />
          <Route path="brands/create" element={<BrandCreatePage />} />
          <Route path="brands/edit/:id" element={<BrandEditPage />} />
          <Route path="brands/trash" element={<BrandTrashPage />} />

          {/* CATEGORIES */}
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="categories/create" element={<CategoryCreatePage />} />
          <Route path="categories/edit/:id" element={<CategoryEditPage />} />
          <Route path="categories/trash" element={<CategoryTrashPage />} />

          {/* PRODUCTS */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/create" element={<ProductCreatePage />} />
          <Route path="products/edit/:id" element={<ProductEditPage />} />
          <Route path="products/trash" element={<ProductTrashPage />} />

          {/* COUPONS */}
          <Route path="coupons" element={<CouponListPage />} />
          <Route path="coupons/create" element={<CouponCreatePage />} />
          <Route path="coupons/edit/:id" element={<CouponEditPage />} />
          <Route path="coupons/trash" element={<CouponTrashPage />} />

          {/* OTHER */}
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/:id" element={<OrderViewPage />} />
          <Route path="orders/edit/:id" element={<OrderEditPage />} />

          <Route path="reviews" element={<ReviewListPage />} />
          <Route path="/admin/wishlists" element={<WishlistListPage />} />

          <Route path="/admin/service-requests" element={<ServiceRequestListPage />} />
          <Route path="/admin/service-requests/:id" element={<ServiceRequestViewPage />} />
          <Route path="/admin/service-requests/:id/edit" element={<ServiceRequestEditPage />} />

          <Route path="audit-logs" element={<AuditLogListPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;