import React from "react";
import "./footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="ft">
      <div className="ft-news">
        <div className="container ft-news__inner">
          <div className="ft-news__left">
            <strong>Đăng ký nhận tin</strong>
          </div>
          <div className="ft-news__form">
            <input className="ft-news__input" placeholder="Nhập email của bạn" />
            <button className="ft-news__btn" type="button">ĐĂNG KÝ</button>
          </div>
          <div className="ft-news__right">
            <strong>Kết nối với chúng tôi</strong>
            <div className="ft-social">
              <span>ⓕ</span><span>ⓧ</span><span>🅾</span><span>▶</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ft-main">
        <div className="container ft-grid">
          <div className="ft-col">
            <div className="ft-title">Về Flycam24h</div>
            <p className="ft-text">
              Với các giải pháp công nghệ tốt nhất, Flycam24h là tất cả những gì bạn
              cần để xây dựng thương hiệu online.
            </p>
            <div className="ft-text">📍 182 Lê Đại Hành, Q11, TP.HCM</div>
            <div className="ft-text">☎ 1900.000.XXX</div>
            <div className="ft-text">✉ hi@flycam24h.abc</div>
          </div>

          <div className="ft-col">
            <div className="ft-title">Hỗ trợ khách hàng</div>
            <a className="ft-link" href="#">Trang chủ</a>
            <a className="ft-link" href="#">Sản phẩm</a>
            <a className="ft-link" href="#">Blog</a>
            <a className="ft-link" href="#">Giới thiệu</a>
            <a className="ft-link" href="#">Hệ thống cửa hàng</a>
          </div>

          <div className="ft-col">
            <div className="ft-title">Liên kết</div>
            <a className="ft-link" href="#">Trang chủ</a>
            <a className="ft-link" href="#">Sản phẩm</a>
            <a className="ft-link" href="#">Trang sản phẩm</a>
            <a className="ft-link" href="#">Blog</a>
            <a className="ft-link" href="#">Landing page</a>
          </div>

          <div className="ft-col">
            <div className="ft-title">Chính sách</div>
            <a className="ft-link" href="#">Tìm kiếm</a>
            <a className="ft-link" href="#">Giới thiệu</a>
            <a className="ft-link" href="#">Chính sách đổi trả</a>
            <a className="ft-link" href="#">Chính sách bảo mật</a>
            <a className="ft-link" href="#">Điều khoản dịch vụ</a>
          </div>
        </div>

        <div className="ft-copy">
          Copyright © 2026 FlyCam24h. Powered by Haravan
        </div>
      </div>
    </footer>
  );
};

export default Footer;