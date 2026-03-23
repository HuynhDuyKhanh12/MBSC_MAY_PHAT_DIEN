import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getCouponById, updateCoupon } from "./couponStorage";

export default function CouponEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const coupon = getCouponById(Number(id));
    if (!coupon) return;

    setInitialValues({
      code: coupon.code,
      image: coupon.image,
      discount: coupon.discount,
      couponStatus: coupon.couponStatus,
    });
  }, [id]);

  const fields = [
    { name: "code", label: "Code", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "discount", label: "Giảm giá", type: "number" as const },
    {
      name: "couponStatus",
      label: "Trạng thái coupon",
      type: "select" as const,
      options: ["active", "inactive"],
    },
  ];

  if (!initialValues) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <AdminCreatePage
      title="Sửa coupon"
      breadcrumb="Sửa coupon"
      backLink="/admin/coupon"
      submitText="Cập nhật coupon"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateCoupon(Number(id), {
          image: formData.imagePreview || initialValues.image,
          code: formData.code || "",
          discount: Number(formData.discount || 0),
          couponStatus:
            formData.couponStatus === "inactive" ? "inactive" : "active",
        });

        alert("Cập nhật coupon thành công");
        navigate("/admin/coupon");
      }}
    />
  );
}