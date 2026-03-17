import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function AuthPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "email", label: "Email" },
    { key: "role", label: "Vai trò" },
    { key: "status", label: "Trạng thái" },
  ];

  const rows = [
    {
      id: 1,
      email: "admin@gmail.com",
      role: "admin",
      status: "active",
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý xác thực"
      breadcrumb="Auth"
      searchPlaceholder="Tìm kiếm tài khoản..."
      addLink="/admin/auth/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}