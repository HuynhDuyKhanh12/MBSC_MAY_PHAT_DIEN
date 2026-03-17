import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function OrderPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "userId", label: "User ID" },
    { key: "orderName", label: "Tên đơn hàng" },
    { key: "total", label: "Tổng tiền" },
    { key: "status", label: "Trạng thái" },
  ];

  const rows = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop",
      userId: 1,
      orderName: "Đơn máy phát điện Honda",
      total: 500000,
      status: "pending",
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý đơn hàng"
      breadcrumb="Order"
      searchPlaceholder="Tìm kiếm đơn hàng..."
      addLink="/admin/order/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}