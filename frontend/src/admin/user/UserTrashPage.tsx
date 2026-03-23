import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, restoreUser, type UserItem } from "./userStorage";

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác người dùng</h2>

      <button
        onClick={() => navigate("/admin/user")}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </button>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Ảnh</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Khôi phục</th>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>Không có người dùng nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}