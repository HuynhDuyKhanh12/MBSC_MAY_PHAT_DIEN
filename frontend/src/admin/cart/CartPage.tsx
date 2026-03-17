import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function CartPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "userId", label: "User ID" },
    { key: "productName", label: "Tên sản phẩm" },
    { key: "quantity", label: "Số lượng" },
  ];

  const rows = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=300&auto=format&fit=crop",
      userId: 1,
      productName: "Máy phát điện mini Honda",
      quantity: 3,
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý giỏ hàng"
      breadcrumb="Cart"
      searchPlaceholder="Tìm kiếm giỏ hàng..."
      addLink="/admin/cart/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}