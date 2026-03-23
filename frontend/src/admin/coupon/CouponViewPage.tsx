import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCouponById, toggleCouponStatus } from "./couponStorage";

export default function CouponViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<any>(null);

  const loadCoupon = () => {
    const data = getCouponById(Number(id));
    setCoupon(data || null);
  };

  useEffect(() => {
    loadCoupon();
  }, [id]);

  const handleToggleStatus = () => {
    toggleCouponStatus(Number(id));
    loadCoupon();
  };

  if (!coupon) {
    return <div style={{ padding: 20 }}>Không tìm thấy coupon</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết coupon</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 24,
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <img
            src={coupon.image}
            alt={coupon.code}
            style={{
              width: "100%",
              maxWidth: 200,
              height: 200,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
        </div>

        <div>
          <p><b>Code:</b> {coupon.code}</p>
          <p><b>Giảm giá:</b> {coupon.discount}%</p>
          <p><b>Trạng thái coupon:</b> {coupon.couponStatus}</p>
          <p><b>ID:</b> {coupon.realId}</p>
          <p><b>Hiển thị:</b> {coupon.status ? "Hiển thị" : "Ẩn"}</p>

          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/admin/coupon")}>Quay lại</button>
            <button onClick={() => navigate(`/admin/coupon/edit/${coupon.id}`)}>
              Sửa coupon
            </button>
            <button onClick={handleToggleStatus}>
              {coupon.status ? "Ẩn" : "Hiển thị"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}