// src/pages/Home/Home.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./home.css";
import { Link } from "react-router-dom";
import { getProductsApi } from "../../api/modules/productApi";

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
  discount?: string;
  discountPercent?: number;
  isHot?: boolean;
  isOutOfStock?: boolean;
  image: string;
};

const API_URL = "http://localhost:5000";

const formatVND = (n: number) =>
  Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80";

const pad2 = (n: number) => String(n).padStart(2, "0");

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function getImageSrc(image?: string) {
  if (!image || !String(image).trim()) return FALLBACK_IMG;

  const value = String(image).trim();

  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${API_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_URL}/${value}`;
  if (value.startsWith("/")) return `${API_URL}${value}`;

  return `${API_URL}/uploads/${value}`;
}

function mapApiProduct(item: any): Product {
  const basePrice = Number(item.basePrice || item.price || 0);
  const salePrice = item.salePrice ? Number(item.salePrice) : 0;
  const finalPrice = salePrice > 0 ? salePrice : basePrice;

  const mainImage =
    item.thumbnail ||
    item.image ||
    item.images?.find?.((img: any) => img.isMain)?.url ||
    item.images?.find?.((img: any) => img.isMain)?.imageUrl ||
    item.images?.[0]?.url ||
    item.images?.[0]?.imageUrl ||
    "";

  const percent =
    salePrice > 0 && basePrice > salePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : 0;

  return {
    id: Number(item.id),
    name: item.name || "Sản phẩm",
    brand: item.brand?.name || item.brandName || "MBSC",
    price: finalPrice,
    oldPrice: percent > 0 ? basePrice : undefined,
    tag: percent > 0 ? "KHUYẾN MÃI ĐẶC BIỆT" : "SẢN PHẨM NỔI BẬT",
    discount: item.status === "OUT_OF_STOCK" ? "Hết hàng" : percent > 0 ? `-${percent}%` : "",
    discountPercent: percent,
    isHot: Boolean(item.isFeatured),
    isOutOfStock: item.status === "OUT_OF_STOCK",
    image: getImageSrc(mainImage),
  };
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const banners = useMemo(
    () => [
      {
        id: 1,
        title: "MÁY PHÁT ĐIỆN",
        subtitle: "SẢN PHẨM CHÍNH HÃNG",
        image:
          "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      },
      {
        id: 2,
        title: "BẢO TRÌ - SỬA CHỮA",
        subtitle: "HỖ TRỢ NHANH CHÓNG",
        image:
          "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    []
  );

  const categories: Category[] = useMemo(
    () => [
      { id: 1, name: "Máy phát điện", icon: "⚙️" },
      { id: 2, name: "Phụ kiện", icon: "🔧" },
      { id: 3, name: "Bảo trì", icon: "🛠️" },
      { id: 4, name: "Sửa chữa", icon: "🔩" },
    ],
    []
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const res = await getProductsApi();

        const data = normalizeArrayResponse(res)
          .filter((item: any) => !item.deletedAt)
          .filter(
            (item: any) =>
              item.status === "ACTIVE" || item.status === "OUT_OF_STOCK"
          )
          .map(mapApiProduct);

        setProducts(data);
      } catch (error: any) {
        console.log("Lỗi tải sản phẩm Home:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const promoProducts = useMemo(() => {
    const saleProducts = products.filter(
      (p) => Number(p.discountPercent || 0) > 0 || p.isHot
    );

    return (saleProducts.length > 0 ? saleProducts : products).slice(0, 8);
  }, [products]);

  const bestSeller = useMemo(() => {
    const hotProducts = products.filter((p) => p.isHot);

    return (hotProducts.length > 0 ? hotProducts : products).slice(0, 8);
  }, [products]);

  const len = banners.length;
  const [slideIndex, setSlideIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
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
    setIsAnimating(true);
    setSlideIndex(idx + 1);
  };

  const [isHoverSlider, setIsHoverSlider] = useState(false);
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

  const nextBanner = () => {
    goNext();
    restartAuto();
  };

  const prevBanner = () => {
    goPrev();
    restartAuto();
  };

  const onTrackTransitionEnd = () => {
    if (slideIndex === 0) {
      setIsAnimating(false);
      setSlideIndex(len);
    } else if (slideIndex === len + 1) {
      setIsAnimating(false);
      setSlideIndex(1);
    }
  };

  useEffect(() => {
    if (!isAnimating) {
      const id = window.setTimeout(() => setIsAnimating(true), 0);
      return () => window.clearTimeout(id);
    }
  }, [isAnimating]);

  const slides = useMemo(() => {
    if (len === 0) return [];

    const first = banners[0];
    const last = banners[len - 1];

    return [last, ...banners, first];
  }, [banners, len]);

  const [leftMs, setLeftMs] = useState<number>(
    2 * 24 * 60 * 60 * 1000 +
      3 * 60 * 60 * 1000 +
      25 * 60 * 1000 +
      40 * 1000
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

  const promoWrapRef = useRef<HTMLDivElement | null>(null);

  const promoScroll = (dir: "left" | "right") => {
    const el = promoWrapRef.current;
    if (!el) return;

    const step = el.clientWidth * 0.9;
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  function onAddToCart(p: Product) {
    console.log("ADD TO CART:", p);
    alert(`Đã thêm "${p.name}" vào giỏ`);
  }

  return (
    <>
      <Header />

      <main className="home">
        <div className="container">
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

          <section className="quick">
            {categories.map((c) => (
              <Link to="/productlist" className="quick__card" key={c.id}>
                <div className="quick__img">{c.icon}</div>
                <div className="quick__name">{c.name}</div>
                <div className="quick__link">Xem ngay</div>
              </Link>
            ))}
          </section>

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
                {loadingProducts ? (
                  <div style={{ padding: 20, fontWeight: 700 }}>
                    Đang tải sản phẩm...
                  </div>
                ) : promoProducts.length === 0 ? (
                  <div style={{ padding: 20, fontWeight: 700 }}>
                    Chưa có sản phẩm
                  </div>
                ) : (
                  promoProducts.map((p) => {
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

                    const soldOut =
                      !!p.isOutOfStock || p.discount === "Hết hàng";

                    return (
                      <article className="card card--blue" key={p.id}>
                        <Link to={`/san-pham/${p.id}`}>
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
                              <span className="old">
                                {formatVND(p.oldPrice)}
                              </span>
                            )}
                          </div>
                        </Link>

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
                            <span
                              className="p-addcart__icon"
                              aria-hidden="true"
                            >
                              🛒
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            <div className="promo__footer">
              <Link to="/productlist" className="promo__all">
                Xem tất cả <span className="promo__allIcon">›</span>
              </Link>
            </div>
          </section>

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
              {loadingProducts ? (
                <div style={{ padding: 20, fontWeight: 700 }}>
                  Đang tải sản phẩm...
                </div>
              ) : bestSeller.length === 0 ? (
                <div style={{ padding: 20, fontWeight: 700 }}>
                  Chưa có sản phẩm bán chạy
                </div>
              ) : (
                bestSeller.map((p) => {
                  const soldOut = !!p.isOutOfStock || p.discount === "Hết hàng";

                  return (
                    <article className="card card--blue" key={p.id}>
                      <Link to={`/san-pham/${p.id}`}>
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
                          style={{
                            backgroundImage: `url(${p.image || FALLBACK_IMG})`,
                          }}
                        />

                        {p.tag && <div className="badge">{p.tag}</div>}

                        <div className="card__name">{p.name}</div>

                        <div className="card__price">
                          <span className="price">{formatVND(p.price)}</span>

                          {p.oldPrice && p.oldPrice > p.price && (
                            <span className="old">{formatVND(p.oldPrice)}</span>
                          )}
                        </div>
                      </Link>

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
                })
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;