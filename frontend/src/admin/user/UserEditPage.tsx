import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getUserById, updateUser } from "./userStorage";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const user = getUserById(Number(id));
    if (!user) return;

    setInitialValues({
      name: user.name,
      image: user.image,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  }, [id]);

  const fields = [
    { name: "name", label: "Họ tên", type: "text" as const },
    { name: "image", label: "Ảnh đại diện", type: "file" as const },
    { name: "email", label: "Email", type: "text" as const },
    { name: "phone", label: "Số điện thoại", type: "text" as const },
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
      title="Sửa người dùng"
      breadcrumb="Sửa user"
      backLink="/admin/user"
      submitText="Cập nhật người dùng"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateUser(Number(id), {
          image: formData.imagePreview || initialValues.image,
          name: formData.name || "",
          email: formData.email || "",
          phone: formData.phone || "",
          role: formData.role || "user",
        });

        alert("Cập nhật người dùng thành công");
        navigate("/admin/user");
      }}
    />
  );
}