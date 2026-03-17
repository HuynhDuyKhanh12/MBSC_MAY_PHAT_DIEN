import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function BrandPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "name", label: "Tên thương hiệu" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Mô tả" },
    { key: "realId", label: "ID" },
  ];

  const rows = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=300&auto=format&fit=crop",
      name: "Món Ý",
      slug: "mon-y",
      description: "Brand món Ý",
      realId: 1,
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý thương hiệu"
      breadcrumb="Thương hiệu"
      searchPlaceholder="Tìm kiếm thương hiệu..."
      addLink="/admin/brand/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}