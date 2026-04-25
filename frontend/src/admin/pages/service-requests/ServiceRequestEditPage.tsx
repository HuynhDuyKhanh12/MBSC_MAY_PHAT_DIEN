import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getServiceRequestByIdApi,
  updateServiceRequestApi,
} from "../../../api/modules/serviceRequestApi";
import "./ServiceRequestAdmin.css";

export default function ServiceRequestEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    type: "REPAIR",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    productName: "",
    productModel: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    issueTitle: "",
    issueDescription: "",
    preferredDate: "",
    preferredTimeSlot: "",
    imageUrlsText: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getServiceRequestByIdApi(id!);
        const data = res.data;

        setForm({
          type: data.type || "REPAIR",
          customerName: data.customerName || "",
          customerPhone: data.customerPhone || "",
          customerEmail: data.customerEmail || "",
          province: data.province || "",
          district: data.district || "",
          ward: data.ward || "",
          detailAddress: data.detailAddress || "",
          productName: data.productName || "",
          productModel: data.productModel || "",
          serialNumber: data.serialNumber || "",
          purchaseDate: data.purchaseDate ? data.purchaseDate.slice(0, 10) : "",
          warrantyExpiry: data.warrantyExpiry ? data.warrantyExpiry.slice(0, 10) : "",
          issueTitle: data.issueTitle || "",
          issueDescription: data.issueDescription || "",
          preferredDate: data.preferredDate ? data.preferredDate.slice(0, 10) : "",
          preferredTimeSlot: data.preferredTimeSlot || "",
          imageUrlsText: (data.images || []).map((img: any) => img.imageUrl).join("\n"),
        });
      } catch (error: any) {
        alert(error?.response?.data?.message || "Không lấy được dữ liệu");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (name: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const imageUrls = form.imageUrlsText
        .split("\n")
        .map((x: string) => x.trim())
        .filter(Boolean);

      await updateServiceRequestApi(id!, {
        type: form.type,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        province: form.province,
        district: form.district,
        ward: form.ward,
        detailAddress: form.detailAddress,
        productName: form.productName,
        productModel: form.productModel,
        serialNumber: form.serialNumber,
        purchaseDate: form.purchaseDate || undefined,
        warrantyExpiry: form.warrantyExpiry || undefined,
        issueTitle: form.issueTitle,
        issueDescription: form.issueDescription,
        preferredDate: form.preferredDate || undefined,
        preferredTimeSlot: form.preferredTimeSlot,
        imageUrls,
      });

      alert("Cập nhật phiếu thành công");
      navigate(`/admin/service-requests/${id}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <div className="srPage">
      <div className="srHeader">
        <div>
          <h1>Cập nhật phiếu dịch vụ</h1>
          <p>Sửa thông tin phiếu bảo trì / sửa chữa.</p>
        </div>
      </div>

      <form className="srForm" onSubmit={handleSubmit}>
        <div className="srFormGrid">
          <label>
            Loại phiếu
            <select value={form.type} onChange={(e) => handleChange("type", e.target.value)}>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="REPAIR">Sửa chữa</option>
            </select>
          </label>

          <label>
            Tên khách hàng
            <input value={form.customerName} onChange={(e) => handleChange("customerName", e.target.value)} />
          </label>

          <label>
            Số điện thoại
            <input value={form.customerPhone} onChange={(e) => handleChange("customerPhone", e.target.value)} />
          </label>

          <label>
            Email
            <input value={form.customerEmail} onChange={(e) => handleChange("customerEmail", e.target.value)} />
          </label>

          <label>
            Tỉnh/Thành
            <input value={form.province} onChange={(e) => handleChange("province", e.target.value)} />
          </label>

          <label>
            Quận/Huyện
            <input value={form.district} onChange={(e) => handleChange("district", e.target.value)} />
          </label>

          <label>
            Phường/Xã
            <input value={form.ward} onChange={(e) => handleChange("ward", e.target.value)} />
          </label>

          <label>
            Địa chỉ chi tiết
            <input value={form.detailAddress} onChange={(e) => handleChange("detailAddress", e.target.value)} />
          </label>

          <label>
            Tên máy
            <input value={form.productName} onChange={(e) => handleChange("productName", e.target.value)} />
          </label>

          <label>
            Model
            <input value={form.productModel} onChange={(e) => handleChange("productModel", e.target.value)} />
          </label>

          <label>
            Serial
            <input value={form.serialNumber} onChange={(e) => handleChange("serialNumber", e.target.value)} />
          </label>

          <label>
            Ngày mua
            <input type="date" value={form.purchaseDate} onChange={(e) => handleChange("purchaseDate", e.target.value)} />
          </label>

          <label>
            Hết hạn bảo hành
            <input type="date" value={form.warrantyExpiry} onChange={(e) => handleChange("warrantyExpiry", e.target.value)} />
          </label>

          <label>
            Ngày hẹn
            <input type="date" value={form.preferredDate} onChange={(e) => handleChange("preferredDate", e.target.value)} />
          </label>

          <label>
            Khung giờ
            <input value={form.preferredTimeSlot} onChange={(e) => handleChange("preferredTimeSlot", e.target.value)} />
          </label>

          <label>
            Tiêu đề lỗi
            <input value={form.issueTitle} onChange={(e) => handleChange("issueTitle", e.target.value)} />
          </label>
        </div>

        <label>
          Mô tả lỗi
          <textarea value={form.issueDescription} onChange={(e) => handleChange("issueDescription", e.target.value)} />
        </label>

        <label>
          Link hình ảnh, mỗi dòng 1 link
          <textarea value={form.imageUrlsText} onChange={(e) => handleChange("imageUrlsText", e.target.value)} />
        </label>

        <div className="srFormActions">
          <button type="button" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
}