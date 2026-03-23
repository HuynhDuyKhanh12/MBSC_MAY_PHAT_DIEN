import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addCategory } from "./categoryStorage";

export default function CategoryCreatePage() {
  const navigate = useNavigate();

  const fields = [
    { name: "name", label: "Tên danh mục", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "slug", label: "Slug", type: "text" as const },
    { name: "description", label: "Mô tả", type: "textarea" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm danh mục mới"
      breadcrumb="Thêm danh mục"
      backLink="/admin/category"
      submitText="Lưu danh mục"
      fields={fields}
      onSubmit={(formData: any) => {
        addCategory({
          image:
            formData.imagePreview ||
            "https://via.placeholder.com/100x100?text=No+Image",
          name: formData.name || "",
          slug: formData.slug || "",
          description: formData.description || "",
          status: true,
          deleted: false,
        });

        alert("Thêm danh mục thành công");
        navigate("/admin/category");
      }}
    />
  );
}