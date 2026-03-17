import AdminCreatePage from "../shared/AdminCreatePage";

export default function CartCreatePage() {
  const fields = [
    { name: "userId", label: "User ID", type: "text" as const },
    { name: "productId", label: "Product ID", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "quantity", label: "Số lượng", type: "number" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm cart mới"
      breadcrumb="Thêm cart"
      backLink="/admin/cart"
      submitText="Lưu cart"
      fields={fields}
    />
  );
}