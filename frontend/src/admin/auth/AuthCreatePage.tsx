import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addAuth } from "./authStorage";

export default function AuthCreatePage() {
  const navigate = useNavigate();

  const fields = [
    { name: "email", label: "Email", type: "text" as const },
    { name: "password", label: "Mật khẩu", type: "text" as const },
    {
      name: "role",
      label: "Vai trò",
      type: "select" as const,
      options: ["admin", "user"],
    },
  ];

  return (
    <AdminCreatePage
      title="Thêm tài khoản mới"
      breadcrumb="Thêm auth"
      backLink="/admin/auth"
      submitText="Lưu tài khoản"
      fields={fields}
      onSubmit={(formData: any) => {
        addAuth({
          email: formData.email || "",
          password: formData.password || "",
          role: formData.role || "user",
          status: true,
          deleted: false,
        });

        alert("Thêm tài khoản thành công");
        navigate("/admin/auth");
      }}
    />
  );
}