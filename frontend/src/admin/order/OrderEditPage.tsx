import { FormEvent, useEffect, useState } from "react";
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

function saveOrders(data: OrderItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function OrderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    orderName: "",
    image: "",
    total: "",
    status: "pending" as OrderStatus,
  });

  useEffect(() => {
    const order = getOrders().find((item) => item.id === Number(id));
    if (!order) return;

    setForm({
      userId: order.userId,
      orderName: order.orderName,
      image: order.image,
      total: String(order.total),
      status: order.status,
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const orders = getOrders();
    const index = orders.findIndex((item) => item.id === Number(id));

    if (index === -1) {
      alert("Không tìm thấy đơn hàng");
      return;
    }

    orders[index] = {
      ...orders[index],
      userId: form.userId,
      orderName: form.orderName,
      image: form.image,
      total: Number(form.total),
      status: form.status,
    };

    saveOrders(orders);
    navigate("/admin/order");
  };

  return (
    <div style={pageStyle}>
      <div style={topStyle}>
        <h2 style={{ margin: 0 }}>Sửa đơn hàng</h2>
        <button onClick={() => navigate("/admin/order")} style={backBtn}>
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>User ID</label>
            <input
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Tên đơn hàng</label>
            <input
              type="text"
              name="orderName"
              value={form.orderName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Tổng tiền</label>
            <input
              type="number"
              name="total"
              value={form.total}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="pending">Chờ xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="done">Hoàn thành</option>
              <option value="cancelled">Đã huỷ</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Hình ảnh</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {form.image && (
              <img src={form.image} alt="preview" style={previewStyle} />
            )}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="submit" style={saveBtn}>
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: 20,
};

const topStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const formStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 24,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  outline: "none",
};

const previewStyle: React.CSSProperties = {
  display: "block",
  marginTop: 12,
  width: 120,
  height: 120,
  objectFit: "cover",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const saveBtn: React.CSSProperties = {
  padding: "10px 18px",
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const backBtn: React.CSSProperties = {
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  background: "#e5e7eb",
  cursor: "pointer",
};