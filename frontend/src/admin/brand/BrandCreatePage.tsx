import AdminCreatePage from "../shared/AdminCreatePage";

export default function BrandCreatePage() {
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
    />
  );
}