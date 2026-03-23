import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getAuthById, updateAuth } from "./authStorage";

export default function AuthEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const auth = getAuthById(Number(id));
    if (!auth) return;

    setInitialValues({
      email: auth.email,
      password: auth.password,
      role: auth.role,
    });
  }, [id]);

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

  if (!initialValues) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <AdminCreatePage
      title="Sửa tài khoản"
      breadcrumb="Sửa auth"
      backLink="/admin/auth"
      submitText="Cập nhật tài khoản"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateAuth(Number(id), {
          email: formData.email || "",
          password: formData.password || "",
          role: formData.role || "user",
        });

        alert("Cập nhật tài khoản thành công");
        navigate("/admin/auth");
      }}
    />
  );
}