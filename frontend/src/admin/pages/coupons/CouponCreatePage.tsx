import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCouponApi } from "../../../api/modules/couponApi";
import CouponForm from "./CouponForm";

export default function CouponCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    title: "",
    discountType: "PERCENT",
    discountValue: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.code.trim()) return alert("Nhập code");

    try {
      setLoading(true);

      await createCouponApi({
        ...form,
        discountValue: Number(form.discountValue),
      });

      alert("Thêm thành công");
      navigate("/admin/coupons");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Thêm coupon</h2>

      <CouponForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Tạo coupon"
      />
    </div>
  );
}