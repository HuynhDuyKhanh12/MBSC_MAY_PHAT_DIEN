import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./product-detail.css";
import {
  getProductByIdApi,
  getProductsApi,
} from "../../api/modules/productApi";
import { addToCartApi } from "../../api/modules/cartApi";

type Product = {
  id: number;
  variantId?: number | null;
  name: string;
  sku?: string;
  brand?: string;
  category?: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isHot?: boolean;
  isOutOfStock?: boolean;
  images?: string[];
  description?: string;
};

type Voucher = {
  title: string;
  desc: string;
  code: string;
  expiry: string;
};

const API_URL = "http://localhost:5000";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80";

const VOUCHERS: Voucher[] = [
  {
    title: "Miễn phí vận chuyển",
    desc: "Đơn hàng từ 300k",
    code: "A87TYRT55",
    expiry: "10/04/2026",
  },
  {
    title: "Giảm 20%",
    desc: "Đơn hàng từ 200k",
    code: "QH5G8JOY",
    expiry: "05/05/2026",
  },
  {
    title: "Giảm 50k",
    desc: "Đơn hàng từ 500k",
    code: "FT45YUO8H",
    expiry: "10/05/2026",
  },
  {
    title: "Giảm 10%",
    desc: "Đơn hàng từ 100k",
    code: "A789UYT",
    expiry: "20/05/2026",
  },
];

