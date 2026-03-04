import React, { useMemo, useState } from "react";
import "./cart.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

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

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1520975958225-2b4f1f8b4a36?auto=format&fit=crop&w=800&q=80";

// ✅ dd/MM/yyyy
const formatDateVN = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// ✅ cộng ngày an toàn
const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

// ✅ key yyyy-mm-dd
const dateKey = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Phantom 4 Multispectral",
      variant: "(Chính hãng)",
      image:
        "https://images.unsplash.com/photo-1524143986875-3b6f7f9c7b5e?auto=format&fit=crop&w=900&q=80",
      price: 34000000,
      oldPrice: 35000000,
      qty: 2,
    },
  ]);

  const [note, setNote] = useState("");
  const [needInvoice, setNeedInvoice] = useState(false);

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("store");

  // ✅ 3 ngày liên tiếp, option hiển thị trực tiếp dd/MM/yyyy
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

  // ✅ mặc định chọn hôm nay (theo key)
  const [deliveryDayKey, setDeliveryDayKey] = useState<string>(() => {
    const now = new Date();
    return dateKey(addDays(now, 0));
  });

  const [deliverySlot, setDeliverySlot] = useState("08:00-09:00");

  const [confirmed, setConfirmed] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const promotions = useMemo(
    () => [
      {
        id: "FREESHIP300",
        title: "Miễn phí vận chuyển",
        desc: "Đơn hàng từ 300k",
        code: "A87TYRT55",
        exp: "10/04/2022",
        icon: "🚚",
      },
      {
        id: "SALE20",
        title: "Giảm 20%",
        desc: "Đơn hàng từ 200k",
        code: "QH5G8J0Y",
        exp: "05/05/2022",
        icon: "🎟️",
      },
    ],
    []
  );

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const cartCount = useMemo(
    () => items.reduce((s, it) => s + it.qty, 0),
    [items]
  );

  const updateQty = (id: number, nextQty: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, nextQty) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
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
      `Đã xác nhận: ${picked?.label ?? ""} - ${deliverySlot.replace("-", " - ")}`
    );
  };

  const onCheckout = () => {
    if (!acceptedTerms) return;

    if (deliveryMode === "time" && !confirmed) {
      alert("Bạn vui lòng XÁC NHẬN THỜI GIAN trước khi thanh toán!");
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
            {/* LEFT */}
            <div className="cartLeft">
              <div className="cartCard">
                <div className="cartBreadcrumb">
                  <span>Trang chủ</span>
                  <span className="cartBreadcrumb__sep">/</span>
                  <span>Giỏ hàng ({items.length})</span>
                </div>

                <h2 className="cartTitle">Giỏ hàng của bạn</h2>
                <p className="cartSub">
                  Bạn đang có <b>{items.length}</b> sản phẩm trong giỏ hàng
                </p>

                <div className="cartList">
                  {items.length === 0 ? (
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
                        >
                          Xoá
                        </button>

                        <div className="cartItem__thumb">
                          <img
                            src={it.image}
                            alt={it.name}
                            loading="lazy"
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.onerror = null;
                              img.src = FALLBACK_IMG;
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
                              className="qty__btn"
                              type="button"
                              onClick={() => updateQty(it.id, it.qty - 1)}
                              aria-label="Giảm"
                            >
                              –
                            </button>
                            <div className="qty__val">{it.qty}</div>
                            <button
                              className="qty__btn"
                              type="button"
                              onClick={() => updateQty(it.id, it.qty + 1)}
                              aria-label="Tăng"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* NOTE */}
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

            {/* RIGHT */}
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

                          {/* ✅ OPTION HIỂN THỊ NGÀY/THÁNG/NĂM */}
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
                          ✅ Đã xác nhận <b>{deliveryDays.find((d) => d.key === deliveryDayKey)?.label}</b>{" "}
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
                  disabled={!acceptedTerms || items.length === 0}
                  onClick={onCheckout}
                >
                  THANH TOÁN
                </button>
              </div>

              {/* POLICY */}
              <div className="policyBox">
                <div className="policyTitle">Chính sách mua hàng:</div>
                <div className="policyText">
                  Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị
                  tối thiểu <b>400.000₫</b> trở lên.
                </div>
              </div>

              {/* PROMOTIONS */}
              <div className="promoBox">
                <div className="promoHead">
                  <div className="promoHead__title">Khuyến mãi dành cho bạn</div>
                  <div className="promoNav">
                    <button type="button" className="promoNav__btn" aria-label="Prev">
                      ‹
                    </button>
                    <button type="button" className="promoNav__btn" aria-label="Next">
                      ›
                    </button>
                  </div>
                </div>

                <div className="promoList">
                  {promotions.map((p) => (
                    <div key={p.id} className="promoItem">
                      <div className="promoIcon">{p.icon}</div>
                      <div className="promoInfo">
                        <div className="promoTitle">{p.title}</div>
                        <div className="promoDesc">{p.desc}</div>
                        <div className="promoMeta">
                          <div>
                            Mã: <b>{p.code}</b>
                          </div>
                          <div>HSD: {p.exp}</div>
                        </div>
                      </div>
                      <button
                        className="promoCopy"
                        type="button"
                        onClick={() => copyCode(p.code)}
                      >
                        SAO CHÉP MÃ
                      </button>
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