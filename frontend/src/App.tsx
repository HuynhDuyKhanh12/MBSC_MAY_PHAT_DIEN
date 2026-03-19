import { BrowserRouter, Routes, Route } from "react-router-dom";

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

import AdminLayout from "./admin/layout/AdminLayout";
import DashboardPage from "./admin/dashboard/DashboardPage";
import ProductPage from "./admin/product/ProductPage";
import ProductCreatePage from "./admin/product/ProductCreatePage";
import CategoryPage from "./admin/category/CategoryPage";
import CategoryCreatePage from "./admin/category/CategoryCreatePage";
import BrandPage from "./admin/brand/BrandPage";
import BrandCreatePage from "./admin/brand/BrandCreatePage";
import UserPage from "./admin/user/UserPage";
import UserCreatePage from "./admin/user/UserCreatePage";
import AddressPage from "./admin/address/AddressPage";
import AddressCreatePage from "./admin/address/AddressCreatePage";
import WishlistPage from "./admin/wishlist/WishlistPage";
import WishlistCreatePage from "./admin/wishlist/WishlistCreatePage";
import CartPage from "./admin/cart/CartPage";
import CartCreatePage from "./admin/cart/CartCreatePage";
import OrderPage from "./admin/order/OrderPage";
import OrderCreatePage from "./admin/order/OrderCreatePage";
import CouponPage from "./admin/coupon/CouponPage";
import CouponCreatePage from "./admin/coupon/CouponCreatePage";
import ReviewPage from "./admin/review/ReviewPage";
import ReviewCreatePage from "./admin/review/ReviewCreatePage";
import AuthPage from "./admin/auth/AuthPage";
import AuthCreatePage from "./admin/auth/AuthCreatePage";
import AdminLogin from "./admin/AdminLogin";

import ProductEditPage from "./admin/product/ProductEditPage";
import ProductViewPage from "./admin/product/ProductViewPage";
import ProductTrashPage from "./admin/product/ProductTrashPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="san-pham/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="repair" element={<RepairRegister />} />
        <Route path="/repair" element={<Repair />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/admin" element={<AdminLayout />}  >
          <Route index element={<DashboardPage />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="product/create" element={<ProductCreatePage />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="category/create" element={<CategoryCreatePage />} />
          <Route path="brand" element={<BrandPage />} />
          <Route path="brand/create" element={<BrandCreatePage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="user/create" element={<UserCreatePage />} />
          <Route path="address" element={<AddressPage />} />
          <Route path="address/create" element={<AddressCreatePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="wishlist/create" element={<WishlistCreatePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="cart/create" element={<CartCreatePage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="order/create" element={<OrderCreatePage />} />
          <Route path="coupon" element={<CouponPage />} />
          <Route path="coupon/create" element={<CouponCreatePage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="review/create" element={<ReviewCreatePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="auth/create" element={<AuthCreatePage />} />

          <Route path="product/edit/:id" element={<ProductEditPage />} />
          <Route path="product/view/:id" element={<ProductViewPage />} />
          <Route path="product/trash" element={<ProductTrashPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;