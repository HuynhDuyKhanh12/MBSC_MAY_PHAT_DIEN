import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOrdersApi, updateOrderStatusApi } from "../../../api/modules/orderApi";

type OrderItem = {
  id: number;
  code: string;
  fullName: string;
  phone: string;
  totalAmount: number | string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
};

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function formatMoney(value: number | string) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString("vi-VN");
}

function getStatusStyle(status: string): React.CSSProperties {
  const s = String(status || "").toUpperCase();

  if (s === "PENDING") return { background: "#fef3c7", color: "#92400e" };
  if (s === "CONFIRMED") return { background: "#dbeafe", color: "#1d4ed8" };
  if (s === "PROCESSING") return { background: "#e0e7ff", color: "#4338ca" };
  if (s === "SHIPPING") return { background: "#cffafe", color: "#0f766e" };
  if (s === "DELIVERED") return { background: "#dcfce7", color: "#166534" };
  if (s === "CANCELLED") return { background: "#fee2e2", color: "#991b1b" };

  return { background: "#e5e7eb", color: "#374151" };
}

export default function OrderListPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersApi();
      setOrders(normalizeArrayResponse(res));
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Lỗi tải đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const kw = keyword.trim().toLowerCase();
      const matchKeyword =
        !kw ||
        String(item.code).toLowerCase().includes(kw) ||
        String(item.fullName).toLowerCase().includes(kw) ||
        String(item.phone).toLowerCase().includes(kw);

      const matchStatus =
        statusFilter === "ALL" || String(item.status).toUpperCase() === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [orders, keyword, statusFilter]);

  const handleQuickStatus = async (id: number, status: string) => {
    try {
      await updateOrderStatusApi(id, status);
      await loadOrders();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Lỗi cập nhật trạng thái");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={headerStyle}>
        <div>
          <h2 style={{ margin: 0, fontSize: 28 }}>Quản lý đơn hàng</h2>
          <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
            Theo dõi và cập nhật trạng thái đơn hàng
          </p>
        </div>
      </div>

      <div style={filterCardStyle}>
        <div style={filterGridStyle}>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm mã đơn, tên khách, số điện thoại..."
            style={inputStyle}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPING">SHIPPING</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div style={cardStyle}>
        {loading ? (
          <p style={{ padding: 20 }}>Đang tải...</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={th}>Mã đơn</th>
                <th style={th}>Khách hàng</th>
                <th style={th}>Thanh toán</th>
                <th style={th}>Tổng tiền</th>
                <th style={th}>Trạng thái</th>
                <th style={th}>Ngày tạo</th>
                <th style={th}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={emptyCellStyle}>Không có đơn hàng nào</td>
                </tr>
              ) : (
                filteredOrders.map((item, index) => (
                  <tr key={item.id} style={row(index)}>
                    <td style={td}><strong>{item.code}</strong></td>
                    <td style={td}>
                      <div>{item.fullName}</div>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{item.phone}</div>
                    </td>
                    <td style={td}>
                      <div>{item.paymentMethod}</div>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{item.paymentStatus}</div>
                    </td>
                    <td style={td}>{formatMoney(item.totalAmount)}</td>
                    <td style={td}>
                      <span style={{ ...badgeStyle, ...getStatusStyle(item.status) }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={td}>{formatDate(item.createdAt)}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Link to={`/admin/orders/${item.id}`}>
                          <button style={viewBtn}>Xem</button>
                        </Link>

                        <Link to={`/admin/orders/edit/${item.id}`}>
                          <button style={editBtn}>Sửa</button>
                        </Link>

                        {item.status !== "CONFIRMED" && (
                          <button
                            style={confirmBtn}
                            onClick={() => handleQuickStatus(item.id, "CONFIRMED")}
                          >
                            Xác nhận
                          </button>
                        )}

                        {item.status !== "CANCELLED" && (
                          <button
                            style={cancelBtn}
                            onClick={() => handleQuickStatus(item.id, "CANCELLED")}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const filterCardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  padding: 16,
  marginBottom: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
};

const filterGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 12,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  overflowX: "auto",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 1100,
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  padding: 14,
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
};

const td: React.CSSProperties = {
  padding: 14,
  verticalAlign: "top",
};

const row = (i: number): React.CSSProperties => ({
  borderTop: "1px solid #f1f5f9",
  background: i % 2 === 0 ? "#fff" : "#fcfcfd",
});

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  padding: "0 12px",
  background: "#fff",
};

const emptyCellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 24,
  color: "#6b7280",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 999,
  fontWeight: 600,
};

const viewBtn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};

const editBtn: React.CSSProperties = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};

const confirmBtn: React.CSSProperties = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};

const cancelBtn: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};