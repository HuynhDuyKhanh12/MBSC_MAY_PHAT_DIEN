import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function CouponPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "code", label: "Code" },
    { key: "discount", label: "Giảm giá" },
    { key: "status", label: "Trạng thái" },
  ];

  const rows = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=300&auto=format&fit=crop",
      code: "SALE10",
      discount: 10,
      status: "active",
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý mã giảm giá"
      breadcrumb="Coupon"
      searchPlaceholder="Tìm kiếm coupon..."
      addLink="/admin/coupon/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}