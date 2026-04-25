import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./auth.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { loginApi, registerApi } from "../../api/modules/authApi";

type TabType = "login" | "register";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabType>("login");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (token && userRaw) {
    try {
      const user = JSON.parse(userRaw);
      const role = user?.role?.name || user?.role || "";

      if (
        role === "ADMIN" ||
        role === "SUPER_ADMIN" ||
        role === "WEB_MANAGER"
      ) {
        return <Navigate to="/admin" replace />;
      }

      return <Navigate to="/" replace />;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = loginData.email.trim().toLowerCase();
    const password = loginData.password;

    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!password) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({
        email,
        password,
      });

      console.log("LOGIN FULL RESPONSE:", res);

      const token = res?.data?.accessToken;
      const refreshToken = res?.data?.refreshToken;
      const user = res?.data?.user;

      if (!token) {
        alert("Đăng nhập thất bại: không nhận được access token");
        return;
      }

      localStorage.setItem("token", token);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      alert(res?.message || "Đăng nhập thành công");

      const role = user?.role?.name || user?.role || "";

      if (
        role === "ADMIN" ||
        role === "SUPER_ADMIN" ||
        role === "WEB_MANAGER"
      ) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      console.error("LOGIN ERROR:", error?.response?.data || error);
      const message =
        error?.response?.data?.message || error?.message || "Đăng nhập thất bại";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = registerData.fullName.trim();
    const email = registerData.email.trim().toLowerCase();
    const phone = registerData.phone.trim();
    const password = registerData.password;
    const confirmPassword = registerData.confirmPassword;

    if (!fullName) {
      alert("Vui lòng nhập họ và tên");
      return;
    }

    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!password) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      setLoading(true);

      const res = await registerApi({
        fullName,
        email,
        phone,
        password,
      });

      console.log("REGISTER FULL RESPONSE:", res);

      alert(res?.message || "Đăng ký thành công, vui lòng đăng nhập");

      setRegisterData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setTab("login");
    } catch (error: any) {
      console.error("REGISTER ERROR:", error?.response?.data || error);
      const message =
        error?.response?.data?.message || error?.message || "Đăng ký thất bại";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="authPage">
        <div className="authContainer">
          <div className="authCard">
            <div className="authLeft">
              <div className="authLeft__badge">FLYCAM24H</div>
              <h2 className="authLeft__title">Chào mừng bạn quay trở lại</h2>
              <p className="authLeft__desc">
                Đăng nhập hoặc tạo tài khoản để mua hàng, theo dõi đơn hàng và
                nhận nhiều ưu đãi hấp dẫn.
              </p>
              <img
                className="authLeft__img"
                src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1200&auto=format&fit=crop"
                alt="auth banner"
              />
            </div>

            <div className="authRight">
              <div className="authTabs">
                <button
                  className={`authTab ${tab === "login" ? "active" : ""}`}
                  onClick={() => setTab("login")}
                  type="button"
                  disabled={loading}
                >
                  Đăng nhập
                </button>
                <button
                  className={`authTab ${tab === "register" ? "active" : ""}`}
                  onClick={() => setTab("register")}
                  type="button"
                  disabled={loading}
                >
                  Đăng ký
                </button>
              </div>

              {tab === "login" ? (
                <form className="authForm" onSubmit={handleLogin}>
                  <h3 className="authForm__title">Đăng nhập tài khoản</h3>

                  <div className="authField">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Nhập email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="authField">
                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button className="authSubmit" type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>

                  <p className="authBottomText">
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      className="authSwitch"
                      onClick={() => setTab("register")}
                      disabled={loading}
                    >
                      Đăng ký ngay
                    </button>
                  </p>
                </form>
              ) : (
                <form className="authForm" onSubmit={handleRegister}>
                  <h3 className="authForm__title">Tạo tài khoản mới</h3>

                  <div className="authField">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={registerData.fullName}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="authField">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Nhập email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="authField">
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="authField">
                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="authField">
                    <label>Nhập lại mật khẩu</label>
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <button className="authSubmit" type="submit" disabled={loading}>
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </button>

                  <p className="authBottomText">
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      className="authSwitch"
                      onClick={() => setTab("login")}
                      disabled={loading}
                    >
                      Đăng nhập
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Auth;