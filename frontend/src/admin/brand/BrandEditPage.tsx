import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getBrandById, updateBrand } from "./brandStorage";

export default function BrandEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const brand = getBrandById(Number(id));
    if (!brand) return;

    setInitialValues({
      name: brand.name,
      image: brand.image,
      slug: brand.slug,
      description: brand.description || "",
    });
  }, [id]);

  const fields = [
    { name: "name", label: "Tên thương hiệu", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "slug", label: "Slug", type: "text" as const },
    { name: "description", label: "Mô tả", type: "textarea" as const },
  ];

  if (!initialValues) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <AdminCreatePage
      title="Sửa thương hiệu"
      breadcrumb="Sửa thương hiệu"
      backLink="/admin/brand"
      submitText="Cập nhật thương hiệu"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateBrand(Number(id), {
          image: formData.imagePreview || initialValues.image,
          name: formData.name || "",
          slug: formData.slug || "",
          description: formData.description || "",
        });

        alert("Cập nhật thương hiệu thành công");
        navigate("/admin/brand");
      }}
    />
  );
}