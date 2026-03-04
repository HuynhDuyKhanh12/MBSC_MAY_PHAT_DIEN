import React, { useEffect, useMemo, useRef, useState } from "react";
import "./header.css";

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
  // Demo cart (sau này bạn thay bằng Redux/Context)
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

  // Toggle mini cart
  const [openCart, setOpenCart] = useState(false);
  const cartWrapRef = useRef<HTMLDivElement | null>(null);

  // Click outside => close
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!cartWrapRef.current) return;
      if (!cartWrapRef.current.contains(e.target as Node)) {
        setOpenCart(false);
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
            <input
              className="hd-search__input"
              placeholder="Tìm kiếm sản phẩm..."
            />
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
                                <span className="miniCart__qtyNum">
                                  {it.qty}
                                </span>
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
          <a href="/" className="hd-nav__link">
            TRANG CHỦ
          </a>
          <a href="/productlist" className="hd-nav__link">
            SẢN PHẨM
          </a>
          <a href="#" className="hd-nav__link">
            TRANG SẢN PHẨM
          </a>
          <a href="#" className="hd-nav__link">
            BLOG
          </a>
          <a href="#" className="hd-nav__link">
            GIỚI THIỆU
          </a>
          <a href="#" className="hd-nav__link">
            LANDING PAGE
          </a>

          <div className="hd-nav__right">
            <span className="live">🔴 Live stream</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;