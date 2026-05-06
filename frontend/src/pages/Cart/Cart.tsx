import React, { useEffect, useMemo, useRef, useState } from "react";

import "./cart.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  getCartApi,
  updateCartItemApi,
  deleteCartItemApi,
} from "../../api/modules/cartApi";

type CartItem = {
  id: number;
  name: string;
  variant?: string;
  image: string;
  price: number;
  oldPrice?: number;
  qty: number;
};

type DeliveryMode = "store" | "time";

type Promo = {
  id: string;
  title: string;
  desc: string;
  code: string;
  exp: string;
  icon: string;
};

const API_URL = "http://localhost:5000";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1520975958225-2b4f1f8b4a36?auto=format&fit=crop&w=800&q=80";

const formatVND = (n: number) =>
  Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

const formatDateVN = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

const dateKey = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const chunk = <T,>(arr: T[], size: number) => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

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

function normalizeCartResponse(res: any) {
  return res?.data?.data || res?.data || res || {};
}

function mapCartItem(item: any): CartItem {
  const product = item.product || {};
  const variant = item.variant || {};

  const price =
    Number(item.unitPrice) ||
    Number(item.price) ||
    Number(variant.price) ||
    Number(product.salePrice) ||
    Number(product.basePrice) ||
    0;

  const oldPrice =
    product.salePrice && product.basePrice && Number(product.basePrice) > price
      ? Number(product.basePrice)
      : undefined;

  return {
    id: Number(item.id),
    name: product.name || item.productName || item.name || "Sản phẩm",
    variant: variant.name || variant.sku || item.variantName || "",
    image: getImageSrc(
      product.thumbnail ||
        product.image ||
        product.images?.[0]?.url ||
        product.images?.[0]?.imageUrl ||
        item.image
    ),
    price,
    oldPrice,
    qty: Number(item.quantity || item.qty || 1),
  };
}

