import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  forceDeleteUserApi,
  getTrashUsersApi,
  restoreUserApi,
} from "../../../api/modules/userApi";

type UserItem = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  role?: {
    id: number;
    name: string;
  };
};

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export default function UserTrashPage() {
  const [trash, setTrash] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const data = await getTrashUsersApi();
      setTrash(normalizeArrayResponse(data));
    } catch (error: any) {
      console.error("LOAD TRASH USERS ERROR:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi tải thùng rác người dùng"
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
      const res = await restoreUserApi(id);
      alert(res?.message || "Khôi phục thành công");
      await loadTrash();
    } catch (error: any) {
      alert(
        error?.response?.data?.message || error?.message || "Khôi phục thất bại"
      );
    }
  };

  const handleForceDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn người dùng này?");
    if (!ok) return;

    try {
      const res = await forceDeleteUserApi(id);
      alert(res?.message || "Xóa vĩnh viễn thành công");
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
        <h2 style={{ margin: 0 }}>Thùng rác Người dùng</h2>

        <Link to="/admin/users">
          <button style={secondaryBtnStyle}>Quay lại danh sách</button>
        </Link>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          overflowX: "auto",
        }}
      >
        {loading ? (
          <p style={{ padding: 20, margin: 0 }}>Đang tải...</p>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: 1000,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>SĐT</th>
                <th style={thStyle}>Vai trò</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {trash.length === 0 ? (
                <tr>
                  <td colSpan={7} style={emptyCellStyle}>
                    Thùng rác trống
                  </td>
                </tr>
              ) : (
                trash.map((item) => (
                  <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{item.id}</td>
                    <td style={tdStyle}>{item.fullName}</td>
                    <td style={tdStyle}>{item.email}</td>
                    <td style={tdStyle}>{item.phone || "-"}</td>
                    <td style={tdStyle}>{item.role?.name || "-"}</td>
                    <td style={tdStyle}>{item.status}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => handleRestore(item.id)}
                          style={restoreBtnStyle}
                        >
                          Khôi phục
                        </button>

                        <button
                          type="button"
                          onClick={() => handleForceDelete(item.id)}
                          style={forceDeleteBtnStyle}
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

const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: 14,
  fontWeight: 700,
  color: "#111827",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  verticalAlign: "middle",
  fontSize: 14,
  color: "#111827",
};

const emptyCellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 24,
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const restoreBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const forceDeleteBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#dc2626",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};