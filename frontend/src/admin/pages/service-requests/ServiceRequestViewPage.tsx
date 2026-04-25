import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  assignTechnicianApi,
  getServiceRequestByIdApi,
} from "../../../api/modules/serviceRequestApi";
import "./ServiceRequestAdmin.css";

const statusText: Record<string, string> = {
  PENDING: "Đang chờ",
  RECEIVED: "Đã tiếp nhận",
  ASSIGNED: "Đã phân công",
  INSPECTING: "Đang kiểm tra",
  IN_PROGRESS: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const typeText: Record<string, string> = {
  MAINTENANCE: "Bảo trì",
  REPAIR: "Sửa chữa",
};

export default function ServiceRequestViewPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [technicianId, setTechnicianId] = useState("");

  const fetchData = async () => {
    try {
      const res = await getServiceRequestByIdApi(id!);
      setItem(res.data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Không lấy được chi tiết phiếu");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAssign = async () => {
    if (!technicianId) {
      alert("Nhập ID kỹ thuật viên");
      return;
    }

    try {
      await assignTechnicianApi(id!, {
        assignedToId: Number(technicianId),
        note: "Admin phân công kỹ thuật viên xử lý phiếu",
      });
      alert("Phân công thành công");
      fetchData();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Phân công thất bại");
    }
  };

  if (!item) return <div className="srPage">Đang tải...</div>;

  return (
    <div className="srPage">
      <div className="srHeader">
        <div>
          <h1>Chi tiết phiếu #{item.code}</h1>
          <p>Xem thông tin khách hàng, sản phẩm, hình ảnh và lịch sử xử lý.</p>
        </div>

        <div className="srHeaderActions">
          <Link className="srBtn edit" to={`/admin/service-requests/${item.id}/edit`}>
            Sửa phiếu
          </Link>
          <Link className="srBtn view" to="/admin/service-requests">
            Quay lại
          </Link>
        </div>
      </div>

      <div className="srGrid">
        <div className="srCard">
          <h2>Thông tin khách hàng</h2>
          <p><b>Họ tên:</b> {item.customerName}</p>
          <p><b>SĐT:</b> {item.customerPhone}</p>
          <p><b>Email:</b> {item.customerEmail || "Không có"}</p>
          <p><b>Địa chỉ:</b> {item.detailAddress}, {item.ward}, {item.district}, {item.province}</p>
        </div>

        <div className="srCard">
          <h2>Thông tin phiếu</h2>
          <p><b>Loại:</b> {typeText[item.type] || item.type}</p>
          <p><b>Trạng thái:</b> {statusText[item.status] || item.status}</p>
          <p><b>Ngày hẹn:</b> {item.preferredDate ? new Date(item.preferredDate).toLocaleDateString("vi-VN") : "Không có"}</p>
          <p><b>Khung giờ:</b> {item.preferredTimeSlot || "Không có"}</p>
        </div>

        <div className="srCard">
          <h2>Thông tin sản phẩm</h2>
          <p><b>Tên máy:</b> {item.productName}</p>
          <p><b>Model:</b> {item.productModel || "Không có"}</p>
          <p><b>Serial:</b> {item.serialNumber || "Không có"}</p>
          <p><b>Ngày mua:</b> {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString("vi-VN") : "Không có"}</p>
          <p><b>Hết hạn bảo hành:</b> {item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString("vi-VN") : "Không có"}</p>
        </div>

        <div className="srCard">
          <h2>Phân công kỹ thuật viên</h2>
          <p><b>Hiện tại:</b> {item.assignedTo?.fullName || "Chưa phân công"}</p>
          <div className="srAssign">
            <input
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              placeholder="Nhập ID kỹ thuật viên"
              type="number"
            />
            <button onClick={handleAssign}>Phân công</button>
          </div>
        </div>
      </div>

      <div className="srCard">
        <h2>Nội dung yêu cầu</h2>
        <p><b>Tiêu đề:</b> {item.issueTitle}</p>
        <p>{item.issueDescription || "Không có mô tả"}</p>
      </div>

      <div className="srCard">
        <h2>Hình ảnh</h2>
        <div className="srImages">
          {(item.images || []).length === 0 ? (
            <span>Không có hình ảnh</span>
          ) : (
            item.images.map((img: any) => (
              <img key={img.id} src={img.imageUrl} alt="service" />
            ))
          )}
        </div>
      </div>

      <div className="srCard">
        <h2>Lịch sử xử lý</h2>
        <div className="srLogs">
          {(item.logs || []).map((log: any) => (
            <div className="srLog" key={log.id}>
              <b>{log.action}</b>
              <span>
                {log.oldStatus || "NONE"} → {log.newStatus}
              </span>
              <p>{log.note}</p>
              <small>{log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN") : ""}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}