import React from "react";
import "./header.css";

const Header: React.FC = () => {
  return (
    <header className="hd">
      {/* Top bar */}
      <div className="hd-top">
        <div className="container hd-top__inner">
          <span className="hd-top__left">
            Khuyến mãi khủng giảm tới 35% tất cả sản phẩm
          </span>
          <div className="hd-top__right">
            <button className="hd-top__btn" type="button">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="hd-main">
        <div className="container hd-main__inner">
          <div className="hd-logo">FLYCAM24H</div>

          <div className="hd-search">
            <input className="hd-search__input" placeholder="Tìm kiếm sản phẩm..." />
            <button className="hd-search__btn" type="button" aria-label="Search">
              🔍
            </button>
          </div>

          <div className="hd-actions">
            <div className="hd-action">
              <span className="hd-action__icon">📍</span>
              <div>
                <div className="hd-action__title">Giao hàng</div>
                <div className="hd-action__sub">Đến địa chỉ...</div>
              </div>
            </div>

            <div className="hd-action">
              <span className="hd-action__icon">👤</span>
              <div>
                <div className="hd-action__title">Đăng nhập / Đăng ký</div>
                <div className="hd-action__sub">Tài khoản</div>
              </div>
            </div>

            <div className="hd-cart">
              <span className="hd-cart__icon">🛒</span>
              <span className="hd-cart__text">Giỏ hàng</span>
              <span className="hd-cart__badge">0</span>
            </div>
          </div>
        </div>

        {/* Sub info */}
        <div className="container hd-sub">
          <span>✅ Đảm bảo chất lượng</span>
          <span>🚚 Miễn phí vận chuyển</span>
          <span>📦 Mở hộp kiểm tra nhận hàng</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="hd-nav">
        <div className="container hd-nav__inner">
          <a href="/" className="hd-nav__link">TRANG CHỦ</a>
          <a href="/productlist" className="hd-nav__link">SẢN PHẨM</a>
          <a href="#" className="hd-nav__link">TRANG SẢN PHẨM</a>
          <a href="#" className="hd-nav__link">BLOG</a>
          <a href="#" className="hd-nav__link">GIỚI THIỆU</a>
          <a href="#" className="hd-nav__link">LANDING PAGE</a>

          <div className="hd-nav__right">
            <span className="live">🔴 Live stream</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;