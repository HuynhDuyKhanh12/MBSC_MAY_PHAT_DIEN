import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteServiceRequestApi,
  getServiceRequestsApi,
  updateServiceRequestStatusApi,
  type ServiceRequestStatus,
} from "../../../api/modules/serviceRequestApi";
import "./ServiceRequestAdmin.css";

const statusOptions: ServiceRequestStatus[] = [
  "PENDING",
  "RECEIVED",
  "ASSIGNED",
  "INSPECTING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

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

export default function ServiceRequestListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getServiceRequestsApi({
        keyword: keyword || undefined,
        status: status || undefined,
        type: type || undefined,
        page: 1,
        limit: 100,
      });

      setItems(res.items || res.data || []);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Không lấy được danh sách phiếu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa phiếu này?")) return;

    try {
      await deleteServiceRequestApi(id);
      alert("Xóa phiếu thành công");
      fetchData();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleChangeStatus = async (id: number, nextStatus: ServiceRequestStatus) => {
    try {
      await updateServiceRequestStatusApi(id, {
        status: nextStatus,
        note: `Admin cập nhật trạng thái sang ${nextStatus}`,
      });
      fetchData();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div className="srPage">
      <div className="srHeader">
        <div>
          <h1>Quản lý phiếu bảo trì / sửa chữa</h1>
          <p>Danh sách yêu cầu bảo trì, sửa chữa máy phát điện của khách hàng.</p>
        </div>
      </div>

      <div className="srFilter">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm mã phiếu, khách hàng, SĐT, sản phẩm..."
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tất cả loại phiếu</option>
          <option value="MAINTENANCE">Bảo trì</option>
          <option value="REPAIR">Sửa chữa</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusText[s]}
            </option>
          ))}
        </select>

        <button onClick={fetchData}>Lọc</button>
      </div>

      <div className="srCard">
        {loading ? (
          <div className="srEmpty">Đang tải dữ liệu...</div>
        ) : items.length === 0 ? (
          <div className="srEmpty">Không có phiếu nào</div>
        ) : (
          <div className="srTableWrap">
            <table className="srTable">
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>Khách hàng</th>
                  <th>Loại</th>
                  <th>Sản phẩm</th>
                  <th>Lỗi/Yêu cầu</th>
                  <th>Kỹ thuật viên</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="srCode">{item.code}</td>
                    <td>
                      <b>{item.customerName}</b>
                      <span>{item.customerPhone}</span>
                    </td>
                    <td>{typeText[item.type] || item.type}</td>
                    <td>{item.productName}</td>
                    <td>{item.issueTitle}</td>
                    <td>{item.assignedTo?.fullName || "Chưa phân công"}</td>
                    <td>
                      <select
                        className={`srStatus srStatus-${item.status}`}
                        value={item.status}
                        onChange={(e) =>
                          handleChangeStatus(item.id, e.target.value as ServiceRequestStatus)
                        }
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {statusText[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : ""}</td>
                    <td>
                      <div className="srActions">
                        <Link className="srBtn view" to={`/admin/service-requests/${item.id}`}>
                          Xem
                        </Link>
                        <Link className="srBtn edit" to={`/admin/service-requests/${item.id}/edit`}>
                          Sửa
                        </Link>
                        <button className="srBtn delete" onClick={() => handleDelete(item.id)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}