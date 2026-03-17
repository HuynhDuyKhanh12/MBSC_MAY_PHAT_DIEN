import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function WishlistPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "userId", label: "User ID" },
    { key: "productId", label: "Product ID" },
  ];

  const rows = [
    { id: 1, userId: 1, productId: 2 },
  ];

  return (
    <AdminPageShell
      title="Quản lý yêu thích"
      breadcrumb="Wishlist"
      searchPlaceholder="Tìm kiếm wishlist..."
      addLink="/admin/wishlist/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}