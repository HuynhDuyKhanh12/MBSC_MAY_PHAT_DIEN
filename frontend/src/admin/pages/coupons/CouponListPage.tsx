import { useEffect, useState } from "react";
import {
  getCouponsApi,
  deleteCouponApi,
  toggleCouponApi,
} from "../../../api/modules/couponApi";
import { Link } from "react-router-dom";

type CouponItem = {
  id: number;
  code: string;
  title: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  deletedAt?: string | null;
};

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export default function CouponListPage() {
  const [data, setData] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getCouponsApi();
      const list = normalizeArrayResponse(res).filter(
        (item: CouponItem) => !item.deletedAt
      );
      setData(list);
    } catch (error: any) {
      console.error("LOAD COUPONS ERROR:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi tải coupon"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn chuyển coupon vào thùng rác?");
    if (!ok) return;

    try {
      const res = await deleteCouponApi(id);
      alert(res?.message || "Đã chuyển vào thùng rác");
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Xóa thất bại");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await toggleCouponApi(id);
      alert(res?.message || "Đổi trạng thái thành công");
      await load();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Ẩn / hiện thất bại"
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: 28 }}>Quản lý Coupon</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/admin/coupons/create">
            <button style={primaryBtn}>+ Thêm</button>
          </Link>

          <Link to="/admin/coupons/trash">
            <button style={secondaryBtn}>Thùng rác</button>
          </Link>
        </div>
      </div>

      <div style={cardStyle}>
        {loading ? (
          <p style={{ padding: 20 }}>Đang tải...</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={th}>ID</th>
                <th style={th}>Code</th>
                <th style={th}>Tiêu đề</th>
                <th style={th}>Giảm</th>
                <th style={th}>Trạng thái</th>
                <th style={th}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} style={emptyCellStyle}>
                    Không có coupon nào
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} style={row(index)}>
                    <td style={td}>{item.id}</td>
                    <td style={td}>{item.code}</td>
                    <td style={td}>{item.title}</td>
                    <td style={td}>
                      {item.discountType === "PERCENT"
                        ? `${item.discountValue}%`
                        : `${item.discountValue}đ`}
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          ...badge,
                          background: item.isActive ? "#dcfce7" : "#fee2e2",
                          color: item.isActive ? "#166534" : "#991b1b",
                        }}
                      >
                        {item.isActive ? "ACTIVE" : "OFF"}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Link to={`/admin/coupons/edit/${item.id}`}>
                          <button style={editBtn}>Sửa</button>
                        </Link>

                        <button
                          style={deleteBtn}
                          onClick={() => handleDelete(item.id)}
                        >
                          Xóa
                        </button>

                        <button
                          style={statusBtn}
                          onClick={() => handleToggle(item.id)}
                        >
                          {item.isActive ? "Ẩn" : "Hiện"}
                        </button>
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
  marginBottom: 20,
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
  minWidth: 900,
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  padding: 14,
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
};

const td: React.CSSProperties = {
  padding: 14,
};

const row = (i: number): React.CSSProperties => ({
  borderTop: "1px solid #f1f5f9",
  background: i % 2 === 0 ? "#fff" : "#fcfcfd",
});

const emptyCellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 24,
  color: "#6b7280",
};

const badge: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 999,
  fontWeight: 600,
};

const primaryBtn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
};

const secondaryBtn: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d1d5db",
  padding: "10px 16px",
  borderRadius: 8,
};

const editBtn: React.CSSProperties = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};

const deleteBtn: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};

const statusBtn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};