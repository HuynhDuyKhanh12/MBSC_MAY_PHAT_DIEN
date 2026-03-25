import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  restoreUser,
  deleteUserForever,
  clearUserTrash,
  type UserItem,
} from "./userStorage";

export default function UserTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<UserItem[]>([]);

  const loadTrash = () => {
    setRows(getUsers().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreUser(id);
    loadTrash();
  };

  const handleDeleteForever = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn người dùng này?");
    if (!ok) return;

    deleteUserForever(id);
    loadTrash();
  };

  const handleClearTrash = () => {
    const ok = window.confirm("Bạn có chắc muốn xóa tất cả người dùng trong thùng rác?");
    if (!ok) return;

    clearUserTrash();
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác người dùng</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/user")}>
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
            <th>Ảnh</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
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

                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 70, height: 70, objectFit: "cover" }}
                  />
                </td>

                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
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
              <td colSpan={8}>Không có người dùng nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}