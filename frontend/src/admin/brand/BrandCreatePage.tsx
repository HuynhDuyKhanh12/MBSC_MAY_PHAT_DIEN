import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addBrand } from "./brandStorage";

export default function BrandCreatePage() {
  const navigate = useNavigate();

  const fields = [
    { name: "name", label: "Tên thương hiệu", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "slug", label: "Slug", type: "text" as const },
    { name: "description", label: "Mô tả", type: "textarea" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm thương hiệu mới"
      breadcrumb="Thêm thương hiệu"
      backLink="/admin/brand"
      submitText="Lưu thương hiệu"
      fields={fields}
      onSubmit={(formData: any) => {
        addBrand({
          image:
            formData.imagePreview ||
            "https://via.placeholder.com/100x100?text=No+Image",
          name: formData.name || "",
          slug: formData.slug || "",
          description: formData.description || "",
          status: true,
          deleted: false,
        });

        alert("Thêm thương hiệu thành công");
        navigate("/admin/brand");
      }}
    />
  );
}