const formatVND = (n: number) =>
  Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function normalizeObjectResponse(res: any) {
  return res?.data?.data || res?.data || res || null;
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

  const galleryImages = Array.isArray(item.images)
    ? item.images.map((img: any) => getImageSrc(img.url || img.imageUrl || img))
    : [];

  const image = getImageSrc(mainImage);

  return {
    id: Number(item.id),
    variantId: item.variants?.[0]?.id ?? item.productVariants?.[0]?.id ?? null,
    name: item.name || "Sản phẩm",
    sku: item.sku || "",
    brand: item.brand?.name || item.brandName || "MBSC",
    category: item.category?.name || item.categoryName || "",
    image,
    images: [image, ...galleryImages].filter(Boolean),
    price: finalPrice,
    oldPrice: salePrice > 0 && basePrice > salePrice ? basePrice : undefined,
    discountPercent:
      salePrice > 0 && basePrice > salePrice
        ? Math.round(((basePrice - salePrice) / basePrice) * 100)
        : undefined,
    isHot: Boolean(item.isFeatured),
    isOutOfStock: item.status === "OUT_OF_STOCK",
    description:
      item.description ||
      item.shortDescription ||
      "Chưa có mô tả cho sản phẩm này.",
  };
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Đã sao chép mã: " + text);
  } catch {
    alert("Không copy được, bạn copy thủ công nhé: " + text);
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [active, setActive] = useState(0);
  const MIN = 1;
  const MAX = 99;
  const [qty, setQty] = useState(1);

  const relatedRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProductDetail = async () => {
      if (!Number.isFinite(productId)) return;

      try {
        setLoading(true);

        const [detailRes, listRes] = await Promise.all([
          getProductByIdApi(productId),
          getProductsApi(),
        ]);

        const detailData = normalizeObjectResponse(detailRes);
        const listData = normalizeArrayResponse(listRes)
          .filter((item: any) => !item.deletedAt)
          .filter(
            (item: any) =>
              item.status === "ACTIVE" || item.status === "OUT_OF_STOCK"
          )
          .map(mapApiProduct);

        setProduct(detailData ? mapApiProduct(detailData) : null);
        setAllProducts(listData);
      } catch (error: any) {
        console.log("Lỗi tải chi tiết sản phẩm:", error);
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được chi tiết sản phẩm"
        );
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [productId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  useEffect(() => {
    setActive(0);
    setQty(1);
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    const key = "viewed_products";
    const raw = localStorage.getItem(key);
    const prev: number[] = raw ? JSON.parse(raw) : [];
    const next = [product.id, ...prev.filter((x) => x !== product.id)].slice(
      0,
      12
    );

    localStorage.setItem(key, JSON.stringify(next));
  }, [product]);

  const viewedIds = useMemo(() => {
    const raw = localStorage.getItem("viewed_products");
    return raw ? (JSON.parse(raw) as number[]) : [];
  }, [productId, product]);

  const imgs = useMemo(() => {
    if (!product) return [FALLBACK_IMG];

    const list = product.images?.length ? product.images : [product.image];

    return list.length ? list : [FALLBACK_IMG];
  }, [product]);

  const hasSale = !!product?.oldPrice && product.oldPrice > product.price;

  const discountPct =
    product?.discountPercent ??
    (hasSale
      ? Math.round(
          ((product!.oldPrice! - product!.price) / product!.oldPrice!) * 100
        )
      : 0);

  const related = useMemo(() => {
    if (!product) return [];

    return allProducts
      .filter((p) => p.id !== product.id)
      .filter(
        (p) =>
          (product.brand && p.brand === product.brand) ||
          (product.category && p.category === product.category)
      )
      .slice(0, 12);
  }, [product, allProducts]);

  const viewed = useMemo(() => {
    const map = new Map(allProducts.map((p) => [p.id, p]));

    return viewedIds
      .map((x) => map.get(x))
      .filter(Boolean)
      .filter((p) => p?.id !== product?.id) as Product[];
  }, [viewedIds, allProducts, product]);

  const scrollBy = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: "left" | "right"
  ) => {
    const el = ref.current;
    if (!el) return;

    const amt = Math.min(720, el.clientWidth);
    el.scrollBy({
      left: dir === "left" ? -amt : amt,
      behavior: "smooth",
    });
  };

  const onAddToCart = async (p: Product, q: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/auth");
        return;
      }

      if (p.isOutOfStock) {
        alert("Sản phẩm đã hết hàng");
        return;
      }

      setAdding(true);

      await addToCartApi({
        productId: p.id,
        quantity: q,
        variantId: p.variantId ?? null,
      });

      alert("Đã thêm sản phẩm vào giỏ hàng");
      navigate("/cart");
    } catch (error: any) {
      console.log("Lỗi thêm vào giỏ:", error?.response?.data || error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Thêm vào giỏ hàng thất bại"
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="pd-wrap">
          <div className="pd-container">
            <div className="pd-notfound">Đang tải chi tiết sản phẩm...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="pd-wrap">
          <div className="pd-container">
            <div className="pd-notfound">
              Không tìm thấy sản phẩm (ID: {String(id)}).{" "}
              <button
                className="pd-back"
                type="button"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="pd-wrap">
        <div className="pd-container">
          <div className="pd-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <Link to="/san-pham">Sản phẩm khuyến mãi</Link>
            <span>/</span>
            <b>{product.name}</b>
          </div>

          <div className="pd-top">
            <div className="pd-gallery">
              <div className="pd-thumbs">
                {imgs.map((src, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${i === active ? "is-active" : ""}`}
                    onClick={() => setActive(i)}
                    type="button"
                    aria-label={`thumb ${i + 1}`}
                  >
                    <img
                      src={src || FALLBACK_IMG}
                      alt={`thumb ${i + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  </button>
                ))}
              </div>

              <div className="pd-stage">
                <img
                  src={imgs[active] || FALLBACK_IMG}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
              </div>
            </div>

            <div className="pd-info">
              <h1 className="pd-title">{product.name}</h1>

              <div className="pd-meta">
                <span>Mã sản phẩm:</span>
                <b className="pd-code">
                  {product.sku || `DJI-${String(product.id).padStart(5, "0")}`}
                </b>
                <span className="pd-sep">|</span>
                <span>Tình trạng:</span>
                <b
                  className={`pd-stock ${
                    product.isOutOfStock ? "is-out" : "is-in"
                  }`}
                >
                  {product.isOutOfStock ? "Hết hàng" : "Còn hàng"}
                </b>
              </div>

              <div className="pd-pricebox">
                <div className="pd-priceRow">
                  <div className="pd-priceLabel">Giá:</div>

                  <div className="pd-priceMain">
                    <div className="pd-priceNow">
                      {formatVND(product.price)}
                    </div>

                    {hasSale && (
                      <div className="pd-priceOld">
                        {formatVND(product.oldPrice!)}
                      </div>
                    )}
                  </div>

                  {discountPct > 0 && (
                    <div className="pd-discount">-{discountPct}%</div>
                  )}
                </div>
              </div>

              <div className="pd-qtyRow">
                <div className="pd-qtyLabel">Số lượng:</div>

                <div className="pd-qty">
                  <button
                    className="pd-qtyBtn"
                    type="button"
                    onClick={() => setQty((q) => Math.max(MIN, q - 1))}
                    disabled={qty <= MIN}
                    aria-label="minus"
                  >
                    −
                  </button>

                  <input
                    className="pd-qtyNum"
                    value={qty}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isNaN(n)) return;
                      setQty(Math.min(MAX, Math.max(MIN, Math.floor(n))));
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label="quantity"
                  />

                  <button
                    className="pd-qtyBtn"
                    type="button"
                    onClick={() => setQty((q) => Math.min(MAX, q + 1))}
                    disabled={qty >= MAX}
                    aria-label="plus"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pd-cta">
                <button
                  className="pd-add"
                  type="button"
                  disabled={!!product.isOutOfStock || adding}
                  onClick={() => {
                    if (product.isOutOfStock) return;
                    onAddToCart(product, qty);
                  }}
                >
                  {adding ? "ĐANG THÊM..." : "THÊM VÀO GIỎ"}
                </button>

                <button
                  className="pd-buy"
                  type="button"
                  disabled={!!product.isOutOfStock || adding}
                  onClick={() => {
                    if (product.isOutOfStock) return;
                    onAddToCart(product, qty);
                  }}
                >
                  {adding ? "ĐANG XỬ LÝ..." : "MUA NGAY"}
                </button>
              </div>

              <div className="pd-share">
                <div className="pd-shareLabel">Chia sẻ:</div>
                <div className="pd-shareIcons">
                  <a className="pd-sicon" href="#" aria-label="Facebook">
                    f
                  </a>
                  <a className="pd-sicon" href="#" aria-label="Messenger">
                    ✉
                  </a>
                  <a className="pd-sicon" href="#" aria-label="Twitter">
                    t
                  </a>
                  <a className="pd-sicon" href="#" aria-label="Pinterest">
                    p
                  </a>
                  <a className="pd-sicon" href="#" aria-label="Link">
                    🔗
                  </a>
                </div>
              </div>

              <div className="pd-policy">
                <div className="pd-policyCol">
                  <h3>Chính sách bán hàng</h3>
                  <ul>
                    <li>
                      <span className="pd-ico">▦</span> Cam kết 100% chính hãng
                    </li>
                    <li>
                      <span className="pd-ico">🚚</span> Miễn phí giao hàng
                    </li>
                    <li>
                      <span className="pd-ico">☎</span> Hỗ trợ 24/7
                    </li>
                  </ul>
                </div>

                <div className="pd-policyCol">
                  <h3>Thông tin thêm</h3>
                  <ul>
                    <li>
                      <span className="pd-ico">✓</span> Hoàn tiền 111% nếu hàng
                      giả
                    </li>
                    <li>
                      <span className="pd-ico">📦</span> Mở hộp kiểm tra nhận
                      hàng
                    </li>
                    <li>
                      <span className="pd-ico">↩</span> Đổi trả trong 7 ngày
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <section className="pd-section">
            <h2 className="pd-sectionTitle">Khuyến mãi dành cho bạn</h2>

            <div className="pd-vouchers">
              {VOUCHERS.map((v, idx) => (
                <div className="pd-voucher" key={idx}>
                  <div className="pd-voucherLeft">
                    <div className="pd-voucherTitle">{v.title}</div>
                    <div className="pd-voucherDesc">{v.desc}</div>
                    <div className="pd-voucherMeta">
                      <span>
                        Mã: <b>{v.code}</b>
                      </span>
                      <span>HSD: {v.expiry}</span>
                    </div>
                  </div>

                  <button
                    className="pd-voucherBtn"
                    onClick={() => copyText(v.code)}
                    type="button"
                  >
                    SAO CHÉP MÃ
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="pd-section">
            <h2 className="pd-sectionTitle">MÔ TẢ SẢN PHẨM</h2>
            <div className="pd-desc">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </div>
          </section>

          <section className="pd-section">
            <div className="pd-rowHead">
              <h2 className="pd-bigTitle">Sản phẩm liên quan</h2>

              <div className="pd-nav">
                <button
                  className="pd-navBtn"
                  onClick={() => scrollBy(relatedRef, "left")}
                  type="button"
                >
                  ‹
                </button>
                <button
                  className="pd-navBtn"
                  onClick={() => scrollBy(relatedRef, "right")}
                  type="button"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="pd-hscroll" ref={relatedRef}>
              {related.length === 0 ? (
                <div className="pd-empty">Chưa có sản phẩm liên quan</div>
              ) : (
                related.map((p) => (
                  <Link
                    to={`/san-pham/${p.id}`}
                    className="pd-miniCard"
                    key={p.id}
                  >
                    <div className="pd-miniMedia">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                      />

                      {p.discountPercent ? (
                        <span className="pd-miniBadge">
                          -{p.discountPercent}%
                        </span>
                      ) : null}
                    </div>

                    <div className="pd-miniName">{p.name}</div>
                    <div className="pd-miniPrice">{formatVND(p.price)}</div>

                    <div className="pd-miniBtn">
                      THÊM VÀO GIỎ <span>🛒</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="pd-section">
            <h2 className="pd-bigTitle">Sản phẩm đã xem</h2>

            <div className="pd-hscroll" ref={viewedRef}>
              {viewed.length === 0 ? (
                <div className="pd-empty">Chưa có sản phẩm đã xem</div>
              ) : (
                viewed.map((p) => (
                  <Link
                    to={`/san-pham/${p.id}`}
                    className="pd-miniCard"
                    key={p.id}
                  >
                    <div className="pd-miniMedia">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                      />

                      {p.discountPercent ? (
                        <span className="pd-miniBadge">
                          -{p.discountPercent}%
                        </span>
                      ) : null}
                    </div>

                    <div className="pd-miniName">{p.name}</div>
                    <div className="pd-miniPrice">{formatVND(p.price)}</div>

                    <div className="pd-miniBtn">
                      THÊM VÀO GIỎ <span>🛒</span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="pd-navBottom">
              <button
                className="pd-navBtn"
                onClick={() => scrollBy(viewedRef, "left")}
                type="button"
              >
                ‹
              </button>
              <button
                className="pd-navBtn"
                onClick={() => scrollBy(viewedRef, "right")}
                type="button"
              >
                ›
              </button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}