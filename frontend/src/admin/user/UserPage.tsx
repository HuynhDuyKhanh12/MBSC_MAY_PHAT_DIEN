import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function UserPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Ảnh" },
    { key: "name", label: "Họ tên" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Số điện thoại" },
    { key: "role", label: "Vai trò" },
    { key: "realId", label: "ID" },
  ];

  const rows = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      name: "Khanh",
      email: "khanh@gmail.com",
      phone: "0911111111",
      role: "admin",
      realId: 1,
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý người dùng"
      breadcrumb="User"
      searchPlaceholder="Tìm kiếm người dùng..."
      filters={[{ label: "Vai trò", options: ["admin", "user"] }]}
      addLink="/admin/user/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}