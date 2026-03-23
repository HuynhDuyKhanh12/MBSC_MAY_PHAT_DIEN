import { useEffect, useMemo, useState } from "react";

type CartProduct = {
  id: number;
  productId: string;
  productName: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
};

type Cart = {
  id: number;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: "active" | "abandoned" | "converted";
  updatedAt: string;
  shippingFee: number;
  taxPercent: number;
  couponCode: string;
  items: CartProduct[];
};

const STORAGE_KEY = "admin_cart_full_data_v3";

const defaultCoupons: Coupon[] = [
  { code: "GIAM10", type: "percent", value: 10 },
  { code: "SALE50K", type: "fixed", value: 50000 },
  { code: "FREESHIP", type: "fixed", value: 30000 },
];

const defaultCarts: Cart[] = [
  {
    id: 1,
    userId: "U001",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@gmail.com",
    status: "active",
    updatedAt: "2026-03-23 10:20",
    shippingFee: 30000,
    taxPercent: 8,
    couponCode: "GIAM10",
    items: [
      {
        id: 1,
        productId: "P001",
        productName: "Máy phát điện Honda Mini",
        image:
          "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=400&auto=format&fit=crop",
        color: "Đỏ",
        size: "M",
        quantity: 2,
        price: 4500000,
      },
      {
        id: 2,
        productId: "P002",
        productName: "Máy phát điện Elemax Pro",
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&auto=format&fit=crop",
        color: "Đen",
        size: "L",
        quantity: 1,
        price: 6200000,
      },
    ],
  },
  {
    id: 2,
    userId: "U002",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@gmail.com",
    status: "abandoned",
    updatedAt: "2026-03-21 14:30",
    shippingFee: 25000,
    taxPercent: 8,
    couponCode: "",
    items: [
      {
        id: 1,
        productId: "P003",
        productName: "Máy phát điện gia đình Yamaha",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=400&auto=format&fit=crop",
        color: "Xanh",
        size: "XL",
        quantity: 1,
        price: 8300000,
      },
    ],
  },
];

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN") + " ₫";

