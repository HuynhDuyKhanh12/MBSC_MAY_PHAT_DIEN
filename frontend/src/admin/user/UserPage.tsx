import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getUsers,
  softDeleteUser,
  toggleUserStatus,
  type UserItem,
} from "./userStorage";

export default function UserPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<UserItem[]>([]);

  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Ảnh" },
    { key: "name", label: "Họ tên" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Số điện thoại" },
    { key: "role", label: "Vai trò" },
    { key: "realId", label: "ID" },
  ];

  const loadUsers = () => {
    const data = getUsers().filter((item) => !item.deleted);
    setRows(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleView = (id: number) => {
    navigate(`/admin/user/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/user/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa người dùng này?");
    if (!ok) return;

    softDeleteUser(id);
    loadUsers();
  };

  const handleToggleStatus = (id: number) => {
    toggleUserStatus(id);
    loadUsers();
  };

  return (
    <AdminPageShell
      title="Quản lý người dùng"
      breadcrumb="User"
      searchPlaceholder="Tìm kiếm người dùng..."
      filters={[{ label: "Vai trò", options: ["admin", "user"] }]}
      addLink="/admin/user/create"
    >
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/user/trash")}>Thùng rác</button>
      </div>

      <AdminTable
        columns={columns}
        rows={rows}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </AdminPageShell>
  );
}