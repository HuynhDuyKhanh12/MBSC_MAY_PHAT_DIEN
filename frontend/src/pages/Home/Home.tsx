import React, { useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./home.css";

type Category = {
  id: number;
  name: string;
  icon: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  discount?: string;
  image: string;
};

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

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

  const promoProducts: Product[] = useMemo(
    () => [
      {
        id: 1,
        name: "Phantom 4 RTK SDK",
        price: 21000000,
        oldPrice: 22100000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-8%",
        image:
          "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Flycam DJI Mavic Air - Combo Red",
        price: 19900000,
        oldPrice: 20900000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-5%",
        image:
          "https://images.unsplash.com/photo-1520975693411-b61ce40b7d4c?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Phantom 4 Pro V2.0 (Chính hãng)",
        price: 35500000,
        oldPrice: 37500000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-5%",
        image:
          "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Phantom 4 Multispectral (Chính hãng)",
        price: 34000000,
        oldPrice: 35000000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-5%",
        image:
          "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Parrot ANAFI Thermal",
        price: 9900000,
        oldPrice: 10500000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-5%",
        image:
          "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "DJI Mavic Air Fly More Combo Arctic White",
        price: 18900000,
        oldPrice: 19900000,
        tag: "KHUYẾN MÃI ĐẶC BIỆT",
        discount: "-6%",
        image:
          "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    []
  );

  const bestSeller: Product[] = useMemo(
    () => [
      {
        id: 11,
        name: "DJI FPV Combo (Chính hãng)",
        price: 22990000,
        oldPrice: 29990000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-23%",
        image:
          "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 12,
        name: "DJI FPV Experience Combo",
        price: 16990000,
        oldPrice: 18990000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-11%",
        image:
          "https://images.unsplash.com/photo-1520975693411-b61ce40b7d4c?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 13,
        name: "DJI FPV Goggles V2",
        price: 13390000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "Hết hàng",
        image:
          "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 14,
        name: "DJI Mavic Mini 2 (Chính hãng)",
        price: 10890000,
        oldPrice: 12990000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-6%",
        image:
          "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 15,
        name: "DJI Mini 3 Pro Smart Controller",
        price: 21590000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "Only today",
        image:
          "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: 16,
        name: "Matrice 200 Series",
        price: 25900000,
        tag: "GIẢM GIÁ ĐẶC BIỆT",
        discount: "-10%",
        image:
          "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    []
  );

  const [activeBanner, setActiveBanner] = useState<number>(0);

  const nextBanner = () =>
    setActiveBanner((p) => (p + 1) % banners.length);
  const prevBanner = () =>
    setActiveBanner((p) => (p - 1 + banners.length) % banners.length);

  const current = banners[activeBanner];

  return (
    <>
      <Header />

      <main className="home">
        <div className="container">
          {/* Slider */}
          <section className="slider">
            <button className="slider__nav slider__nav--left" type="button" onClick={prevBanner}>
              ‹
            </button>

            <div
              className="slider__bg"
              style={{ backgroundImage: `url(${current.image})` }}
            >
              <div className="slider__overlay">
                <div className="slider__title">{current.title}</div>
                <div className="slider__sub">{current.subtitle}</div>
              </div>
            </div>

            <button className="slider__nav slider__nav--right" type="button" onClick={nextBanner}>
              ›
            </button>

            <div className="slider__dots">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  className={`dot ${idx === activeBanner ? "dot--active" : ""}`}
                  onClick={() => setActiveBanner(idx)}
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

          {/* Categories */}
          <section className="cats">
            <div className="cats__bar">
              <div className="cats__title">Xu hướng tìm kiếm</div>
              <button className="cats__btn" type="button">XEM NGAY</button>
            </div>

            <div className="cats__list">
              {categories.map((c) => (
                <div className="cat" key={c.id}>
                  <div className="cat__icon">{c.icon}</div>
                  <div className="cat__name">{c.name}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Promo products */}
          <section className="block">
            <div className="block__head">
              <div className="block__title">SẢN PHẨM KHUYẾN MÃI</div>
              <div className="block__timer">
                <span className="time">00</span>:<span className="time">00</span>:
                <span className="time">00</span>
              </div>
            </div>

            <div className="grid">
              {promoProducts.map((p) => (
                <article className="card" key={p.id}>
                  {p.discount && <span className="badge badge--corner">{p.discount}</span>}
                  <div className="card__img" style={{ backgroundImage: `url(${p.image})` }} />
                  {p.tag && <div className="badge">{p.tag}</div>}
                  <div className="card__name">{p.name}</div>
                  <div className="card__price">
                    <span className="price">{formatVND(p.price)}</span>
                    {p.oldPrice && <span className="old">{formatVND(p.oldPrice)}</span>}
                  </div>
                  <button className="card__btn" type="button">THÊM VÀO GIỎ</button>
                </article>
              ))}
            </div>

            <div className="center">
              <button className="outline" type="button">Xem tất cả</button>
            </div>
          </section>

          {/* Best sellers */}
          <section className="block">
            <div className="block__head2">
              <div className="block__title2">TOP SẢN PHẨM BÁN CHẠY</div>
              <div className="nav2">
                <button type="button" className="nav2__btn">‹</button>
                <button type="button" className="nav2__btn">›</button>
              </div>
            </div>

            <div className="grid grid--blue">
              {bestSeller.map((p) => (
                <article className="card card--blue" key={p.id}>
                  {p.discount && (
                    <span className={`badge badge--corner ${p.discount === "Hết hàng" ? "badge--sold" : ""}`}>
                      {p.discount}
                    </span>
                  )}
                  <div className="card__img" style={{ backgroundImage: `url(${p.image})` }} />
                  {p.tag && <div className="badge">{p.tag}</div>}
                  <div className="card__name">{p.name}</div>
                  <div className="card__price">
                    <span className="price">{formatVND(p.price)}</span>
                    {p.oldPrice && <span className="old">{formatVND(p.oldPrice)}</span>}
                  </div>
                  <button className="card__btn" type="button">
                    {p.discount === "Hết hàng" ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;