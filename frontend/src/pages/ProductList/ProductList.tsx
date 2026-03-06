import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
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
};

type SortValue = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80";

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Máy phát điện diesel 10KVA",
    brand: "KUBOTA",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 18990000,
    oldPrice: 20990000,
    discountPercent: 10,
    isHot: true,
  },
  {
    id: 2,
    name: "Máy phát điện gia đình 3KVA",
    brand: "HONDA",
    image:
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092334867-1f2f0e0cb21f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 5990000,
  },
  {
    id: 3,
    name: "Dịch vụ bảo dưỡng máy phát điện",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 490000,
    oldPrice: 550000,
    discountPercent: 11,
  },
  {
    id: 4,
    name: "Sửa chữa bo mạch AVR",
    brand: "AVR",
    image:
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 350000,
    isHot: true,
  },
  {
    id: 5,
    name: "Máy phát điện diesel 10KVA",
    brand: "KUBOTA",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 18990000,
    oldPrice: 20990000,
    discountPercent: 10,
    isHot: true,
  },
  {
    id: 6,
    name: "Máy phát điện gia đình 3KVA",
    brand: "HONDA",
    image:
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092334867-1f2f0e0cb21f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 5990000,
  },
  {
    id: 7,
    name: "Dịch vụ bảo dưỡng máy phát điện",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 490000,
    oldPrice: 550000,
    discountPercent: 11,
  },
  {
    id: 8,
    name: "Sửa chữa bo mạch AVR",
    brand: "AVR",
    image:
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 350000,
    isHot: true,
  },
  {
    id: 9,
    name: "Máy phát điện diesel 10KVA",
    brand: "KUBOTA",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 18990000,
    oldPrice: 20990000,
    discountPercent: 10,
    isHot: true,
  },
  {
    id: 10,
    name: "Máy phát điện gia đình 3KVA",
    brand: "HONDA",
    image:
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092334867-1f2f0e0cb21f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 5990000,
  },
  {
    id: 11,
    name: "Dịch vụ bảo dưỡng máy phát điện",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 490000,
    oldPrice: 550000,
    discountPercent: 11,
  },
  {
    id: 12,
    name: "Sửa chữa bo mạch AVR",
    brand: "AVR",
    image:
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 350000,
    isHot: true,
  },
  // ... bạn thêm tiếp như cũ
];

