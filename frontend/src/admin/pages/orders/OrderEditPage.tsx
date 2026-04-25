import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderByIdApi, updateOrderStatusApi } from "../../../api/modules/orderApi";

export default function OrderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrderByIdApi(id as string);
        const order = res?.data || res?.data?.data || res;
        setStatus(order?.status || "PENDING");
      } catch (error: any) {
        alert(error?.response?.data?.message || error?.message || "Lỗi tải đơn hàng");
      } finally {
        setFetching(false);
      }
    };

    if (id) load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await updateOrderStatusApi(id as string, status);
      alert("Cập nhật trạng thái thành công");
      navigate("/admin/orders");
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Lỗi cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p style={{ padding: 20 }}>Đang tải...</p>;

  return (
    <div style={{ padding: 20 }}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Cập nhật đơn hàng</h2>
        <Link to="/admin/orders">
          <button style={secondaryBtn}>Quay lại</button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={groupStyle}>
          <label style={labelStyle}>Trạng thái đơn hàng</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPING">SHIPPING</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={primaryBtn}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  padding: 20,
  maxWidth: 900,
};

const groupStyle: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  padding: "0 12px",
};

const primaryBtn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
};

const secondaryBtn: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d1d5db",
  padding: "10px 16px",
  borderRadius: 8,
};