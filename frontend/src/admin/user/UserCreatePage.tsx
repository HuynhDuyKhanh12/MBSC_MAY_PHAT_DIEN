import AdminCreatePage from "../shared/AdminCreatePage";

export default function UserCreatePage() {
  const fields = [
    { name: "name", label: "Họ tên", type: "text" as const },
    { name: "image", label: "Ảnh đại diện", type: "file" as const },
    { name: "email", label: "Email", type: "text" as const },
    { name: "phone", label: "Số điện thoại", type: "text" as const },
    { name: "role", label: "Vai trò", type: "select" as const, options: ["admin", "user"] },
  ];

  return (
    <AdminCreatePage
      title="Thêm người dùng mới"
      breadcrumb="Thêm user"
      backLink="/admin/user"
      submitText="Lưu người dùng"
      fields={fields}
    />
  );
}