import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin-login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    // Demo login
    localStorage.setItem("token", "admin-demo-token");
    localStorage.setItem(
      "adminUser",
      JSON.stringify({
        name: "Khanh Huynh",
        avatar:
          "https://i.pravatar.cc/150?img=12",
      })
    );

    navigate("/admin");
  };

  return (
    <div className="adminLogin">
      <div className="adminLogin__card">
        <h2 className="adminLogin__title">Đăng nhập quản trị</h2>
        <p className="adminLogin__subtitle">
          Nhập tài khoản để vào trang admin
        </p>

        <form onSubmit={handleSubmit} className="adminLogin__form">
          <div className="adminLogin__group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="adminLogin__group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button type="submit" className="adminLogin__btn">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}