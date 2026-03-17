import AdminCreatePage from "../shared/AdminCreatePage";

export default function ReviewCreatePage() {
  const fields = [
    { name: "userId", label: "User ID", type: "text" as const },
    { name: "productId", label: "Product ID", type: "text" as const },
    { name: "rating", label: "Số sao", type: "number" as const },
    { name: "comment", label: "Bình luận", type: "textarea" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm đánh giá mới"
      breadcrumb="Thêm review"
      backLink="/admin/review"
      submitText="Lưu đánh giá"
      fields={fields}
    />
  );
}