import AdminCreatePage from "../shared/AdminCreatePage";

export default function CouponCreatePage() {
  const fields = [
    { name: "code", label: "Code", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "discount", label: "Giảm giá", type: "number" as const },
    { name: "status", label: "Trạng thái", type: "select" as const, options: ["active", "inactive"] },
  ];

  return (
    <AdminCreatePage
      title="Thêm coupon mới"
      breadcrumb="Thêm coupon"
      backLink="/admin/coupon"
      submitText="Lưu coupon"
      fields={fields}
    />
  );
}