const Cart: React.FC = () => {
  const promoRef = useRef<HTMLDivElement | null>(null);

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [note, setNote] = useState("");
  const [needInvoice, setNeedInvoice] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("store");

  const deliveryDays = useMemo(() => {
    const now = new Date();
    const d0 = addDays(now, 0);
    const d1 = addDays(now, 1);
    const d2 = addDays(now, 2);

    return [
      { key: dateKey(d0), label: formatDateVN(d0) },
      { key: dateKey(d1), label: formatDateVN(d1) },
      { key: dateKey(d2), label: formatDateVN(d2) },
    ];
  }, []);

  const [deliveryDayKey, setDeliveryDayKey] = useState<string>(() =>
    dateKey(addDays(new Date(), 0))
  );

  const [deliverySlot, setDeliverySlot] = useState("08:00-09:00");
  const [confirmed, setConfirmed] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const promotions = useMemo<Promo[]>(
    () => [
      {
        id: "FREESHIP300",
        title: "Miễn phí vận chuyển",
        desc: "Đơn hàng từ 300k",
        code: "A87TYRT55",
        exp: "10/04/2026",
        icon: "🚚",
      },
      {
        id: "SALE20",
        title: "Giảm 20%",
        desc: "Đơn hàng từ 200k",
        code: "QH5G8J0Y",
        exp: "05/05/2026",
        icon: "🎟️",
      },
      {
        id: "SALE50K",
        title: "Giảm 50k",
        desc: "Đơn hàng từ 500k",
        code: "FT45YU08H",
        exp: "10/05/2026",
        icon: "💸",
      },
      {
        id: "SALE10",
        title: "Giảm 10%",
        desc: "Đơn hàng từ 100k",
        code: "A789UYT",
        exp: "20/05/2026",
        icon: "🔥",
      },
      {
        id: "FREESHIP1M",
        title: "Freeship nhanh",
        desc: "Đơn hàng từ 1.000.000₫",
        code: "SHIPFAST1M",
        exp: "15/05/2026",
        icon: "⚡",
      },
      {
        id: "GIFT",
        title: "Tặng quà phụ kiện",
        desc: "Đơn hàng từ 700k",
        code: "GIFT700",
        exp: "12/05/2026",
        icon: "🎁",
      },
    ],
    []
  );

  const promoPages = useMemo(() => chunk(promotions, 2), [promotions]);

  const loadCart = async () => {
    try {
      setLoading(true);

      const res = await getCartApi();
      const data = normalizeCartResponse(res);

      const cartItems = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.cartItems)
        ? data.cartItems
        : Array.isArray(data)
        ? data
        : [];

      setItems(cartItems.map(mapCartItem));
    } catch (error: any) {
      console.log("Lỗi load cart:", error?.response?.data || error);

      if (error?.response?.status === 401) {
        alert("Bạn cần đăng nhập để xem giỏ hàng");
      }

      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const cartCount = useMemo(
    () => items.reduce((s, it) => s + it.qty, 0),
    [items]
  );

  const scrollPromo = (dir: "left" | "right") => {
    if (!promoRef.current) return;

    const w = promoRef.current.clientWidth;
    promoRef.current.scrollBy({
      left: dir === "left" ? -w : w,
      behavior: "smooth",
    });
  };

  const updateQty = async (id: number, nextQty: number) => {
    if (nextQty < 1) return;

    try {
      setUpdatingId(id);

      await updateCartItemApi(id, nextQty);

      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, qty: nextQty } : it))
      );
    } catch (error: any) {
      console.log("Lỗi cập nhật số lượng:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Cập nhật số lượng thất bại"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xoá sản phẩm này khỏi giỏ?");
    if (!ok) return;

    try {
      setUpdatingId(id);

      await deleteCartItemApi(id);

      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (error: any) {
      console.log("Lỗi xoá cart:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Xoá sản phẩm thất bại"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Đã sao chép mã: ${code}`);
    } catch {
      alert("Không thể sao chép. Bạn hãy copy thủ công nhé.");
    }
  };

  const onConfirmTime = () => {
    setConfirmed(true);

    const picked = deliveryDays.find((d) => d.key === deliveryDayKey);

    alert(
      `Đã xác nhận: ${picked?.label ?? ""} - ${deliverySlot.replace(
        "-",
        " - "
      )}`
    );
  };

  const onCheckout = () => {
    if (!acceptedTerms) return;

    if (deliveryMode === "time" && !confirmed) {
      alert("Bạn vui lòng xác nhận thời gian trước khi thanh toán!");
      return;
    }

    alert("Đi tới thanh toán!");
  };

  return (
    <>
      <Header />

      <div className="cartPage">
        <div className="cartContainer">
          <div className="cartGrid">
            <div className="cartLeft">
              <div className="cartCard">
                <h2 className="cartTitle">Giỏ hàng của bạn</h2>

                <p className="cartSub">
                  Bạn đang có <b>{items.length}</b> sản phẩm trong giỏ hàng
                </p>

                <div className="cartList">
                  {loading ? (
                    <div style={{ padding: 20, fontWeight: 700 }}>
                      Đang tải giỏ hàng...
                    </div>
                  ) : items.length === 0 ? (
                    <div className="cartEmpty">
                      <div className="cartEmpty__icon">🛒</div>
                      <div className="cartEmpty__title">Giỏ hàng đang trống</div>
                      <div className="cartEmpty__desc">
                        Hãy thêm sản phẩm để tiếp tục mua sắm.
                      </div>
                    </div>
                  ) : (
                    items.map((it) => (
                      <div key={it.id} className="cartItem">
                        <button
                          className="cartItem__remove"
                          type="button"
                          onClick={() => removeItem(it.id)}
                          title="Xoá"
                          disabled={updatingId === it.id}
                        >
                          Xoá
                        </button>

                        <div className="cartItem__thumb">
                          <img
                            src={it.image}
                            alt={it.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = FALLBACK_IMG;
                            }}
                          />
                        </div>

                        <div className="cartItem__info">
                          <div className="cartItem__name">
                            {it.name}{" "}
                            {it.variant ? (
                              <span className="cartItem__variant">
                                {it.variant}
                              </span>
                            ) : null}
                          </div>

                          <div className="cartItem__prices">
                            <span className="cartItem__price">
                              {formatVND(it.price)}
                            </span>

                            {it.oldPrice ? (
                              <span className="cartItem__old">
                                {formatVND(it.oldPrice)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="cartItem__right">
                          <div className="cartItem__lineTotal">
                            {formatVND(it.price * it.qty)}
                          </div>

                          <div className="qty">
                            <button
                              type="button"
                              onClick={() => updateQty(it.id, it.qty - 1)}
                              aria-label="Giảm"
                              disabled={updatingId === it.id || it.qty <= 1}
                            >
                              –
                            </button>

                            <div className="qty__val">
                              {updatingId === it.id ? "..." : it.qty}
                            </div>

                            <button
                              type="button"
                              onClick={() => updateQty(it.id, it.qty + 1)}
                              aria-label="Tăng"
                              disabled={updatingId === it.id}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="cartBlock">
                  <div className="cartBlock__title">Ghi chú đơn hàng</div>

                  <textarea
                    className="cartNote"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú cho đơn hàng (nếu có)..."
                  />
                </div>

                <label className="cartCheck">
                  <input
                    type="checkbox"
                    checked={needInvoice}
                    onChange={(e) => setNeedInvoice(e.target.checked)}
                  />
                  <span>Xuất hoá đơn cho đơn hàng</span>
                </label>
              </div>
            </div>

            <div className="cartRight">
              <div className="cartCard">
                <h3 className="rightTitle">Thông tin đơn hàng</h3>

                <div className="rightSection">
                  <div className="rightLabel">THỜI GIAN GIAO HÀNG</div>

                  <div className="shipMode">
                    <label className="shipRadio">
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={deliveryMode === "store"}
                        onChange={() => {
                          setDeliveryMode("store");
                          setConfirmed(false);
                        }}
                      />
                      <span>Giao khi có hàng</span>
                    </label>

                    <label className="shipRadio">
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={deliveryMode === "time"}
                        onChange={() => {
                          setDeliveryMode("time");
                          setConfirmed(false);
                        }}
                      />
                      <span>Chọn thời gian</span>
                    </label>
                  </div>

                  {deliveryMode === "time" && (
                    <>
                      <div className="shipForm">
                        <div className="shipField">
                          <div className="shipField__label">Ngày giao</div>

                          <select
                            className="shipSelect"
                            value={deliveryDayKey}
                            onChange={(e) => {
                              setDeliveryDayKey(e.target.value);
                              setConfirmed(false);
                            }}
                          >
                            {deliveryDays.map((d) => (
                              <option key={d.key} value={d.key}>
                                {d.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="shipField">
                          <div className="shipField__label">Thời gian giao</div>

                          <select
                            className="shipSelect"
                            value={deliverySlot}
                            onChange={(e) => {
                              setDeliverySlot(e.target.value);
                              setConfirmed(false);
                            }}
                          >
                            <option value="08:00-09:00">08:00 - 09:00</option>
                            <option value="09:00-10:00">09:00 - 10:00</option>
                            <option value="10:00-11:00">10:00 - 11:00</option>
                            <option value="13:00-14:00">13:00 - 14:00</option>
                            <option value="14:00-15:00">14:00 - 15:00</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="shipConfirmBtn"
                        onClick={onConfirmTime}
                      >
                        XÁC NHẬN THỜI GIAN
                      </button>

                      {confirmed && (
                        <div className="shipConfirmed">
                          ✅ Đã xác nhận{" "}
                          <b>
                            {
                              deliveryDays.find((d) => d.key === deliveryDayKey)
                                ?.label
                            }
                          </b>{" "}
                          - <b>{deliverySlot.replace("-", " - ")}</b>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="totalRow">
                  <div className="totalRow__label">Tổng tiền:</div>
                  <div className="totalRow__value">{formatVND(subtotal)}</div>
                </div>

                <ul className="rightHints">
                  <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                  <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
                </ul>

                <label className="terms">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>
                    Tôi đã đọc và đồng ý với{" "}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      điều khoản và điều kiện
                    </a>{" "}
                    của Website<span className="req">*</span>
                  </span>
                </label>

                <button
                  className="checkoutBtn"
                  type="button"
                  disabled={!acceptedTerms || items.length === 0 || loading}
                  onClick={onCheckout}
                >
                  THANH TOÁN
                </button>
              </div>

              <div className="policyBox">
                <div className="policyTitle">Chính sách mua hàng:</div>
                <div className="policyText">
                  Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị
                  tối thiểu <b>400.000₫</b> trở lên.
                </div>
              </div>

              <div className="promoBox">
                <div className="promoHead">
                  <div className="promoHead__title">Khuyến mãi dành cho bạn</div>

                  <div className="promoNav">
                    <button
                      type="button"
                      className="promoNav__btn"
                      aria-label="Prev"
                      onClick={() => scrollPromo("left")}
                    >
                      <div className="promoNav__icon">←</div>
                    </button>

                    <button
                      type="button"
                      className="promoNav__btn"
                      aria-label="Next"
                      onClick={() => scrollPromo("right")}
                    >
                      <div className="promoNav__icon">→</div>
                    </button>
                  </div>
                </div>

                <div className="promoList promoList--pages" ref={promoRef}>
                  {promoPages.map((page, idx) => (
                    <div className="promoPage" key={idx}>
                      {page.map((p) => (
                        <div key={p.id} className="promoItem promoItem--row">
                          <div className="promoArt" aria-hidden="true">
                            <span className="promoArt__icon">{p.icon}</span>
                          </div>

                          <div className="promoInfo">
                            <div className="promoTitle">{p.title}</div>
                            <div className="promoDesc">{p.desc}</div>

                            <div className="promoMeta promoMeta--2col">
                              <div>
                                Mã: <b>{p.code}</b>
                              </div>
                              <div>HSD: {p.exp}</div>
                            </div>
                          </div>

                          <div className="promoRight">
                            <button
                              className="promoInfoBtn"
                              type="button"
                              title="Thông tin"
                              onClick={() =>
                                alert(`${p.title}\n${p.desc}\nHSD: ${p.exp}`)
                              }
                            >
                              i
                            </button>

                            <button
                              className="promoCopy"
                              type="button"
                              onClick={() => copyCode(p.code)}
                            >
                              SAO CHÉP MÃ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="promoFooter">
                  <span className="promoFooter__hint">
                    (Mã sẽ dùng ở trang thanh toán)
                  </span>
                </div>
              </div>

              <div className="miniSummary">
                <div className="miniSummary__row">
                  <span>Số lượng</span>
                  <b>{cartCount}</b>
                </div>

                <div className="miniSummary__row">
                  <span>Tạm tính</span>
                  <b>{formatVND(subtotal)}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;