export default function ProductList() {
  const [sort, setSort] = useState<SortValue>("featured");

  // Pagination
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  // Gallery state
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImg, setActiveImg] = useState<string>("");

  // ✅ Qty state
  const [qty, setQty] = useState(1);
  const MIN_QTY = 1;
  const MAX_QTY = 99;

  // ✅ onAddToCart nhận qty
  const onAddToCart = (p: Product, q: number) => {
    alert(`Đã thêm vào giỏ: ${p.name} (SL: ${q})`);
    // TODO: sau này bạn thay bằng logic add cart thật (context/redux/localStorage/api)
  };

  const sorted = useMemo(() => {
    const arr = [...PRODUCTS];

    const byPriceAsc = (a: Product, b: Product) => a.price - b.price;
    const byPriceDesc = (a: Product, b: Product) => b.price - a.price;
    const byNameAsc = (a: Product, b: Product) => a.name.localeCompare(b.name, "vi");
    const byNameDesc = (a: Product, b: Product) => b.name.localeCompare(a.name, "vi");

    switch (sort) {
      case "price-asc":
        return arr.sort(byPriceAsc);
      case "price-desc":
        return arr.sort(byPriceDesc);
      case "name-asc":
        return arr.sort(byNameAsc);
      case "name-desc":
        return arr.sort(byNameDesc);
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
  }, [sort]);

  useEffect(() => setPage(1), [sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);

  const goPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

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
    for (let i = left; i <= right; i++) if (i !== 1 && i !== totalPages) items.push(i);
    if (right < totalPages - 1) items.push("...");
    items.push(totalPages);
    return items;
  }, [safePage, totalPages]);

  const openQuickView = (p: Product) => {
    const imgs = (p.images && p.images.length > 0 ? p.images : [p.image]).filter(Boolean);
    const first = (imgs[0] || p.image) || FALLBACK_IMG;

    setSelected(p);
    setActiveIndex(0);
    setActiveImg(first);

    // ✅ reset qty mỗi lần mở modal
    setQty(MIN_QTY);

    setOpen(true);
  };

  const closeQuickView = () => {
    setOpen(false);
    setSelected(null);
  };

  // ESC đóng modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ✅ helpers qty
  const decQty = () => setQty((q) => Math.max(MIN_QTY, q - 1));
  const incQty = () => setQty((q) => Math.min(MAX_QTY, q + 1));
  const onQtyInput = (v: string) => {
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setQty(Math.min(MAX_QTY, Math.max(MIN_QTY, Math.floor(n))));
  };

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

          <div className="p-grid">
            {visible.map((p) => {
              const hasSale = !!p.discountPercent && p.discountPercent > 0;

              return (
                <div className={`p-card ${p.isOutOfStock ? "is-disabled" : ""}`} key={p.id}>
                  <div className={`p-media ${(p.isHot || hasSale) ? "has-sale" : ""}`}>
                    <button
                      className="p-eye"
                      type="button"
                      onClick={() => openQuickView(p)}
                      aria-label="Xem nhanh"
                      title="Xem nhanh"
                    >
                      👁
                    </button>

                    {hasSale && <span className="p-badge-discount">-{p.discountPercent}%</span>}
                    {p.isOutOfStock && <span className="p-badge-stock">Hết hàng</span>}

                    {(p.isHot || hasSale) && (
                      <div className="p-ribbon">
                        <span className="p-ribbon-top">ONLY TODAY</span>
                        <span className="p-ribbon-bottom">BIG SALE</span>
                      </div>
                    )}

                    <img
                      className="p-img"
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = FALLBACK_IMG;
                      }}
                    />

                    {(p.isHot || hasSale) && (
                      <div className="p-special">
                        <div className="p-special-top">
                          <span className="p-hot">🔥 HOT</span>
                          <span className="p-range">20/4 - 30/4</span>
                        </div>
                        <div className="p-special-title">GIẢM GIÁ ĐẶC BIỆT</div>
                      </div>
                    )}
                  </div>

                  <div className="p-body">
                    <div className="p-brand">{p.brand || "MBSC"}</div>

                    <h3 className="p-name" title={p.name}>
                      {p.name}
                    </h3>

                    <div className="p-price">
                      <span className={`p-price-now ${p.oldPrice ? "is-sale" : ""}`}>
                        {formatVND(p.price)}
                      </span>

                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="p-price-old">{formatVND(p.oldPrice)}</span>
                      )}
                    </div>

                    <div className="p-actions">
                      <button
                        className={`p-addcart ${p.isOutOfStock ? "is-out" : ""}`}
                        type="button"
                        onClick={() => !p.isOutOfStock && onAddToCart(p, 1)} // list add nhanh = 1
                        disabled={p.isOutOfStock}
                      >
                        <span className="p-addcart__label">
                          {p.isOutOfStock ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                        </span>
                        <span className="p-addcart__icon" aria-hidden="true">
                          🛒
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination giữ nguyên... */}
          <div className="p-pagination">
            <button className="p-page-btn" type="button" onClick={goPrevPage} disabled={safePage === 1}>
              ← Trước
            </button>

            <div className="p-page-numbers" role="navigation" aria-label="Pagination">
              {pageItems.map((it, idx) => {
                if (it === "...") return <span className="p-page-dots" key={`dots-${idx}`}>...</span>;
                const n = it;
                const active = n === safePage;
                return (
                  <button
                    key={n}
                    type="button"
                    className={`p-page-num ${active ? "is-active" : ""}`}
                    onClick={() => goToPage(n)}
                    aria-current={active ? "page" : undefined}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            <button
              className="p-page-btn"
              type="button"
              onClick={goNextPage}
              disabled={safePage === totalPages}
            >
              Sau →
            </button>

            <div className="p-page-meta">
              Trang {safePage}/{totalPages}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL QUICK VIEW (SLIDE) */}
      {open && selected && (() => {
        const imgs = (
          selected.images && selected.images.length > 0 ? selected.images : [selected.image]
        ).filter(Boolean);

        const hasSale = !!selected.oldPrice && selected.oldPrice > selected.price;
        const discountPct =
          selected.discountPercent ??
          (hasSale
            ? Math.round(((selected.oldPrice! - selected.price) / selected.oldPrice!) * 100)
            : 0);

        const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(0, imgs.length - 1));
        const canPrev = safeIndex > 0;
        const canNext = safeIndex < imgs.length - 1;

        const goPrevImg = () => {
          if (!canPrev) return;
          const next = safeIndex - 1;
          setActiveIndex(next);
          setActiveImg(imgs[next] || FALLBACK_IMG);
        };

        const goNextImg = () => {
          if (!canNext) return;
          const next = safeIndex + 1;
          setActiveIndex(next);
          setActiveImg(imgs[next] || FALLBACK_IMG);
        };

        const goToImg = (i: number) => {
          const next = Math.min(Math.max(i, 0), imgs.length - 1);
          setActiveIndex(next);
          setActiveImg(imgs[next] || FALLBACK_IMG);
        };

        const disableDec = qty <= MIN_QTY;
        const disableInc = qty >= MAX_QTY;

        return (
          <div className="p-modal" role="dialog" aria-modal="true" onClick={closeQuickView}>
            <div className="p-modal__box" onClick={(e) => e.stopPropagation()}>
              <button className="p-modal__close" type="button" onClick={closeQuickView} aria-label="Close">
                ✕
              </button>

              <div className="p-modal__grid">
                {/* LEFT */}
                <div className="p-modal__left">
                  {discountPct > 0 && (
                    <div className="p-modal__badge">
                      <div className="p-modal__badgeTop">-{discountPct}%</div>
                      <div className="p-modal__badgeBot">OFF</div>
                    </div>
                  )}

                  <div className="p-modal__stage">
                    <div
                      className="p-modal__track"
                      style={{ transform: `translateX(-${safeIndex * 100}%)` }}
                    >
                      {imgs.map((src, i) => (
                        <div className="p-modal__slide" key={`${src}-${i}`}>
                          <img
                            src={src || FALLBACK_IMG}
                            alt={`${selected.name} ${i + 1}`}
                            draggable={false}
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.onerror = null;
                              img.src = FALLBACK_IMG;
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {imgs.length > 1 && canPrev && (
                      <button className="p-modal__nav p-modal__nav--prev" type="button" onClick={goPrevImg} aria-label="Prev">
                        ‹
                      </button>
                    )}
                    {imgs.length > 1 && canNext && (
                      <button className="p-modal__nav p-modal__nav--next" type="button" onClick={goNextImg} aria-label="Next">
                        ›
                      </button>
                    )}
                  </div>

                  <div className="p-modal__thumbs">
                    {imgs.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`p-thumb ${i === safeIndex ? "is-active" : ""}`}
                        onClick={() => goToImg(i)}
                        aria-label={`Ảnh ${i + 1}`}
                      >
                        <img
                          src={src || FALLBACK_IMG}
                          alt={`${selected.name} thumb ${i + 1}`}
                          draggable={false}
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.onerror = null;
                            img.src = FALLBACK_IMG;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="p-modal__right">
                  <div className="p-modal__title">{selected.name}</div>

                  <div className="p-modal__meta">
                    <span>Mã sản phẩm:</span>
                    <b className="p-modal__code">DJI-{String(selected.id).padStart(5, "0")}</b>
                    <span className="p-modal__sep">|</span>
                    <span>Tình trạng:</span>
                    <b className={`p-modal__status ${selected.isOutOfStock ? "is-out" : "is-in"}`}>
                      {selected.isOutOfStock ? "Hết hàng" : "Còn hàng"}
                    </b>
                  </div>

                  <div className="p-modal__priceRow">
                    <div className="p-modal__priceLabel">Giá:</div>

                    <div className="p-modal__priceBlock">
                      <div className="p-modal__priceNow">{formatVND(selected.price)}</div>
                      {hasSale && <div className="p-modal__priceOld">{formatVND(selected.oldPrice!)}</div>}
                    </div>

                    {discountPct > 0 && <div className="p-modal__pct">-{discountPct}%</div>}
                  </div>

                  {/* ✅ QTY */}
                  <div className="p-modal__qtyRow">
                    <div className="p-modal__qtyLabel">Số lượng:</div>

                    <div className="p-qty">
                      <button
                        className="p-qty__btn"
                        type="button"
                        aria-label="minus"
                        onClick={decQty}
                        disabled={disableDec}
                      >
                        −
                      </button>

                      {/* bạn thích span thì giữ span; input cho nhập số tiện hơn */}
                      <input
                        className="p-qty__num"
                        value={qty}
                        onChange={(e) => onQtyInput(e.target.value)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        aria-label="quantity"
                      />

                      <button
                        className="p-qty__btn"
                        type="button"
                        aria-label="plus"
                        onClick={incQty}
                        disabled={disableInc}
                      >
                        +
                      </button>
                    </div>
                  </div>

                    <button
                      className="p-modal__add"
                      type="button"
                      disabled={!!selected.isOutOfStock}
                      onClick={() => {
                        if (!selected.isOutOfStock) {
                          onAddToCart(selected, qty);
                          setQty(1); // reset số lượng về 1
                        }
                      }}
                    >
                      THÊM VÀO GIỎ
                    </button>

                  <div className="p-modal__share">
                    <div className="p-modal__shareLabel">Chia sẻ:</div>
                    <div className="p-modal__icons">
                      <a className="sicon sicon--fb" href="#" aria-label="Facebook">f</a>
                      <a className="sicon sicon--ms" href="#" aria-label="Messenger">✉</a>
                      <a className="sicon sicon--tw" href="#" aria-label="Twitter">t</a>
                      <a className="sicon sicon--pt" href="#" aria-label="Pinterest">p</a>
                      <a className="sicon sicon--ln" href="#" aria-label="Link">🔗</a>
                    </div>
                  </div>

                  <a className="p-modal__detail" href={`/san-pham/${selected.id}`}>
                    Xem chi tiết sản phẩm »
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <Footer />
    </>
  );
}