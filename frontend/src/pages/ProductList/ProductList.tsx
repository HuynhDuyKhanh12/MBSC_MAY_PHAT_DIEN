import React, { useMemo, useState } from "react";
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
    price: 5990000,
  },
  {
    id: 3,
    name: "Dịch vụ bảo dưỡng máy phát điện",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
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
    price: 350000,
    isHot: true,
  },
  {
    id: 5,
    name: "Ắc quy đề máy phát điện 12V",
    brand: "GS",
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1200&q=80",
    price: 990000,
  },
  {
    id: 6,
    name: "Tủ ATS tự động chuyển nguồn",
    brand: "ATS",
    image:
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1200&q=80",
    price: 3990000,
    oldPrice: 4590000,
    discountPercent: 13,
  },
  {
    id: 7,
    name: "Máy phát điện công nghiệp 50KVA",
    brand: "PERKINS",
    image:
      "https://images.unsplash.com/photo-1581091014534-898a88c8b2c2?auto=format&fit=crop&w=1200&q=80",
    price: 129900000,
  },
  {
    id: 8,
    name: "Combo thay nhớt + vệ sinh",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
    price: 1699000,
    oldPrice: 1899000,
    discountPercent: 11,
    isHot: true,
    isOutOfStock: true,
  },
];

export default function ProductList() {
  const [sort, setSort] = useState<SortValue>("featured");

  // ✅ FIX: visibleCount luôn <= tổng sp
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState<number>(Math.min(PAGE_SIZE, PRODUCTS.length));

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

  const visible = sorted.slice(0, visibleCount);
  const canLoadMore = visibleCount < sorted.length;

  const onAddToCart = (p: Product) => {
    alert(`Đã thêm vào giỏ: ${p.name}`);
  };

  return (
    <div className="p-page">
      <div className="p-container">
        <div className="p-breadcrumb">
          <a href="/">Trang chủ</a>
          <span>/</span>
          <a href="/danh-muc">Danh mục</a>
          <span>/</span>
          <span className="p-bc-current">Tất cả sản phẩm</span>
        </div>

        <div className="p-head">
          <div className="p-head-left">
            <h1 className="p-title">Tất cả sản phẩm</h1>
            <div className="p-count">{sorted.length} sản phẩm</div>
          </div>

          <div className="p-sort">
            <span className="p-sort-label">Sắp xếp</span>
            <select className="p-sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortValue)}>
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
                <div className={`p-media ${hasSale ? "has-sale" : ""}`}>
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
                    {p.isOutOfStock ? (
                      <>
                        <button className="p-add is-out" type="button" disabled>
                          HẾT HÀNG
                        </button>
                        <button className="p-cart-circle is-out" type="button" disabled>
                          🛒
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="p-add" type="button" onClick={() => onAddToCart(p)}>
                          THÊM VÀO GIỎ
                        </button>
                        <button className="p-cart-circle" type="button" onClick={() => onAddToCart(p)}>
                          🛒
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-more">
          <button
            className="p-more-btn"
            type="button"
            onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, sorted.length))}
            disabled={!canLoadMore}
          >
            Xem thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}