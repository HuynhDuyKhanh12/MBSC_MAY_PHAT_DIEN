import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  FaLock,
  FaClipboardList,
  FaBoxOpen,
  FaStar,
  FaUsers,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import "./admin.css";

export default function AdminLayout() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);

  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sidebar__top">
          <div className="sidebar__logoCircle">
            <FaTachometerAlt />
          </div>
          <div className="sidebar__title">Trang quản trị</div>
        </div>

        <nav className="sidebar__menu">
          <NavLink to="/admin" end className="sidebar__item">
            Dashboard
          </NavLink>

          <button
            type="button"
            className="sidebar__item sidebar__dropdownBtn"
            onClick={() => setOpenProduct(!openProduct)}
          >
            <span className="sidebar__itemLeft">
              <FaBoxOpen />
              Sản phẩm
            </span>
            {openProduct ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openProduct && (
            <div className="sidebar__submenu">
              <NavLink to="/admin/product" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Product — Sản phẩm
              </NavLink>
              <NavLink to="/admin/category" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Category — Danh mục
              </NavLink>
              <NavLink to="/admin/brand" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Brand — Thương hiệu
              </NavLink>
            </div>
          )}

          <button
            type="button"
            className="sidebar__item sidebar__dropdownBtn"
            onClick={() => setOpenOrder(!openOrder)}
          >
            <span className="sidebar__itemLeft">
              <FaClipboardList />
              Mua hàng
            </span>
            {openOrder ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openOrder && (
            <div className="sidebar__submenu">
              <NavLink to="/admin/cart" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Cart — Giỏ hàng
              </NavLink>
              <NavLink to="/admin/order" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Order — Đơn hàng
              </NavLink>
              <NavLink to="/admin/coupon" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Coupon — Mã giảm giá
              </NavLink>
            </div>
          )}

          <button
            type="button"
            className="sidebar__item sidebar__dropdownBtn"
            onClick={() => setOpenCustomer(!openCustomer)}
          >
            <span className="sidebar__itemLeft">
              <FaUsers />
              Khách hàng
            </span>
            {openCustomer ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openCustomer && (
            <div className="sidebar__submenu">
              <NavLink to="/admin/user" className="sidebar__subitem">
                <span className="sidebar__dot" />
                User — Người dùng
              </NavLink>
              <NavLink to="/admin/address" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Address — Địa chỉ
              </NavLink>
              <NavLink to="/admin/wishlist" className="sidebar__subitem">
                <span className="sidebar__dot" />
                Wishlist — Yêu thích
              </NavLink>
            </div>
          )}

          <NavLink to="/admin/review" className="sidebar__item">
            <span className="sidebar__itemLeft">
              <FaStar />
              Review — Đánh giá
            </span>
          </NavLink>

          <NavLink to="/admin/auth" className="sidebar__item">
            <span className="sidebar__itemLeft">
              <FaLock />
              Auth — Xác thực
            </span>
          </NavLink>
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <h3>Admin</h3>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}