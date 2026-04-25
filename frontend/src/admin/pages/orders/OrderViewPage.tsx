import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderByIdApi } from "../../../api/modules/orderApi";

function formatMoney(value: number | string) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

export default function OrderViewPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrderByIdApi(id as string);
        setOrder(res?.data || res?.data?.data || res);
      } catch (error: any) {
        alert(error?.response?.data?.message || error?.message || "Lỗi tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;
  if (!order) return <p style={{ padding: 20 }}>Không tìm thấy đơn hàng</p>;

  return (
    <div style={{ padding: 20 }}>
      <div style={headerStyle}>
        <div>
          <h2 style={{ margin: 0 }}>Chi tiết đơn hàng</h2>
          <p style={{ color: "#6b7280" }}>{order.code}</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/admin/orders">
            <button style={secondaryBtn}>Quay lại</button>
          </Link>
          <Link to={`/admin/orders/edit/${order.id}`}>
            <button style={primaryBtn}>Cập nhật trạng thái</button>
          </Link>
        </div>
      </div>

      <div style={cardStyle}>
        <h3>Thông tin khách hàng</h3>
        <p><strong>Họ tên:</strong> {order.fullName}</p>
        <p><strong>Số điện thoại:</strong> {order.phone}</p>
        <p><strong>Địa chỉ:</strong> {order.detailAddress}</p>
        <p><strong>Khu vực:</strong> {order.ward}, {order.district}, {order.province}</p>
      </div>

      <div style={cardStyle}>
        <h3>Thông tin đơn hàng</h3>
        <p><strong>Trạng thái:</strong> {order.status}</p>
        <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
        <p><strong>Payment status:</strong> {order.paymentStatus}</p>
        <p><strong>Tổng tiền:</strong> {formatMoney(order.totalAmount)}</p>
      </div>

      <div style={cardStyle}>
        <h3>Danh sách sản phẩm</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Tên</th>
              <th style={th}>SKU</th>
              <th style={th}>SL</th>
              <th style={th}>Đơn giá</th>
              <th style={th}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item: any) => (
              <tr key={item.id}>
                <td style={td}>{item.productName}</td>
                <td style={td}>{item.sku || "-"}</td>
                <td style={td}>{item.quantity}</td>
                <td style={td}>{formatMoney(item.unitPrice)}</td>
                <td style={td}>{formatMoney(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  padding: 20,
  marginBottom: 16,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};

const td: React.CSSProperties = {
  padding: 12,
  borderTop: "1px solid #f1f5f9",
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