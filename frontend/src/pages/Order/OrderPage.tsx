import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { createOrderApi } from "../../api/modules/orderApi";
import "./order-page.css";

type OrderSummaryState = {
  note?: string;
  needInvoice?: boolean;
  deliveryMode?: "store" | "time";
  deliveryDate?: string;
  deliverySlot?: string;
  subtotal?: number;
  cartCount?: number;
};

const formatVND = (n: number) =>
  Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartState = (location.state || {}) as OrderSummaryState;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    paymentMethod: "COD",
    shippingFee: 30000,
    couponCode: "",
    note: cartState.note || "",
  });

  const totalPreview = useMemo(() => {
    return Number(cartState.subtotal || 0) + Number(form.shippingFee || 0);
  }, [cartState.subtotal, form.shippingFee]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn cần đăng nhập để đặt hàng");
      navigate("/auth");
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "shippingFee" ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      alert("Vui lòng nhập họ tên");
      return false;
    }

    if (!form.phone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }

    if (!form.province.trim()) {
      alert("Vui lòng nhập tỉnh/thành phố");
      return false;
    }

    if (!form.district.trim()) {
      alert("Vui lòng nhập quận/huyện");
      return false;
    }

    if (!form.ward.trim()) {
      alert("Vui lòng nhập phường/xã");
      return false;
    }

    if (!form.detailAddress.trim()) {
      alert("Vui lòng nhập địa chỉ chi tiết");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload: any = {
        paymentMethod: form.paymentMethod,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        province: form.province.trim(),
        district: form.district.trim(),
        ward: form.ward.trim(),
        detailAddress: form.detailAddress.trim(),
        shippingFee: Number(form.shippingFee || 0),
        note: form.note.trim(),
      };

      if (form.couponCode.trim()) {
        payload.couponCode = form.couponCode.trim().toUpperCase();
      }

      const res = await createOrderApi(payload);

      alert("Đặt hàng thành công");

      const orderId = res?.data?.id || res?.id;

      if (orderId) {
        navigate(`/order-success/${orderId}`);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.log("Lỗi tạo đơn hàng:", error?.response?.data || error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Đặt hàng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="orderPage">
        <div className="orderContainer">
          <form className="orderForm" onSubmit={handleSubmit}>
            <h2 className="orderTitle">Thông tin đặt hàng</h2>

            <div className="orderGrid2">
              <div className="orderField">
                <label>Họ tên *</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="orderField">
                <label>Số điện thoại *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div className="orderGrid3">
              <div className="orderField">
                <label>Tỉnh/Thành phố *</label>
                <input
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  placeholder="Hồ Chí Minh"
                />
              </div>

              <div className="orderField">
                <label>Quận/Huyện *</label>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Quận 1"
                />
              </div>

              <div className="orderField">
                <label>Phường/Xã *</label>
                <input
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  placeholder="Phường Bến Nghé"
                />
              </div>
            </div>

            <div className="orderField">
              <label>Địa chỉ chi tiết *</label>
              <input
                name="detailAddress"
                value={form.detailAddress}
                onChange={handleChange}
                placeholder="123 Lê Lợi"
              />
            </div>

            <div className="orderGrid2">
              <div className="orderField">
                <label>Phương thức thanh toán *</label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="COD">Thanh toán khi nhận hàng</option>
                  <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                  <option value="MOMO">Momo</option>
                  <option value="VNPAY">VNPay</option>
                  <option value="ZALOPAY">ZaloPay</option>
                </select>
              </div>

              <div className="orderField">
                <label>Phí vận chuyển</label>
                <input
                  name="shippingFee"
                  type="number"
                  value={form.shippingFee}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="orderField">
              <label>Mã giảm giá</label>
              <input
                name="couponCode"
                value={form.couponCode}
                onChange={handleChange}
                placeholder="SALE10"
              />
            </div>

            <div className="orderField">
              <label>Ghi chú</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={4}
                placeholder="Giao giờ hành chính..."
              />
            </div>

            <button className="orderSubmit" type="submit" disabled={loading}>
              {loading ? "ĐANG ĐẶT HÀNG..." : "ĐẶT HÀNG"}
            </button>
          </form>

          <aside className="orderSummary">
            <h3>Tóm tắt đơn hàng</h3>

            <div className="orderSummaryRow">
              <span>Số lượng</span>
              <b>{cartState.cartCount || 0}</b>
            </div>

            <div className="orderSummaryRow">
              <span>Tạm tính</span>
              <b>{formatVND(cartState.subtotal || 0)}</b>
            </div>

            <div className="orderSummaryRow">
              <span>Phí vận chuyển</span>
              <b>{formatVND(form.shippingFee)}</b>
            </div>

            <div className="orderSummaryRow isTotal">
              <span>Dự kiến thanh toán</span>
              <b>{formatVND(totalPreview)}</b>
            </div>

            <div className="orderShipBox">
              <div>
                <b>Thời gian giao:</b>{" "}
                {cartState.deliveryDate || "Giao khi có hàng"}
              </div>

              {cartState.deliverySlot && (
                <div>
                  <b>Khung giờ:</b> {cartState.deliverySlot}
                </div>
              )}

              {cartState.needInvoice && <div>✅ Có yêu cầu xuất hóa đơn</div>}
            </div>

            <p className="orderNote">
              Khi bấm <b>ĐẶT HÀNG</b>, hệ thống sẽ lấy sản phẩm trong cart để
              tạo order và backend sẽ tự làm trống cart.
            </p>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}