import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";

const menus = [
  { label: "Dashboard", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Brands", path: "/admin/brands" },
  { label: "Categories", path: "/admin/categories" },
  { label: "Products", path: "/admin/products" },
  { label: "Coupons", path: "/admin/coupons" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Reviews", path: "/admin/reviews" },
  { label: "Wishlists", path: "/admin/wishlists" },
  { label: "Service Requests", path: "/admin/service-requests" },
  { label: "Audit Logs", path: "/admin/audit-logs" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("user");
  let user: any = null;

  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  const fullName = user?.fullName || user?.name || "Admin";
  const roleName = user?.role?.name || user?.role || "ADMIN";

  const isActiveMenu = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    const ok = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (!ok) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <h2 className="admin-logo">ADMIN PANEL</h2>

          <div className="admin-user-box">
            <div className="admin-avatar">
              {String(fullName).charAt(0).toUpperCase()}
            </div>

            <div className="admin-user-info">
              <div className="admin-user-name">{fullName}</div>
              <div className="admin-user-role">{roleName}</div>
            </div>
          </div>
        </div>

        <nav className="admin-menu-list">
          {menus.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={isActiveMenu(item.path) ? "menu active" : "menu"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-title">Trang quản trị hệ thống</div>
            <div className="admin-topbar-subtitle">
              Quản lý dữ liệu website
            </div>
          </div>

          <div className="admin-topbar-right">
            <button className="admin-home-btn" onClick={() => navigate("/")}>
              Về trang chủ
            </button>
            <button className="admin-logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}