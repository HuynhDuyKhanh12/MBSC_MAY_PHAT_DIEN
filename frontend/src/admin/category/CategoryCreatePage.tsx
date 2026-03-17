import AdminCreatePage from "../shared/AdminCreatePage";

export default function CategoryCreatePage() {
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
    />
  );
}