import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addCoupon } from "./couponStorage";

export default function CouponCreatePage() {
  const navigate = useNavigate();

  const fields = [
    { name: "code", label: "Code", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "discount", label: "Giảm giá", type: "number" as const },
    {
      name: "status",
      label: "Trạng thái",
      type: "select" as const,
      options: ["active", "inactive"],
    },
  ];

  return (
    <AdminCreatePage
      title="Thêm coupon mới"
      breadcrumb="Thêm coupon"
      backLink="/admin/coupon"
      submitText="Lưu coupon"
      fields={fields}
      onSubmit={(formData: any) => {
        addCoupon({
          image:
            formData.imagePreview ||
            "https://via.placeholder.com/100x100?text=Coupon",
          code: formData.code || "",
          discount: Number(formData.discount || 0),
          status: formData.status === "inactive" ? "inactive" : "active",
          isHidden: false,
          deleted: false,
        });

        alert("Thêm coupon thành công");
        navigate("/admin/coupon");
      }}
    />
  );
}