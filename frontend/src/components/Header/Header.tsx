import React, { useEffect, useMemo, useRef, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";

type CartItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
};

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

const Header: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "PHANTOM 4 MULTISPECTRAL (CHÍNH HÃNG)",
      image:
        "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=400&auto=format&fit=crop",
      price: 34000000,
      qty: 2,
    },
  ]);

  const cartCount = useMemo(
    () => cartItems.reduce((s, it) => s + it.qty, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((s, it) => s + it.qty * it.price, 0),
    [cartItems]
  );

  const [openCart, setOpenCart] = useState(false);
  const cartWrapRef = useRef<HTMLDivElement | null>(null);

  const [openLocation, setOpenLocation] = useState(false);
  const locationWrapRef = useRef<HTMLDivElement | null>(null);

  const [province, setProvince] = useState("Hồ Chí Minh");
  const [district, setDistrict] = useState("");
  const defaultAddress = "182 Lê Đại Hành, Quận 11";

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;

      if (cartWrapRef.current && !cartWrapRef.current.contains(t)) {
        setOpenCart(false);
      }

      if (locationWrapRef.current && !locationWrapRef.current.contains(t)) {
        setOpenLocation(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const incQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );
  };

  const decQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const districtsByProvince: Record<string, string[]> = {
    "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 10", "Quận 11", "Thủ Đức"],
    "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa", "Cầu Giấy"],
    "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà"],
  };

  const districtOptions = districtsByProvince[province] ?? [];

  return (
    <header className="hd">
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

      <div className="hd-main">
        <div className="container hd-main__inner">
          <div className="hd-logo">FLYCAM24H</div>

          <div className="hd-search">
            <input
              className="hd-search__input"
              placeholder="Tìm kiếm sản phẩm..."
            />
            <button className="hd-search__btn" type="button" aria-label="Search">
              🔍
            </button>
          </div>

          <div className="hd-actions">
            <div className="hd-actionWrap" ref={locationWrapRef}>
              <button
                className="hd-action hd-actionBtn"
                type="button"
                onClick={() => setOpenLocation((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={openLocation}
              >
                <span className="hd-action__icon">📍</span>
                <div className="hd-action__text">
                  <div className="hd-action__title">
                    Giao hoặc đến lấy tại <span className="hd-caret">▾</span>
                  </div>
                  <div className="hd-action__sub">
                    {district
                      ? `${province} • ${district}`
                      : "Địa điểm mặc định..."}
                  </div>
                </div>
              </button>

              {openLocation && (
                <div className="locPop" role="dialog" aria-label="Khu vực mua hàng">
                  <div className="locPop__arrow" />

                  <div className="locPop__title">KHU VỰC MUA HÀNG</div>

                  <div className="locPop__grid">
                    <div className="locPop__field">
                      <label className="locPop__label">Tỉnh/Thành</label>
                      <select
                        className="locPop__select"
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setDistrict("");
                        }}
                      >
                        {Object.keys(districtsByProvince).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="locPop__field">
                      <label className="locPop__label">Quận/huyện</label>
                      <select
                        className="locPop__select"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      >
                        <option value="">- Chọn Quận/Huyện -</option>
                        {districtOptions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="locPop__box">
                    <div className="locPop__boxTitle">Giao hoặc đến lấy tại:</div>
                    <div className="locPop__boxSub">
                      Địa điểm mặc định - {defaultAddress}
                    </div>
                  </div>

                  <div className="locPop__hint">
                    Chọn cửa hàng gần bạn nhất để tối ưu chi phí giao hàng.
                    <br />
                    Hoặc đến lấy hàng
                  </div>

                  <div className="locPop__default">
                    <div className="locPop__pin">📍</div>
                    <div>
                      <div className="locPop__defaultTitle">Địa điểm mặc định</div>
                      <div className="locPop__defaultSub">{defaultAddress}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACCOUNT */}
            <Link to="/auth" className="hd-action hd-action--link">
              <span className="hd-action__icon">👤</span>
              <div>
                <div className="hd-action__title">Đăng nhập / Đăng ký</div>
                <div className="hd-action__sub">Tài khoản</div>
              </div>
            </Link>

            {/* CART */}
            <div className="hd-cartWrap" ref={cartWrapRef}>
              <button
                className="hd-cart"
                type="button"
                onClick={() => setOpenCart((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={openCart}
              >
                <span className="hd-cart__icon">🛒</span>
                <span className="hd-cart__text">Giỏ hàng</span>
                <span className="hd-cart__badge">{cartCount}</span>
              </button>

              {openCart && (
                <div className="miniCart" role="dialog" aria-label="Giỏ hàng">
                  <div className="miniCart__arrow" />

                  <div className="miniCart__head">GIỎ HÀNG</div>

                  <div className="miniCart__list">
                    {cartItems.length === 0 ? (
                      <div className="miniCart__empty">Giỏ hàng đang trống.</div>
                    ) : (
                      cartItems.map((it) => (
                        <div className="miniCart__item" key={it.id}>
                          <img
                            className="miniCart__img"
                            src={it.image}
                            alt={it.name}
                            loading="lazy"
                          />

                          <div className="miniCart__info">
                            <div className="miniCart__name" title={it.name}>
                              {it.name}
                            </div>

                            <div className="miniCart__row">
                              <div className="miniCart__qty">
                                <button
                                  className="miniCart__qtyBtn"
                                  type="button"
                                  onClick={() => decQty(it.id)}
                                >
                                  –
                                </button>
                                <span className="miniCart__qtyNum">{it.qty}</span>
                                <button
                                  className="miniCart__qtyBtn"
                                  type="button"
                                  onClick={() => incQty(it.id)}
                                >
                                  +
                                </button>
                              </div>

                              <div className="miniCart__price">
                                {formatVND(it.price)}
                              </div>
                            </div>
                          </div>

                          <button
                            className="miniCart__remove"
                            type="button"
                            aria-label="Xóa"
                            onClick={() => removeItem(it.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="miniCart__total">
                    <span>TỔNG TIỀN:</span>
                    <b>{formatVND(cartTotal)}</b>
                  </div>

                  <a className="miniCart__btn" href="/cart">
                    XEM GIỎ HÀNG
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container hd-sub">
          <span>✅ Đảm bảo chất lượng</span>
          <span>🚚 Miễn phí vận chuyển</span>
          <span>📦 Mở hộp kiểm tra nhận hàng</span>
        </div>
      </div>

      <nav className="hd-nav">
        <div className="container hd-nav__inner">
          <a href="/" className="hd-nav__link">TRANG CHỦ</a>
          <a href="/productlist" className="hd-nav__link">SẢN PHẨM</a>
          <a href="/repair" className="hd-nav__link">ĐĂNG KÝ SỬA CHỮA/BẢO HÀNH</a>
          <a href="/blog" className="hd-nav__link">BLOG</a>
          <a href="/about" className="hd-nav__link">GIỚI THIỆU</a>
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