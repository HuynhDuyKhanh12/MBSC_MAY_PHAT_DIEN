import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getAuths,
  softDeleteAuth,
  toggleAuthStatus,
} from "./authStorage";

export default function AuthPage() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  const columns = [
    { key: "id", label: "#" },
    { key: "email", label: "Email" },
    { key: "role", label: "Vai trò" },
    { key: "statusText", label: "Trạng thái" },
  ];

  const rows = getAuths()
    .filter((item) => !item.deleted)
    .map((item) => ({
      ...item,
      statusText: item.status ? "active" : "inactive",
    }));

  const handleToggleStatus = (id: number) => {
    toggleAuthStatus(id);
    setRefresh((prev) => prev + 1);
  };

  const handleView = (id: number) => {
    navigate(`/admin/auth/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/auth/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa tài khoản này?");
    if (!ok) return;
    softDeleteAuth(id);
    setRefresh((prev) => prev + 1);
  };

  return (
    <AdminPageShell
      title="Quản lý xác thực"
      breadcrumb="Auth"
      searchPlaceholder="Tìm kiếm tài khoản..."
      addLink="/admin/auth/create"
      trashLink="/admin/auth/trash"
    >
      <AdminTable
        key={refresh}
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