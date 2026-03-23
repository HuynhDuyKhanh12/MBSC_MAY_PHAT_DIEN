import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getCategoryById, updateCategory } from "./categoryStorage";

export default function CategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const category = getCategoryById(Number(id));
    if (!category) return;

    setInitialValues({
      name: category.name,
      image: category.image,
      slug: category.slug,
      description: category.description || "",
    });
  }, [id]);

  const fields = [
    { name: "name", label: "Tên danh mục", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "slug", label: "Slug", type: "text" as const },
    { name: "description", label: "Mô tả", type: "textarea" as const },
  ];

  if (!initialValues) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <AdminCreatePage
      title="Sửa danh mục"
      breadcrumb="Sửa danh mục"
      backLink="/admin/category"
      submitText="Cập nhật danh mục"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateCategory(Number(id), {
          image: formData.imagePreview || initialValues.image,
          name: formData.name || "",
          slug: formData.slug || "",
          description: formData.description || "",
        });

        alert("Cập nhật danh mục thành công");
        navigate("/admin/category");
      }}
    />
  );
}