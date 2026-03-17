import AdminCreatePage from "../shared/AdminCreatePage";

export default function WishlistCreatePage() {
  const fields = [
    { name: "userId", label: "User ID", type: "text" as const },
    { name: "productId", label: "Product ID", type: "text" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm wishlist mới"
      breadcrumb="Thêm wishlist"
      backLink="/admin/wishlist"
      submitText="Lưu wishlist"
      fields={fields}
    />
  );
}