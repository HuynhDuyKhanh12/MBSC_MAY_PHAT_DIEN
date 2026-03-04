// src/pages/Home/Home.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./home.css";
import { Link } from "react-router-dom";

type Category = {
  id: number;
  name: string;
  icon: string;
};

type Product = {
  id: number;
  name: string;
  brand?: string;

  price: number;
  oldPrice?: number;

  tag?: string;

  discount?: string; // "-8%" | "Hết hàng" | "Only today"
  discountPercent?: number; // 8

  isHot?: boolean;
  isOutOfStock?: boolean;

  image: string;
};

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80";

const pad2 = (n: number) => String(n).padStart(2, "0");

const Home: React.FC = () => {
  const banners = useMemo(
    () => [
      {
        id: 1,
        title: "DJI MINI 3 PRO",
        subtitle: "M30 SERIES",
        image:
          "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1600&auto=format&fit=crop",
      },
      {
        id: 2,
        title: "DJI MAVIC",
        subtitle: "Flycam chính hãng",
        image:
          "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600&auto=format&fit=crop",
      },
    ],
    []
  );

  const categories: Category[] = useMemo(
    () => [
      { id: 1, name: "Mavic Mini", icon: "🛸" },
      { id: 2, name: "Mavic Air 2S", icon: "🚁" },
      { id: 3, name: "Mavic 3 Series", icon: "📷" },
      { id: 4, name: "Phantom Series", icon: "🛰️" },
      { id: 5, name: "FPV Drone", icon: "⚡" },
      { id: 6, name: "Industry Drone", icon: "🏭" },
      { id: 7, name: "Ronin/Handheld", icon: "🎥" },
      { id: 8, name: "Trạm sạc", icon: "🔋" },
    ],
    []
  );

  // =========================
  // DATA
  // =========================
  const promoProducts: Product[] = useMemo(
    () => [
      {
        id: 1,
        name: "Phantom 4 RTK SDK",
        brand: "DJI",
        price: 21000000,
        oldPrice: 22900000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-8%",
        discountPercent: 8,
        isHot: true,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Flycam DJI Mavic Air - Combo Red",
        brand: "DJI",
        price: 19900000,
        oldPrice: 21000000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-5%",
        discountPercent: 5,
        isHot: false,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Phantom 4 Pro V2.0 (Chính hãng)",
        brand: "DJI",
        price: 35500000,
        oldPrice: 37500000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-5%",
        discountPercent: 5,
        isHot: true,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1520975693411-b61ce40b7d4c?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Phantom 4 Multispectral (Chính hãng)",
        brand: "DJI",
        price: 34000000,
        oldPrice: 35900000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-5%",
        discountPercent: 5,
        isHot: false,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Parrot ANAFI Thermal",
        brand: "ANAFI",
        price: 9900000,
        oldPrice: undefined,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "",
        discountPercent: 0,
        isHot: false,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "DJI Mavic Air Fly More Combo Arctic White",
        brand: "DJI",
        price: 18900000,
        oldPrice: 20000000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-6%",
        discountPercent: 6,
        isHot: true,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    []
  );

  const bestSeller: Product[] = useMemo(
    () => [
      {
        id: 11,
        name: "DJI FPV Combo (Chính hãng)",
        brand: "DJI",
        price: 22990000,
        oldPrice: 29990000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-23%",
        discountPercent: 23,
        isHot: true,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 12,
        name: "DJI FPV Experience Combo",
        brand: "DJI",
        price: 16990000,
        oldPrice: 18990000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-11%",
        discountPercent: 11,
        isHot: false,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1520975693411-b61ce40b7d4c?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 13,
        name: "DJI FPV Goggles V2",
        brand: "DJI",
        price: 13390000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "Hết hàng",
        isHot: false,
        isOutOfStock: true,
        image:
          "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 14,
        name: "DJI Mavic Mini 2 (Chính hãng)",
        brand: "DJI",
        price: 10890000,
        oldPrice: 12990000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-6%",
        discountPercent: 6,
        isHot: false,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 15,
        name: "DJI Mini 3 Pro Smart Controller",
        brand: "DJI",
        price: 21590000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "Only today",
        isHot: true,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 16,
        name: "Matrice 200 Series",
        brand: "DJI",
        price: 25900000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-10%",
        discountPercent: 10,
        isHot: false,
        isOutOfStock: false,
        image:
          "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    []
  );

  // =========================
  // SLIDER (smooth loop)
  // =========================
  // slideIndex dùng cho track (có clone): 0..len+1
  // - 0 là clone của last
  // - 1..len là banner thật
  // - len+1 là clone của first
  const len = banners.length;

  const [slideIndex, setSlideIndex] = useState(1); // bắt đầu ở banner thật đầu tiên
  const [isAnimating, setIsAnimating] = useState(true);

  // activeBanner thật (0..len-1) để dot active
  const activeBanner = ((slideIndex - 1 + len) % len + len) % len;

  const goNext = () => {
    setIsAnimating(true);
    setSlideIndex((s) => s + 1);
  };

  const goPrev = () => {
    setIsAnimating(true);
    setSlideIndex((s) => s - 1);
  };

  const goTo = (idx: number) => {
    // idx: 0..len-1
    setIsAnimating(true);
    setSlideIndex(idx + 1);
  };

  // pause khi hover
  const [isHoverSlider, setIsHoverSlider] = useState(false);

  // reset timer khi user bấm
  const autoRef = useRef<number | null>(null);
  const restartAuto = () => {
    if (autoRef.current) window.clearInterval(autoRef.current);
    autoRef.current = window.setInterval(() => {
      if (!isHoverSlider) goNext();
    }, 3500);
  };

  useEffect(() => {
    restartAuto();
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHoverSlider, len]);

  // khi bấm prev/next/dot => restart timer
  const nextBanner = () => {
    goNext();
    restartAuto();
  };
  const prevBanner = () => {
    goPrev();
    restartAuto();
  };

  // xử lý loop mượt: khi chạy tới clone thì nhảy về banner thật nhưng KHÔNG animation
  const onTrackTransitionEnd = () => {
    if (slideIndex === 0) {
      setIsAnimating(false);
      setSlideIndex(len);
    } else if (slideIndex === len + 1) {
      setIsAnimating(false);
      setSlideIndex(1);
    }
  };

  // sau khi tắt animation để nhảy vị trí, bật lại ngay frame sau
  useEffect(() => {
    if (!isAnimating) {
      const id = window.setTimeout(() => setIsAnimating(true), 0);
      return () => window.clearTimeout(id);
    }
  }, [isAnimating]);

  // slides với clone
  const slides = useMemo(() => {
    if (len === 0) return [];
    const first = banners[0];
    const last = banners[len - 1];
    return [last, ...banners, first];
  }, [banners, len]);

  // =========================
  // TIMER PROMO
  // =========================
  const [leftMs, setLeftMs] = useState<number>(
    2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 25 * 60 * 1000 + 40 * 1000
  );

  useEffect(() => {
    const end = Date.now() + leftMs;
    const t = setInterval(() => {
      const remain = Math.max(0, end - Date.now());
      setLeftMs(remain);
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dd = Math.floor(leftMs / (1000 * 60 * 60 * 24));
  const hh = Math.floor((leftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mm = Math.floor((leftMs % (1000 * 60 * 60)) / (1000 * 60));
  const ss = Math.floor((leftMs % (1000 * 60)) / 1000);

  // =========================
  // PROMO NAV (scroll)
  // =========================
  const promoWrapRef = useRef<HTMLDivElement | null>(null);

  const promoScroll = (dir: "left" | "right") => {
    const el = promoWrapRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  // =========================
  // ACTIONS
  // =========================
  function onAddToCart(p: Product) {
    console.log("ADD TO CART:", p);
    alert(`Đã thêm "${p.name}" vào giỏ (demo)`);
  }

  return (
    <>
      <Header />

      <main className="home">
        <div className="container">
          {/* Slider */}
          <section
            className="slider"
            onMouseEnter={() => setIsHoverSlider(true)}
            onMouseLeave={() => setIsHoverSlider(false)}
          >
            <button
              className="slider__nav slider__nav--left"
              type="button"
              onClick={prevBanner}
              aria-label="Prev banner"
            >
              ‹
            </button>

            {/* ✅ Track (slide) */}
            <div
              className="slider__track"
              style={{
                transform: `translateX(-${slideIndex * 100}%)`,
                transition: isAnimating ? "transform 600ms ease" : "none",
              }}
              onTransitionEnd={onTrackTransitionEnd}
            >
              {slides.map((b, i) => (
                <div
                  key={`${b.id}-${i}`}
                  className="slider__bg"
                  style={{ backgroundImage: `url(${b.image})` }}
                >
                  <div className="slider__overlay">
                    <div className="slider__title">{b.title}</div>
                    <div className="slider__sub">{b.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="slider__nav slider__nav--right"
              type="button"
              onClick={nextBanner}
              aria-label="Next banner"
            >
              ›
            </button>

            <div className="slider__dots">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  className={`dot ${idx === activeBanner ? "dot--active" : ""}`}
                  onClick={() => {
                    goTo(idx);
                    restartAuto();
                  }}
                  aria-label={`Banner ${idx + 1}`}
                />
              ))}
            </div>
          </section>

          {/* Quick cards */}
          <section className="quick">
            <div className="quick__card">
              <div className="quick__img" />
              <div className="quick__name">DJI Mavic 3 Pro</div>
              <div className="quick__link">Xem ngay</div>
            </div>
            <div className="quick__card">
              <div className="quick__img" />
              <div className="quick__name">DJI Mavic 3</div>
              <div className="quick__link">Xem ngay</div>
            </div>
            <div className="quick__card">
              <div className="quick__img" />
              <div className="quick__name">Phantom 4 Pro V2</div>
              <div className="quick__link">Xem ngay</div>
            </div>
            <div className="quick__card">
              <div className="quick__img" />
              <div className="quick__name">Matrice 200 Series</div>
              <div className="quick__link">Xem ngay</div>
            </div>
          </section>

          {/* PROMO */}
          <section className="promo">
            <div className="promo__head">
              <div className="promo__left">
                <span className="promo__dot" aria-hidden="true" />
                <div className="promo__title">SẢN PHẨM KHUYẾN MÃI</div>

                <div className="promo__timer" aria-label="Đếm ngược khuyến mãi">
                  <div className="tbox">
                    <div className="tbox__num">{pad2(dd)}</div>
                    <div className="tbox__label">Ngày</div>
                  </div>
                  <div className="tbox">
                    <div className="tbox__num">{pad2(hh)}</div>
                    <div className="tbox__label">Giờ</div>
                  </div>
                  <div className="tbox">
                    <div className="tbox__num">{pad2(mm)}</div>
                    <div className="tbox__label">Phút</div>
                  </div>
                  <div className="tbox">
                    <div className="tbox__num">{pad2(ss)}</div>
                    <div className="tbox__label">Giây</div>
                  </div>
                </div>
              </div>

              <div className="promo__nav">
                <button
                  type="button"
                  className="promo__navBtn"
                  onClick={() => promoScroll("left")}
                  aria-label="Trước"
                >
                  <div className="promo_text">‹</div>
                </button>
                <button
                  type="button"
                  className="promo__navBtn"
                  onClick={() => promoScroll("right")}
                  aria-label="Sau"
                >
                  <div className="promo_text">›</div>
                </button>
              </div>
            </div>

            <div className="promo__wrap" ref={promoWrapRef}>
              <div className="promo__grid">
                {promoProducts.map((p) => {
                  const percent =
                    typeof p.discountPercent === "number" &&
                    p.discountPercent > 0
                      ? p.discountPercent
                      : p.discount && p.discount.includes("%")
                      ? Math.abs(
                          parseInt(
                            p.discount.replace("%", "").replace("-", ""),
                            10
                          )
                        ) || 0
                      : 0;

                  const soldOut = !!p.isOutOfStock || p.discount === "Hết hàng";

                  return (
                    <article className="card card--blue" key={p.id}>
                      {(percent > 0 || p.discount) && (
                        <span
                          className={`badge badge--corner ${
                            soldOut ? "badge--sold" : ""
                          }`}
                        >
                          {soldOut
                            ? "Hết hàng"
                            : percent > 0
                            ? `-${percent}%`
                            : p.discount}
                        </span>
                      )}

                      <div
                        className="card__img"
                        style={{
                          backgroundImage: `url(${p.image || FALLBACK_IMG})`,
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          style={{ display: "none" }}
                          onError={(e) => {
                            const parent = e.currentTarget
                              .parentElement as HTMLElement | null;
                            if (parent) {
                              parent.style.backgroundImage = `url(${FALLBACK_IMG})`;
                            }
                          }}
                        />
                      </div>

                      {p.tag && <div className="badge">{p.tag}</div>}

                      <div className="card__name">{p.name}</div>

                      <div className="card__price">
                        <span className="price">{formatVND(p.price)}</span>
                        {p.oldPrice && p.oldPrice > p.price && (
                          <span className="old">{formatVND(p.oldPrice)}</span>
                        )}
                      </div>

                      <div className="home-actions">
                        <button
                          className={`p-addcart p-addcart--compact ${
                            soldOut ? "is-out" : ""
                          }`}
                          type="button"
                          onClick={() => !soldOut && onAddToCart(p)}
                          disabled={soldOut}
                        >
                          <span className="p-addcart__label">
                            {soldOut ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                          </span>
                          <span className="p-addcart__icon" aria-hidden="true">
                            🛒
                          </span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="promo__footer">
              <Link to="/productlist" className="promo__all">
                Xem tất cả <span className="promo__allIcon">›</span>
              </Link>
            </div>
          </section>

          {/* Best sellers */}
          <section className="block">
            <div className="block__head2">
              <div className="block__title2">TOP SẢN PHẨM BÁN CHẠY</div>
              <div className="nav2">
                <button type="button" className="nav2__btn">
                  ‹
                </button>
                <button type="button" className="nav2__btn">
                  ›
                </button>
              </div>
            </div>

            <div className="grid grid--blue">
              {bestSeller.map((p) => {
                const soldOut = !!p.isOutOfStock || p.discount === "Hết hàng";

                return (
                  <article className="card card--blue" key={p.id}>
                    {p.discount && (
                      <span
                        className={`badge badge--corner ${
                          soldOut ? "badge--sold" : ""
                        }`}
                      >
                        {p.discount}
                      </span>
                    )}

                    <div
                      className="card__img"
                      style={{ backgroundImage: `url(${p.image})` }}
                    />

                    {p.tag && <div className="badge">{p.tag}</div>}

                    <div className="card__name">{p.name}</div>

                    <div className="card__price">
                      <span className="price">{formatVND(p.price)}</span>
                      {p.oldPrice && (
                        <span className="old">{formatVND(p.oldPrice)}</span>
                      )}
                    </div>

                    <div className="home-actions">
                      <button
                        className={`p-addcart p-addcart--compact ${
                          soldOut ? "is-out" : ""
                        }`}
                        type="button"
                        onClick={() => !soldOut && onAddToCart(p)}
                        disabled={soldOut}
                      >
                        <span className="p-addcart__label">
                          {soldOut ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                        </span>
                        <span className="p-addcart__icon" aria-hidden="true">
                          🛒
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;