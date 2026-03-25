import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaLock,
  FaClipboardList,
  FaBoxOpen,
  FaStar,
  FaUsers,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaUserCircle,
  FaSignInAlt,
  FaTools,
  FaCogs,
  FaWrench,
  FaShieldAlt,
} from "react-icons/fa";
import "./admin.css";

type AdminUser = {
  name: string;
  avatar?: string;
};

export default function AdminLayout() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openService, setOpenService] = useState(true);

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");

    if (!storedUser) {
      setAdminUser(null);
      return;
    }

    try {
      setAdminUser(JSON.parse(storedUser));
    } catch {
      setAdminUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    navigate("/admin/login");
  };

  const goToLogin = () => {
    navigate("/admin/login");
  };

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

          <button
            type="button"
            className="sidebar__item sidebar__dropdownBtn"
            onClick={() => setOpenService(!openService)}
          >
            <span className="sidebar__itemLeft">
              <FaTools />
              Dịch vụ kỹ thuật
            </span>
            {openService ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openService && (
            <div className="sidebar__submenu">
              <NavLink to="/admin/service" className="sidebar__subitem">
                <span className="sidebar__dot" />
                <FaCogs />
                Tổng quan dịch vụ
              </NavLink>

              <NavLink to="/admin/service/maintenance" className="sidebar__subitem">
                <span className="sidebar__dot" />
                <FaTools />
                Bảo quản
              </NavLink>

              <NavLink to="/admin/service/repair" className="sidebar__subitem">
                <span className="sidebar__dot" />
                <FaWrench />
                Sửa chữa
              </NavLink>

              <NavLink to="/admin/service/warranty" className="sidebar__subitem">
                <span className="sidebar__dot" />
                <FaShieldAlt />
                Bảo hành
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
          <h3 className="topbar__title">Admin</h3>

          <div className="topbar__right">
            {adminUser && (
              <div className="profileInline">
                {adminUser.avatar ? (
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name}
                    className="profileBox__avatar"
                  />
                ) : (
                  <div className="profileBox__avatar profileBox__avatar--icon">
                    <FaUserCircle />
                  </div>
                )}

                <div className="profileBox__info">
                  <span className="profileBox__name">{adminUser.name}</span>
                  <span className="profileBox__role">Quản trị viên</span>
                </div>
              </div>
            )}

            <button
              type="button"
              className={`loginBtn ${adminUser ? "loginBtn--logout" : ""}`}
              onClick={adminUser ? handleLogout : goToLogin}
            >
              {adminUser ? <FaSignOutAlt /> : <FaSignInAlt />}
              {adminUser ? "Đăng xuất" : "Đăng nhập"}
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}