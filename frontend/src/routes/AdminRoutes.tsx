import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import BrandListPage from "../admin/pages/brands/BrandListPage";

function DashboardPage() {
  return <div>Dashboard</div>;
}

function CategoryListPage() {
  return <div>Category page</div>;
}

function ProductListPage() {
  return <div>Product page</div>;
}

function OrderListPage() {
  return <div>Order page</div>;
}

function UserListPage() {
  return <div>User page</div>;
}

function ServiceRequestListPage() {
  return <div>Service request page</div>;
}

function PrivateAdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <PrivateAdminRoute>
            <AdminLayout />
          </PrivateAdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="brands" element={<BrandListPage />} />
        <Route path="categories" element={<CategoryListPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="orders" element={<OrderListPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="service-requests" element={<ServiceRequestListPage />} />
      </Route>
    </Routes>
  );
}