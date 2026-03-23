import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuths,
  restoreAuth,
  deleteAuthForever,
  clearAuthTrash,
  type AuthItem,
} from "./authStorage";

export default function AuthTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AuthItem[]>([]);

  const loadTrash = () => {
    setRows(getAuths().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreAuth(id);
    loadTrash();
  };

  const handleDeleteForever = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn tài khoản này?");
    if (!ok) return;
    deleteAuthForever(id);
    loadTrash();
  };

  const handleClearTrash = () => {
    const ok = window.confirm("Bạn có chắc muốn xóa tất cả tài khoản trong thùng rác?");
    if (!ok) return;
    clearAuthTrash();
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác tài khoản</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/auth")}>
          Quay lại
        </button>

        <button
          onClick={handleClearTrash}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Xóa tất cả thùng rác
        </button>
      </div>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Khôi phục</th>
            <th>Xóa khỏi thùng rác</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>
                  <button onClick={() => handleRestore(item.id)}>
                    Khôi phục
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteForever(item.id)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Không có tài khoản nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}