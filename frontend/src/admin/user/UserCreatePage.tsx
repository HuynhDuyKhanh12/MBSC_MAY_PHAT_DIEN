import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addUser } from "./userStorage";

export default function UserCreatePage() {
  const navigate = useNavigate();

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

  return (
    <AdminCreatePage
      title="Thêm người dùng mới"
      breadcrumb="Thêm user"
      backLink="/admin/user"
      submitText="Lưu người dùng"
      fields={fields}
      onSubmit={(formData: any) => {
        addUser({
          image:
            formData.imagePreview ||
            "https://via.placeholder.com/100x100?text=Avatar",
          name: formData.name || "",
          email: formData.email || "",
          phone: formData.phone || "",
          role: formData.role || "user",
          status: true,
          deleted: false,
        });

        alert("Thêm người dùng thành công");
        navigate("/admin/user");
      }}
    />
  );
}