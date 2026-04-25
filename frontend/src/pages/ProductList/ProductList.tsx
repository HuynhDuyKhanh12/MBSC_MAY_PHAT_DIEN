import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getProductsApi } from "../../api/modules/productApi";
import "./product-list.css";

type Product = {
  id: number;
  name: string;
  brand?: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isHot?: boolean;
  isOutOfStock?: boolean;
  images?: string[];
  sku?: string;
};

type SortValue =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80";

const API_URL = "http://localhost:5000";

const formatVND = (n: number) =>
  Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

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

  const galleryImages = Array.isArray(item.images)
    ? item.images.map((img: any) => getImageSrc(img.url || img.imageUrl || img))
    : [];

  return {
    id: item.id,
    name: item.name || "Sản phẩm",
    sku: item.sku || "",
    brand: item.brand?.name || item.brandName || "MBSC",
    image: getImageSrc(mainImage),
    images: [getImageSrc(mainImage), ...galleryImages].filter(Boolean),
    price: finalPrice,
    oldPrice: salePrice > 0 && basePrice > salePrice ? basePrice : undefined,
    discountPercent:
      salePrice > 0 && basePrice > salePrice
        ? Math.round(((basePrice - salePrice) / basePrice) * 100)
        : undefined,
    isHot: Boolean(item.isFeatured),
    isOutOfStock: item.status === "OUT_OF_STOCK",
  };
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState<SortValue>("featured");

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImg, setActiveImg] = useState("");

  const [qty, setQty] = useState(1);
  const MIN_QTY = 1;
  const MAX_QTY = 99;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

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
        console.log("Lỗi tải sản phẩm:", error);
        alert(error?.response?.data?.message || "Không tải được sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const onAddToCart = (p: Product, q: number) => {
    alert(`Đã thêm vào giỏ: ${p.name} (SL: ${q})`);
  };

  const sorted = useMemo(() => {
    const arr = [...products];

    switch (sort) {
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      case "name-asc":
        return arr.sort((a, b) => a.name.localeCompare(b.name, "vi"));
      case "name-desc":
        return arr.sort((a, b) => b.name.localeCompare(a.name, "vi"));
      default:
        return arr.sort((a, b) => {
          const score = (p: Product) => {
            let s = 0;
            if (p.isOutOfStock) s -= 100;
            if (p.isHot) s += 20;
            if (p.discountPercent) s += Math.min(p.discountPercent, 30);
            return s;
          };
          return score(b) - score(a);
        });
    }
  }, [sort, products]);

  useEffect(() => {
    setPage(1);
  }, [sort, products]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);

  const pageItems = useMemo(() => {
    const items: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    const left = Math.max(1, safePage - 1);
    const right = Math.min(totalPages, safePage + 1);

    items.push(1);

    if (left > 2) items.push("...");

    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) items.push(i);
    }

    if (right < totalPages - 1) items.push("...");

    items.push(totalPages);

    return items;
  }, [safePage, totalPages]);

  const goPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const goToPage = (p: number) =>
    setPage(Math.min(Math.max(1, p), totalPages));

  const openQuickView = (p: Product) => {
    const imgs = p.images && p.images.length > 0 ? p.images : [p.image];

    setSelected(p);
    setActiveIndex(0);
    setActiveImg(imgs[0] || FALLBACK_IMG);
    setQty(1);
    setOpen(true);
  };

  const closeQuickView = () => {
    setOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };

    if (open) window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const decQty = () => setQty((q) => Math.max(MIN_QTY, q - 1));
  const incQty = () => setQty((q) => Math.min(MAX_QTY, q + 1));

  const selectedImages =
    selected?.images && selected.images.length > 0
      ? selected.images
      : selected
      ? [selected.image]
      : [];

  const currentOldPrice = selected?.oldPrice || 0;
  const currentPrice = selected?.price || 0;

  return (
    <>
      <Header />

      <div className="p-page">
        <div className="p-container">
          <div className="p-head">
            <div className="p-head-left">
              <h1 className="p-title">Tất cả sản phẩm</h1>
              <div className="p-count">{sorted.length} sản phẩm</div>
            </div>

            <div className="p-sort">
              <span className="p-sort-label">Sắp xếp</span>
              <select
                className="p-sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortValue)}
              >
                <option value="featured">Nổi bật</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên: A → Z</option>
                <option value="name-desc">Tên: Z → A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p style={{ padding: "30px 0", fontWeight: 700 }}>
              Đang tải sản phẩm...
            </p>
          ) : sorted.length === 0 ? (
            <p style={{ padding: "30px 0", fontWeight: 700 }}>
              Không có sản phẩm nào
            </p>
          ) : (
            <>
              <div className="p-grid">
                {visible.map((p) => {
                  const hasSale = !!p.discountPercent && !!p.oldPrice;

                  return (
                    <div
                      className={`p-card ${
                        p.isOutOfStock ? "is-disabled" : ""
                      }`}
                      key={p.id}
                    >
                      <div className={`p-media ${hasSale ? "has-sale" : ""}`}>
                        <img
                          className="p-img"
                          src={p.image}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMG;
                          }}
                        />

                        {p.isOutOfStock ? (
                          <span className="p-badge-stock">HẾT HÀNG</span>
                        ) : hasSale ? (
                          <span className="p-badge-discount">
                            -{p.discountPercent}%
                          </span>
                        ) : null}

                        {p.isHot && (
                          <div className="p-ribbon">
                            <span className="p-ribbon-top">ONLY TODAY</span>
                            <span className="p-ribbon-bottom">BIG SALE</span>
                          </div>
                        )}

                        {p.isHot && (
                          <div className="p-special">
                            <div className="p-special-top">
                              <span className="p-hot">HOT</span>
                              <span className="p-range">
                                25/04 - 30/04
                              </span>
                            </div>
                            <div className="p-special-title">
                              GIẢM GIÁ ĐẶC BIỆT
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          className="p-eye"
                          onClick={() => openQuickView(p)}
                        >
                          👁
                        </button>
                      </div>

                      <div className="p-body">
                        <div className="p-brand">{p.brand}</div>

                        <h3 className="p-name">{p.name}</h3>

                        <div className="p-price">
                          <span
                            className={`p-price-now ${
                              hasSale ? "is-sale" : ""
                            }`}
                          >
                            {formatVND(p.price)}
                          </span>

                          {p.oldPrice && (
                            <span className="p-price-old">
                              {formatVND(p.oldPrice)}
                            </span>
                          )}
                        </div>

                        <div className="p-actions">
                          <button
                            type="button"
                            className={`p-addcart ${
                              p.isOutOfStock ? "is-out" : ""
                            }`}
                            disabled={p.isOutOfStock}
                            onClick={() => onAddToCart(p, 1)}
                          >
                            <span className="p-addcart__label">
                              THÊM VÀO GIỎ
                            </span>
                            <span className="p-addcart__icon">🛒</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-pagination">
                <button
                  className="p-page-btn"
                  onClick={goPrevPage}
                  disabled={safePage === 1}
                >
                  Trước
                </button>

                <div className="p-page-numbers">
                  {pageItems.map((item, index) =>
                    item === "..." ? (
                      <span key={`dot-${index}`} className="p-page-dots">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        className={`p-page-num ${
                          item === safePage ? "is-active" : ""
                        }`}
                        onClick={() => goToPage(item)}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="p-page-btn"
                  onClick={goNextPage}
                  disabled={safePage === totalPages}
                >
                  Sau
                </button>

                <span className="p-page-meta">
                  Trang {safePage}/{totalPages}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {open && selected && (
        <div className="p-modal" onClick={closeQuickView}>
          <div className="p-modal__box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="p-modal__close"
              onClick={closeQuickView}
            >
              ×
            </button>

            <div className="p-modal__grid">
              <div className="p-modal__left">
                {selected.discountPercent && (
                  <div className="p-modal__badge">
                    <div className="p-modal__badgeTop">
                      -{selected.discountPercent}%
                    </div>
                    <div className="p-modal__badgeBot">GIẢM</div>
                  </div>
                )}

                <div className="p-modal__main">
                  <img
                    src={activeImg || FALLBACK_IMG}
                    alt={selected.name}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />

                  {selectedImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="p-modal__nav p-modal__nav--prev"
                        onClick={() => {
                          const nextIndex =
                            activeIndex === 0
                              ? selectedImages.length - 1
                              : activeIndex - 1;

                          setActiveIndex(nextIndex);
                          setActiveImg(selectedImages[nextIndex]);
                        }}
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        className="p-modal__nav p-modal__nav--next"
                        onClick={() => {
                          const nextIndex =
                            activeIndex === selectedImages.length - 1
                              ? 0
                              : activeIndex + 1;

                          setActiveIndex(nextIndex);
                          setActiveImg(selectedImages[nextIndex]);
                        }}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                <div className="p-modal__thumbs">
                  {selectedImages.map((img, index) => (
                    <button
                      type="button"
                      key={`${img}-${index}`}
                      className={`p-thumb ${
                        index === activeIndex ? "is-active" : ""
                      }`}
                      onClick={() => {
                        setActiveIndex(index);
                        setActiveImg(img);
                      }}
                    >
                      <img
                        src={img}
                        alt={selected.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-modal__right">
                <h2 className="p-modal__title">{selected.name}</h2>

                <div className="p-modal__meta">
                  <span>Thương hiệu:</span>
                  <span className="p-modal__code">{selected.brand}</span>

                  {selected.sku && (
                    <>
                      <span className="p-modal__sep">|</span>
                      <span>Mã:</span>
                      <span className="p-modal__code">{selected.sku}</span>
                    </>
                  )}

                  <span className="p-modal__sep">|</span>
                  <span
                    className={`p-modal__status ${
                      selected.isOutOfStock ? "is-out" : "is-in"
                    }`}
                  >
                    {selected.isOutOfStock ? "Hết hàng" : "Còn hàng"}
                  </span>
                </div>

                <div className="p-modal__priceRow">
                  <span className="p-modal__priceLabel">Giá</span>

                  <div className="p-modal__priceBlock">
                    <span className="p-modal__priceNow">
                      {formatVND(currentPrice)}
                    </span>

                    {currentOldPrice > currentPrice && (
                      <span className="p-modal__priceOld">
                        {formatVND(currentOldPrice)}
                      </span>
                    )}
                  </div>

                  {selected.discountPercent && (
                    <span className="p-modal__pct">
                      -{selected.discountPercent}%
                    </span>
                  )}
                </div>

                <div className="p-modal__qtyRow">
                  <span className="p-modal__qtyLabel">Số lượng</span>

                  <div className="p-qty">
                    <button type="button" onClick={decQty}>
                      -
                    </button>
                    <span>{qty}</span>
                    <button type="button" onClick={incQty}>
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-modal__add"
                  disabled={selected.isOutOfStock}
                  onClick={() => onAddToCart(selected, qty)}
                >
                  THÊM VÀO GIỎ
                </button>

                <div className="p-modal__share">
                  <span className="p-modal__shareLabel">Chia sẻ:</span>

                  <div className="p-modal__icons">
                    <a href="#" className="sicon sicon--fb">
                      f
                    </a>
                    <a href="#" className="sicon sicon--ms">
                      m
                    </a>
                    <a href="#" className="sicon sicon--tw">
                      t
                    </a>
                    <a href="#" className="sicon sicon--pt">
                      p
                    </a>
                    <a href="#" className="sicon sicon--ln">
                      in
                    </a>
                  </div>
                </div>

                <a href={`/san-pham/${selected.id}`} className="p-modal__detail">
                  Xem chi tiết sản phẩm
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}