import AdminCreatePage from "../shared/AdminCreatePage";

export default function OrderCreatePage() {
  const fields = [
    { name: "userId", label: "User ID", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "total", label: "Tổng tiền", type: "number" as const },
    { name: "status", label: "Trạng thái", type: "select" as const, options: ["pending", "shipping", "done"] },
  ];

  return (
    <AdminCreatePage
      title="Thêm đơn hàng mới"
      breadcrumb="Thêm order"
      backLink="/admin/order"
      submitText="Lưu đơn hàng"
      fields={fields}
    />
  );
}