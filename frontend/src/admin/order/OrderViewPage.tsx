import { useNavigate, useParams } from "react-router-dom";

type OrderStatus = "pending" | "shipping" | "done" | "cancelled";

type OrderItem = {
  id: number;
  userId: string;
  orderName: string;
  image: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const STORAGE_KEY = "admin_orders";

function getOrders(): OrderItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function OrderViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = getOrders().find((item) => item.id === Number(id));

  if (!order) {
    return <div style={{ padding: 20 }}>Không tìm thấy đơn hàng</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("/admin/order")} style={backBtn}>
        Quay lại
      </button>

      <h2 style={{ margin: "16px 0 20px" }}>Chi tiết đơn hàng</h2>

      <div style={boxStyle}>
        <div>
          <img
            src={order.image}
            alt={order.orderName}
            style={imgStyle}
          />
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <Info label="Mã đơn hàng" value={String(order.id)} />
          <Info label="User ID" value={order.userId} />
          <Info label="Tên đơn hàng" value={order.orderName} />
          <Info
            label="Tổng tiền"
            value={order.total.toLocaleString("vi-VN") + " VND"}
          />
          <Info label="Trạng thái" value={order.status} />
          <Info
            label="Ngày tạo"
            value={new Date(order.createdAt).toLocaleString("vi-VN")}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: 12,
        paddingBottom: 10,
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

const boxStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  gap: 24,
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 260,
  height: 220,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

const backBtn: React.CSSProperties = {
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};