export default function CartPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Cart["status"]>("all");
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<CartProduct, "id">>({
    productId: "",
    productName: "",
    image: "",
    color: "",
    size: "",
    quantity: 1,
    price: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCarts(JSON.parse(saved));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCarts));
      setCarts(defaultCarts);
    }
  }, []);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    if (selectedCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = oldOverflow || "";
    }

    return () => {
      document.body.style.overflow = oldOverflow || "";
    };
  }, [selectedCart]);

  const saveCarts = (data: Cart[]) => {
    setCarts(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const filteredCarts = useMemo(() => {
    return carts.filter((cart) => {
      const keyword = search.toLowerCase().trim();

      const matchSearch =
        cart.customerName.toLowerCase().includes(keyword) ||
        cart.customerEmail.toLowerCase().includes(keyword) ||
        cart.userId.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "all" ? true : cart.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [carts, search, statusFilter]);

  const getCouponInfo = (code: string) => {
    return defaultCoupons.find((coupon) => coupon.code === code);
  };

  const calcSubtotal = (cart: Cart) => {
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calcDiscount = (cart: Cart) => {
    const subtotal = calcSubtotal(cart);
    const coupon = getCouponInfo(cart.couponCode);

    if (!coupon) return 0;

    if (coupon.type === "percent") {
      return (subtotal * coupon.value) / 100;
    }

    return coupon.value;
  };

  const calcTax = (cart: Cart) => {
    const subtotal = calcSubtotal(cart);
    return (subtotal * cart.taxPercent) / 100;
  };

  const calcTotal = (cart: Cart) => {
    const subtotal = calcSubtotal(cart);
    const discount = calcDiscount(cart);
    const tax = calcTax(cart);

    return subtotal + cart.shippingFee + tax - discount;
  };

  const getStatusText = (status: Cart["status"]) => {
    if (status === "active") return "Đang hoạt động";
    if (status === "abandoned") return "Giỏ hàng bỏ quên";
    return "Đã chuyển đơn";
  };

  const getStatusColor = (status: Cart["status"]) => {
    if (status === "active") return "#2563eb";
    if (status === "abandoned") return "#f59e0b";
    return "#16a34a";
  };

  const openCartDetail = (cart: Cart) => {
    setSelectedCart({ ...cart });
    setShowAddItemForm(false);
  };

  const handleUpdateSelectedCart = (updatedCart: Cart) => {
    setSelectedCart(updatedCart);

    const newData = carts.map((cart) =>
      cart.id === updatedCart.id ? updatedCart : cart
    );

    saveCarts(newData);
  };

  const handleChangeQuantity = (
    itemId: number,
    type: "increase" | "decrease"
  ) => {
    if (!selectedCart) return;

    const updatedItems = selectedCart.items.map((item) => {
      if (item.id !== itemId) return item;

      const newQty =
        type === "increase"
          ? item.quantity + 1
          : item.quantity > 1
          ? item.quantity - 1
          : 1;

      return { ...item, quantity: newQty };
    });

    handleUpdateSelectedCart({
      ...selectedCart,
      items: updatedItems,
      updatedAt: new Date().toLocaleString("vi-VN"),
    });
  };

  const handleRemoveItem = (itemId: number) => {
    if (!selectedCart) return;

    const ok = window.confirm("Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?");
    if (!ok) return;

    const updatedItems = selectedCart.items.filter((item) => item.id !== itemId);

    handleUpdateSelectedCart({
      ...selectedCart,
      items: updatedItems,
      updatedAt: new Date().toLocaleString("vi-VN"),
    });
  };

  const handleAddItemToCart = () => {
    if (!selectedCart) return;

    if (
      !newItem.productId.trim() ||
      !newItem.productName.trim() ||
      !newItem.image.trim() ||
      !newItem.color.trim() ||
      !newItem.size.trim() ||
      newItem.quantity < 1 ||
      newItem.price <= 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm");
      return;
    }

    const itemToAdd: CartProduct = {
      id:
        selectedCart.items.length > 0
          ? Math.max(...selectedCart.items.map((item) => item.id)) + 1
          : 1,
      ...newItem,
    };

    const updatedCart: Cart = {
      ...selectedCart,
      items: [...selectedCart.items, itemToAdd],
      updatedAt: new Date().toLocaleString("vi-VN"),
    };

    handleUpdateSelectedCart(updatedCart);

    setNewItem({
      productId: "",
      productName: "",
      image: "",
      color: "",
      size: "",
      quantity: 1,
      price: 0,
    });

    setShowAddItemForm(false);
  };

  const handleApplyCoupon = (code: string) => {
    if (!selectedCart) return;

    const normalizedCode = code.trim().toUpperCase();
    const found = defaultCoupons.find((coupon) => coupon.code === normalizedCode);

    if (!found && normalizedCode !== "") {
      alert("Mã giảm giá không tồn tại");
      return;
    }

    handleUpdateSelectedCart({
      ...selectedCart,
      couponCode: normalizedCode,
      updatedAt: new Date().toLocaleString("vi-VN"),
    });
  };

  const handleConvertToOrder = () => {
    if (!selectedCart) return;

    if (selectedCart.items.length === 0) {
      alert("Giỏ hàng trống, không thể chuyển thành đơn hàng");
      return;
    }

    const updatedCart: Cart = {
      ...selectedCart,
      status: "converted",
      updatedAt: new Date().toLocaleString("vi-VN"),
    };

    handleUpdateSelectedCart(updatedCart);
    alert("Đã chuyển giỏ hàng thành đơn hàng");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý giỏ hàng</h2>
          <p style={styles.subTitle}>
            Xem, chỉnh sửa, áp dụng khuyến mãi và chuyển đổi giỏ hàng thành đơn hàng
          </p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Tìm theo tên khách, email, user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | Cart["status"])}
          style={styles.select}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="abandoned">Giỏ hàng bỏ quên</option>
          <option value="converted">Đã chuyển đơn</option>
        </select>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Khách hàng</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Số sản phẩm</th>
              <th style={styles.th}>Tạm tính</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Cập nhật</th>
              <th style={styles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCarts.length > 0 ? (
              filteredCarts.map((cart, index) => (
                <tr key={cart.id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>
                    <div style={styles.customerName}>{cart.customerName}</div>
                    <div style={styles.customerCode}>{cart.userId}</div>
                  </td>
                  <td style={styles.td}>{cart.customerEmail}</td>
                  <td style={styles.td}>{cart.items.length}</td>
                  <td style={styles.td}>{formatVND(calcSubtotal(cart))}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(cart.status),
                      }}
                    >
                      {getStatusText(cart.status)}
                    </span>
                  </td>
                  <td style={styles.td}>{cart.updatedAt}</td>
                  <td style={styles.td}>
                    <button
                      type="button"
                      style={styles.primaryBtn}
                      onClick={() => openCartDetail(cart)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={styles.emptyCell}>
                  Không có giỏ hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCart && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedCart(null)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalChip}>Chi tiết giỏ hàng</div>
                <h3 style={styles.modalTitle}>{selectedCart.customerName}</h3>
                <p style={styles.modalSubtitle}>{selectedCart.customerEmail}</p>
              </div>

              <button
                type="button"
                style={styles.closeBtn}
                onClick={() => setSelectedCart(null)}
              >
                Đóng
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailGrid}>
                <div style={styles.leftSide}>
                  <div style={styles.infoCards}>
                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Mã khách hàng</div>
                      <div style={styles.infoValue}>{selectedCart.userId}</div>
                    </div>

                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Trạng thái</div>
                      <div
                        style={{
                          ...styles.infoValue,
                          color: getStatusColor(selectedCart.status),
                        }}
                      >
                        {getStatusText(selectedCart.status)}
                      </div>
                    </div>

                    <div style={styles.infoCard}>
                      <div style={styles.infoLabel}>Cập nhật gần nhất</div>
                      <div style={styles.infoValue}>{selectedCart.updatedAt}</div>
                    </div>
                  </div>

                  <div style={styles.blockCard}>
                    <div style={styles.blockHeader}>
                      <h4 style={styles.blockTitle}>Sản phẩm trong giỏ</h4>

                      <button
                        type="button"
                        style={styles.addBtn}
                        onClick={() => setShowAddItemForm(!showAddItemForm)}
                      >
                        + Thêm sản phẩm
                      </button>
                    </div>

                    {showAddItemForm && (
                      <div style={styles.formBox}>
                        <div style={styles.formGrid}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Product ID</label>
                            <input
                              style={styles.input}
                              placeholder="Nhập product ID"
                              value={newItem.productId}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  productId: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Tên sản phẩm</label>
                            <input
                              style={styles.input}
                              placeholder="Nhập tên sản phẩm"
                              value={newItem.productName}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  productName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Link hình ảnh</label>
                            <input
                              style={styles.input}
                              placeholder="Dán URL hình ảnh"
                              value={newItem.image}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  image: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Màu sắc</label>
                            <input
                              style={styles.input}
                              placeholder="Ví dụ: Đỏ"
                              value={newItem.color}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  color: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Kích thước</label>
                            <input
                              style={styles.input}
                              placeholder="Ví dụ: L"
                              value={newItem.size}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  size: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Số lượng</label>
                            <input
                              style={styles.input}
                              type="number"
                              min={1}
                              value={newItem.quantity}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  quantity: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          <div style={styles.formGroup}>
                            <label style={styles.label}>Đơn giá</label>
                            <input
                              style={styles.input}
                              type="number"
                              min={0}
                              value={newItem.price}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  price: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>

                        <div style={styles.formActions}>
                          <button
                            type="button"
                            style={styles.primaryBtn}
                            onClick={handleAddItemToCart}
                          >
                            Lưu sản phẩm
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={styles.itemsWrap}>
                      {selectedCart.items.length > 0 ? (
                        selectedCart.items.map((item) => (
                          <div key={item.id} style={styles.itemCard}>
                            <img
                              src={item.image}
                              alt={item.productName}
                              style={styles.itemImage}
                            />

                            <div style={styles.itemContent}>
                              <div style={styles.itemTop}>
                                <div>
                                  <h5 style={styles.itemName}>{item.productName}</h5>

                                  <div style={styles.metaRow}>
                                    <span style={styles.metaBadge}>
                                      ID: {item.productId}
                                    </span>
                                    <span style={styles.metaBadge}>
                                      Màu: {item.color}
                                    </span>
                                    <span style={styles.metaBadge}>
                                      Size: {item.size}
                                    </span>
                                  </div>
                                </div>

                                <div style={styles.itemPrice}>
                                  {formatVND(item.price)}
                                </div>
                              </div>

                              <div style={styles.itemBottom}>
                                <div style={styles.quantityWrap}>
                                  <button
                                    type="button"
                                    style={styles.qtyBtn}
                                    onClick={() =>
                                      handleChangeQuantity(item.id, "decrease")
                                    }
                                  >
                                    -
                                  </button>

                                  <span style={styles.qtyValue}>
                                    {item.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    style={styles.qtyBtn}
                                    onClick={() =>
                                      handleChangeQuantity(item.id, "increase")
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <div style={styles.itemActionArea}>
                                  <div style={styles.lineTotal}>
                                    Thành tiền:{" "}
                                    <strong>
                                      {formatVND(item.price * item.quantity)}
                                    </strong>
                                  </div>

                                  <button
                                    type="button"
                                    style={styles.deleteBtn}
                                    onClick={() => handleRemoveItem(item.id)}
                                  >
                                    Xóa sản phẩm
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={styles.emptyItems}>
                          Giỏ hàng chưa có sản phẩm
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={styles.rightSide}>
                  <div style={styles.sideCard}>
                    <h4 style={styles.sideTitle}>Khuyến mãi</h4>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Mã giảm giá</label>
                      <input
                        style={styles.input}
                        placeholder="Nhập mã giảm giá"
                        value={selectedCart.couponCode}
                        onChange={(e) =>
                          setSelectedCart({
                            ...selectedCart,
                            couponCode: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </div>

                    <button
                      type="button"
                      style={{ ...styles.primaryBtn, width: "100%", marginTop: 10 }}
                      onClick={() => handleApplyCoupon(selectedCart.couponCode)}
                    >
                      Áp dụng mã
                    </button>

                    <div style={styles.couponText}>
                      Mã có sẵn: {defaultCoupons.map((coupon) => coupon.code).join(", ")}
                    </div>
                  </div>

                  <div style={styles.sideCard}>
                    <h4 style={styles.sideTitle}>Tổng tiền</h4>

                    <div style={styles.totalRow}>
                      <span>Tạm tính</span>
                      <strong>{formatVND(calcSubtotal(selectedCart))}</strong>
                    </div>

                    <div style={styles.totalRow}>
                      <span>Phí vận chuyển</span>
                      <strong>{formatVND(selectedCart.shippingFee)}</strong>
                    </div>

                    <div style={styles.totalRow}>
                      <span>Thuế ({selectedCart.taxPercent}%)</span>
                      <strong>{formatVND(calcTax(selectedCart))}</strong>
                    </div>

                    <div style={styles.totalRow}>
                      <span>Giảm giá</span>
                      <strong style={{ color: "#dc2626" }}>
                        - {formatVND(calcDiscount(selectedCart))}
                      </strong>
                    </div>

                    <div style={styles.totalDivider} />

                    <div style={styles.grandTotalRow}>
                      <span>Tổng cộng</span>
                      <strong>{formatVND(calcTotal(selectedCart))}</strong>
                    </div>
                  </div>

                  <div style={styles.sideCard}>
                    <h4 style={styles.sideTitle}>Checkout</h4>

                    <button
                      type="button"
                      style={{ ...styles.successBtn, width: "100%" }}
                      onClick={handleConvertToOrder}
                    >
                      Chuyển thành đơn hàng
                    </button>

                    {selectedCart.status === "abandoned" && (
                      <button
                        type="button"
                        style={{ ...styles.warningBtn, width: "100%", marginTop: 10 }}
                        onClick={() =>
                          alert(
                            `Gợi ý tiếp cận lại khách hàng qua Email Marketing: ${selectedCart.customerEmail}`
                          )
                        }
                      >
                        Gửi nhắc qua Email
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 24,
    background: "#f6f8fb",
    minHeight: "100vh",
  },

  header: {
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
    color: "#111827",
  },

  subTitle: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
  },

  toolbar: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    minWidth: 280,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  },

  select: {
    minWidth: 220,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 14,
    background: "#fff",
    outline: "none",
  },

  tableCard: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e5e7eb",
    overflowX: "auto",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 1000,
  },

  th: {
    textAlign: "left",
    padding: 16,
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#374151",
    whiteSpace: "nowrap",
  },

  td: {
    padding: 16,
    borderBottom: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#111827",
    verticalAlign: "middle",
  },

  customerName: {
    fontWeight: 700,
    color: "#111827",
  },

  customerCode: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 4,
  },

  statusBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: 999,
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    whiteSpace: "nowrap",
  },

  primaryBtn: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  addBtn: {
    border: "none",
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  deleteBtn: {
    border: "none",
    background: "#ef4444",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  successBtn: {
    border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  warningBtn: {
    border: "none",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  closeBtn: {
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },

  emptyCell: {
    padding: 28,
    textAlign: "center",
    color: "#6b7280",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(15, 23, 42, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: 20,
  },

  modal: {
    width: "100%",
    maxWidth: 1220,
    height: "90vh",
    background: "#f8fafc",
    borderRadius: 22,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.22)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    padding: "22px 24px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
    flexShrink: 0,
  },

  modalChip: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },

  modalTitle: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.2,
  },

  modalSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: 15,
  },

  modalBody: {
    flex: 1,
    overflowY: "auto",
    padding: 24,
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
    alignItems: "start",
  },

  leftSide: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    minWidth: 0,
  },

  rightSide: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    position: "sticky",
    top: 0,
    height: "fit-content",
  },

  infoCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },

  infoCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },

  infoLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 10,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: 800,
    color: "#111827",
    wordBreak: "break-word",
  },

  blockCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },

  blockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  blockTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
  },

  formBox: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#475569",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },

  formActions: {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
  },

  itemsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  itemCard: {
    display: "flex",
    gap: 16,
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    border: "1px solid #e5e7eb",
    alignItems: "center",
  },

  itemImage: {
    width: 118,
    height: 118,
    objectFit: "cover",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    flexShrink: 0,
  },

  itemContent: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },

  itemName: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.35,
  },

  itemPrice: {
    fontSize: 18,
    fontWeight: 800,
    color: "#2563eb",
    whiteSpace: "nowrap",
  },

  metaRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10,
  },

  metaBadge: {
    padding: "7px 12px",
    borderRadius: 999,
    background: "#f1f5f9",
    color: "#334155",
    fontSize: 13,
    fontWeight: 700,
  },

  itemBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },

  quantityWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    background: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },

  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "none",
    background: "#e2e8f0",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
  },

  qtyValue: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: 800,
    fontSize: 16,
    color: "#111827",
  },

  itemActionArea: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  lineTotal: {
    fontSize: 14,
    color: "#475569",
  },

  emptyItems: {
    textAlign: "center",
    padding: 24,
    color: "#64748b",
    border: "1px dashed #cbd5e1",
    borderRadius: 16,
    background: "#f8fafc",
  },

  sideCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },

  sideTitle: {
    margin: "0 0 14px",
    fontSize: 22,
    fontWeight: 800,
    color: "#0f172a",
  },

  couponText: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.6,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    fontSize: 15,
    color: "#111827",
    gap: 12,
  },

  totalDivider: {
    height: 1,
    background: "#e5e7eb",
    margin: "6px 0 10px",
  },

  grandTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 19,
    fontWeight: 800,
    color: "#dc2626",
    gap: 12,
  },
};