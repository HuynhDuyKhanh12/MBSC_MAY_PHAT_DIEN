import AdminCreatePage from "../shared/AdminCreatePage";

export default function AuthCreatePage() {
  const fields = [
    { name: "email", label: "Email", type: "text" as const },
    { name: "password", label: "Mật khẩu", type: "text" as const },
    { name: "role", label: "Vai trò", type: "select" as const, options: ["admin", "user"] },
    { name: "status", label: "Trạng thái", type: "select" as const, options: ["active", "blocked"] },
  ];

  return (
    <AdminCreatePage
      title="Thêm tài khoản xác thực"
      breadcrumb="Thêm auth"
      backLink="/admin/auth"
      submitText="Lưu tài khoản"
      fields={fields}
    />
  );
}