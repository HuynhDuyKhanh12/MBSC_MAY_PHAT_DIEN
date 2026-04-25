import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCouponByIdApi,
  updateCouponApi,
} from "../../../api/modules/couponApi";
import CouponForm from "./CouponForm";

export default function CouponEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState<any>({
    code: "",
    title: "",
    discountType: "PERCENT",
    discountValue: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCouponByIdApi(id as string);
        const coupon = res?.data || res?.data?.data || res;

        if (coupon) {
          setForm({
            code: coupon.code || "",
            title: coupon.title || "",
            discountType: coupon.discountType || "PERCENT",
            discountValue: coupon.discountValue || "",
            startDate: coupon.startDate
              ? new Date(coupon.startDate).toISOString().slice(0, 10)
              : "",
            endDate: coupon.endDate
              ? new Date(coupon.endDate).toISOString().slice(0, 10)
              : "",
            isActive: Boolean(coupon.isActive),
          });
        }
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được dữ liệu"
        );
      } finally {
        setFetching(false);
      }
    };

    if (id) load();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateCouponApi(Number(id), {
        ...form,
        discountValue: Number(form.discountValue),
      });

      alert("Cập nhật OK");
      navigate("/admin/coupons");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi cập nhật"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p style={{ padding: 24 }}>Đang tải...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Sửa coupon</h2>

      <CouponForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Cập nhật"
      />
    </div>
  );
}