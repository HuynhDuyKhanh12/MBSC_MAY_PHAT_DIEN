import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function CategoryPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "name", label: "Tên danh mục" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Mô tả" },
    { key: "realId", label: "ID" },
  ];

  const rows = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop",
      name: "Khai vị",
      slug: "khai-vi",
      description: "Món ăn của khai vị",
      realId: 1,
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý danh mục"
      breadcrumb="Danh mục"
      searchPlaceholder="Tìm kiếm danh mục..."
      addLink="/admin/category/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}