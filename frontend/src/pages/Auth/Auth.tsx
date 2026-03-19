import React, { useState } from "react";
import "./auth.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

type TabType = "login" | "register";

const Auth: React.FC = () => {
  const [tab, setTab] = useState<TabType>("login");

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Đăng nhập:", loginData);
    alert("Đăng nhập thành công (demo)");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp");
      return;
    }

    console.log("Đăng ký:", registerData);
    alert("Đăng ký thành công (demo)");
    setTab("login");
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
                >
                  Đăng nhập
                </button>
                <button
                  className={`authTab ${tab === "register" ? "active" : ""}`}
                  onClick={() => setTab("register")}
                  type="button"
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

                  <button className="authSubmit" type="submit">
                    Đăng nhập
                  </button>

                  <p className="authBottomText">
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      className="authSwitch"
                      onClick={() => setTab("register")}
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

                  <button className="authSubmit" type="submit">
                    Đăng ký
                  </button>

                  <p className="authBottomText">
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      className="authSwitch"
                      onClick={() => setTab("login")}
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