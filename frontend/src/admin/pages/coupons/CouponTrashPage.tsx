import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  forceDeleteCouponApi,
  getTrashCouponsApi,
  restoreCouponApi,
} from "../../../api/modules/couponApi";

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

export default function CouponTrashPage() {
  const [trash, setTrash] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await getTrashCouponsApi();
      const list = normalizeArrayResponse(res);
      setTrash(list);
    } catch (error: any) {
      console.error("LOAD TRASH COUPONS ERROR:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi tải thùng rác coupon"
      );
      setTrash([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (id: number) => {
    try {
      const res = await restoreCouponApi(id);
      alert(res?.message || "Khôi phục coupon thành công");
      await loadTrash();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Khôi phục thất bại"
      );
    }
  };

  const handleForceDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn coupon này?");
    if (!ok) return;

    try {
      const res = await forceDeleteCouponApi(id);
      alert(res?.message || "Xóa vĩnh viễn coupon thành công");
      await loadTrash();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Xóa vĩnh viễn thất bại"
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          Thùng rác Coupon
        </h2>

        <Link to="/admin/coupons">
          <button style={secondaryBtn}>Quay lại danh sách</button>
        </Link>
      </div>

      <div style={cardStyle}>
        {loading ? (
          <p style={{ padding: 20, margin: 0 }}>Đang tải...</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={th}>ID</th>
                <th style={th}>Code</th>
                <th style={th}>Tiêu đề</th>
                <th style={th}>Giảm</th>
                <th style={th}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {trash.length === 0 ? (
                <tr>
                  <td colSpan={5} style={emptyCellStyle}>
                    Thùng rác trống
                  </td>
                </tr>
              ) : (
                trash.map((item, index) => (
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
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => handleRestore(item.id)}
                          style={restoreBtn}
                        >
                          Khôi phục
                        </button>

                        <button
                          type="button"
                          onClick={() => handleForceDelete(item.id)}
                          style={deleteBtn}
                        >
                          Xóa vĩnh viễn
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
  whiteSpace: "nowrap",
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

const secondaryBtn: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d1d5db",
  padding: "10px 16px",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};

const restoreBtn: React.CSSProperties = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};