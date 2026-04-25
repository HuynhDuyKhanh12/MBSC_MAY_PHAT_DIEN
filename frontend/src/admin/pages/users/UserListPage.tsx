import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  changeUserStatusApi,
  deleteUserApi,
  getUsersApi,
} from "../../../api/modules/userApi";

type UserItem = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  role?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  deletedAt?: string | null;
};

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function getAvatarSrc(avatar?: string) {
  if (!avatar || !String(avatar).trim()) return "";
  const value = String(avatar).trim();

  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `http://localhost:5000${value}`;
  if (value.startsWith("uploads/")) return `http://localhost:5000/${value}`;
  if (value.startsWith("/")) return `http://localhost:5000${value}`;

  return `http://localhost:5000/uploads/${value}`;
}

export default function UserListPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi();
      const normalized = normalizeArrayResponse(data).filter(
        (item: UserItem) => !item.deletedAt
      );
      setUsers(normalized);
    } catch (error: any) {
      console.error("LOAD USERS ERROR:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi tải người dùng"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa người dùng này?");
    if (!ok) return;

    try {
      const res = await deleteUserApi(id);
      alert(res?.message || "Đã chuyển vào thùng rác");
      await loadUsers();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Xóa thất bại");
    }
  };

  const handleChangeStatus = async (
    id: number,
    status: "ACTIVE" | "INACTIVE" | "BLOCKED"
  ) => {
    try {
      const res = await changeUserStatusApi(id, status);
      alert(res?.message || "Cập nhật trạng thái thành công");
      await loadUsers();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Đổi trạng thái thất bại"
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
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
          Quản lý Người dùng
        </h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/users/create">
            <button style={primaryBtnStyle}>+ Thêm người dùng</button>
          </Link>

          <Link to="/admin/users/trash">
            <button style={secondaryBtnStyle}>Thùng rác</button>
          </Link>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          overflowX: "auto",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        {loading ? (
          <p style={{ padding: 20, margin: 0 }}>Đang tải...</p>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: 1200,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Avatar</th>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>SĐT</th>
                <th style={thStyle}>Giới tính</th>
                <th style={thStyle}>Vai trò</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={9} style={emptyCellStyle}>
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((item, index) => {
                  const avatarSrc = getAvatarSrc(item.avatar);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        background: index % 2 === 0 ? "#ffffff" : "#fcfcfd",
                      }}
                    >
                      <td style={tdStyle}>{item.id}</td>

                      <td style={tdStyle}>
                        <div style={avatarBoxStyle}>
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={item.fullName}
                              style={avatarStyle}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>
                              No avatar
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={tdStyle}>{item.fullName}</td>
                      <td style={tdStyle}>{item.email}</td>
                      <td style={tdStyle}>{item.phone || "-"}</td>
                      <td style={tdStyle}>{item.gender || "-"}</td>
                      <td style={tdStyle}>{item.role?.name || "-"}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            ...badgeStyle,
                            background:
                              item.status === "ACTIVE"
                                ? "#dcfce7"
                                : item.status === "INACTIVE"
                                ? "#fef3c7"
                                : "#fee2e2",
                            color:
                              item.status === "ACTIVE"
                                ? "#166534"
                                : item.status === "INACTIVE"
                                ? "#92400e"
                                : "#991b1b",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Link to={`/admin/users/edit/${item.id}`}>
                            <button style={editBtnStyle}>Sửa</button>
                          </Link>

                          <button
                            style={deleteBtnStyle}
                            onClick={() => handleDelete(item.id)}
                          >
                            Xóa
                          </button>

                          <button
                            style={statusBtnStyle}
                            onClick={() =>
                              handleChangeStatus(
                                item.id,
                                item.status === "ACTIVE"
                                  ? "INACTIVE"
                                  : "ACTIVE"
                              )
                            }
                          >
                            {item.status === "ACTIVE" ? "Khóa" : "Mở"}
                          </button>

                          {item.status !== "BLOCKED" && (
                            <button
                              style={blockBtnStyle}
                              onClick={() =>
                                handleChangeStatus(item.id, "BLOCKED")
                              }
                            >
                              Chặn
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
  color: "#6b7280",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
};

const avatarBoxStyle: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 999,
  overflow: "hidden",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const avatarStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 600,
  cursor: "pointer",
};

const editBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#f59e0b",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const statusBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const blockBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#7c3aed",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};