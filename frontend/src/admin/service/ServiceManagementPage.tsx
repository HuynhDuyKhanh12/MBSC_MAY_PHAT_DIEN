import { useEffect, useMemo, useState } from "react";
import {
  createService,
  formatMoney,
  getAllServices,
  getServicesByType,
  softDeleteService,
  type ServiceItem,
  type ServiceStatus,
  type ServiceType,
  updateService,
  updateServiceStatus,
} from "./serviceStorage";
import "./service-admin.css";

type Props = {
  serviceType?: ServiceType;
  title: string;
  description: string;
};

const emptyForm = (serviceType: ServiceType = "Sửa chữa") => ({
  customerName: "",
  phone: "",
  email: "",
  address: "",
  productName: "",
  machineModel: "",
  serialNumber: "",
  serviceType,
  issue: "",
  note: "",
  receiveDate: "",
  expectedDate: "",
  technician: "",
  cost: 0,
  status: "Chờ tiếp nhận" as ServiceStatus,
});

export default function ServiceManagementPage({
  serviceType,
  title,
  description,
}: Props) {
  const [rows, setRows] = useState<ServiceItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm(serviceType || "Sửa chữa"));

  const loadData = () => {
    const data = serviceType ? getServicesByType(serviceType) : getAllServices();
    setRows(data);
  };

  useEffect(() => {
    loadData();
  }, [serviceType]);

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const kw = keyword.toLowerCase().trim();

      const matchKeyword =
        !kw ||
        item.customerName.toLowerCase().includes(kw) ||
        item.phone.toLowerCase().includes(kw) ||
        item.productName.toLowerCase().includes(kw) ||
        item.machineModel.toLowerCase().includes(kw) ||
        item.serialNumber.toLowerCase().includes(kw);

      const matchStatus =
        filterStatus === "Tất cả" ? true : item.status === filterStatus;

      return matchKeyword && matchStatus;
    });
  }, [rows, keyword, filterStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "cost" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm(serviceType || "Sửa chữa"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.customerName ||
      !form.phone ||
      !form.productName ||
      !form.machineModel ||
      !form.serialNumber ||
      !form.issue ||
      !form.receiveDate
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (editingId !== null) {
      updateService(editingId, form);
    } else {
      createService(form);
    }

    loadData();
    resetForm();
  };

  const handleEdit = (item: ServiceItem) => {
    setEditingId(item.id);
    setForm({
      customerName: item.customerName,
      phone: item.phone,
      email: item.email,
      address: item.address,
      productName: item.productName,
      machineModel: item.machineModel,
      serialNumber: item.serialNumber,
      serviceType: item.serviceType,
      issue: item.issue,
      note: item.note,
      receiveDate: item.receiveDate,
      expectedDate: item.expectedDate,
      technician: item.technician,
      cost: item.cost,
      status: item.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn chuyển phiếu này vào thùng rác không?");
    if (!ok) return;

    softDeleteService(id);
    loadData();

    if (editingId === id) resetForm();
  };

  const handleChangeStatus = (id: number, status: ServiceStatus) => {
    updateServiceStatus(id, status);
    loadData();
  };

  const total = rows.length;
  const waiting = rows.filter((x) => x.status === "Chờ tiếp nhận").length;
  const processing = rows.filter(
    (x) => x.status === "Đang kiểm tra" || x.status === "Đang xử lý"
  ).length;
  const done = rows.filter((x) => x.status === "Hoàn thành").length;

  return (
    <div className="serviceAdminPage">
      <div className="serviceHero">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="serviceStats">
          <div className="serviceStatCard">
            <span>Tổng phiếu</span>
            <strong>{total}</strong>
          </div>
          <div className="serviceStatCard">
            <span>Chờ tiếp nhận</span>
            <strong>{waiting}</strong>
          </div>
          <div className="serviceStatCard">
            <span>Đang xử lý</span>
            <strong>{processing}</strong>
          </div>
          <div className="serviceStatCard">
            <span>Hoàn thành</span>
            <strong>{done}</strong>
          </div>
        </div>
      </div>

      <div className="serviceMainGrid">
        <div className="serviceFormCard">
          <div className="serviceCardHeader">
            <h2>{editingId ? "Cập nhật phiếu" : "Tạo phiếu mới"}</h2>
            <p>Nhập thông tin chi tiết cho dịch vụ</p>
          </div>

          <form className="serviceForm" onSubmit={handleSubmit}>
            <div className="serviceFormRow">
              <div className="serviceField">
                <label>Họ và tên *</label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Nhập tên khách hàng"
                />
              </div>

              <div className="serviceField">
                <label>Số điện thoại *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="serviceFormRow">
              <div className="serviceField">
                <label>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                />
              </div>

              <div className="serviceField">
                <label>Địa chỉ</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>

            <div className="serviceFormRow">
              <div className="serviceField">
                <label>Tên sản phẩm *</label>
                <input
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="Tên sản phẩm"
                />
              </div>

              <div className="serviceField">
                <label>Mẫu máy *</label>
                <input
                  name="machineModel"
                  value={form.machineModel}
                  onChange={handleChange}
                  placeholder="Model máy"
                />
              </div>
            </div>

            <div className="serviceFormRow">
              <div className="serviceField">
                <label>Số serial *</label>
                <input
                  name="serialNumber"
                  value={form.serialNumber}
                  onChange={handleChange}
                  placeholder="Số serial"
                />
              </div>

              <div className="serviceField">
                <label>Loại dịch vụ</label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  disabled={!!serviceType}
                >
                  <option value="Bảo quản">Bảo quản</option>
                  <option value="Sửa chữa">Sửa chữa</option>
                  <option value="Bảo hành">Bảo hành</option>
                </select>
              </div>
            </div>

            <div className="serviceFormRow">
              <div className="serviceField">
                <label>Ngày tiếp nhận *</label>
                <input
                  type="date"
                  name="receiveDate"
                  value={form.receiveDate}
                  onChange={handleChange}
                />
              </div>

              <div className="serviceField">
                <label>Ngày hẹn trả</label>
                <input
                  type="date"
                  name="expectedDate"
                  value={form.expectedDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="serviceFormRow">
              <div className="serviceField">
                <label>Kỹ thuật viên</label>
                <input
                  name="technician"
                  value={form.technician}
                  onChange={handleChange}
                  placeholder="Tên kỹ thuật viên"
                />
              </div>

              <div className="serviceField">
                <label>Chi phí</label>
                <input
                  type="number"
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="serviceField">
              <label>Tình trạng / yêu cầu *</label>
              <textarea
                name="issue"
                value={form.issue}
                onChange={handleChange}
                rows={4}
                placeholder="Mô tả lỗi hoặc yêu cầu"
              />
            </div>

            <div className="serviceField">
              <label>Ghi chú</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                placeholder="Ghi chú thêm"
              />
            </div>

            <div className="serviceField">
              <label>Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
                <option value="Đang kiểm tra">Đang kiểm tra</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Chờ bàn giao">Chờ bàn giao</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>

            <div className="serviceFormActions">
              <button type="submit" className="serviceBtn serviceBtnPrimary">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </button>

              <button
                type="button"
                className="serviceBtn serviceBtnSecondary"
                onClick={resetForm}
              >
                Làm mới
              </button>
            </div>
          </form>
        </div>

        <div className="serviceTableCard">
          <div className="serviceCardHeader">
            <h2>Danh sách phiếu</h2>
            <p>Quản lý toàn bộ hồ sơ dịch vụ</p>
          </div>

          <div className="serviceToolbar">
            <input
              className="serviceSearch"
              placeholder="Tìm khách hàng, điện thoại, sản phẩm, serial..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <select
              className="serviceSelect"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Tất cả</option>
              <option>Chờ tiếp nhận</option>
              <option>Đang kiểm tra</option>
              <option>Đang xử lý</option>
              <option>Chờ bàn giao</option>
              <option>Hoàn thành</option>
              <option>Đã hủy</option>
            </select>
          </div>

          <div className="serviceTableWrap">
            <table className="serviceTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Khách hàng</th>
                  <th>Thiết bị</th>
                  <th>Loại</th>
                  <th>Nội dung</th>
                  <th>Ngày</th>
                  <th>Kỹ thuật</th>
                  <th>Chi phí</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length > 0 ? (
                  filteredRows.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="serviceCellStack">
                          <strong>{item.customerName}</strong>
                          <span>{item.phone}</span>
                          <span>{item.email || "Chưa có email"}</span>
                        </div>
                      </td>

                      <td>
                        <div className="serviceCellStack">
                          <strong>{item.productName}</strong>
                          <span>{item.machineModel}</span>
                          <span>Serial: {item.serialNumber}</span>
                        </div>
                      </td>

                      <td>
                        <span className="serviceTypeBadge">
                          {item.serviceType}
                        </span>
                      </td>

                      <td className="serviceIssueCell">
                        <strong>{item.issue}</strong>
                        {item.note ? (
                          <div className="serviceNote">{item.note}</div>
                        ) : null}
                      </td>

                      <td>
                        <div className="serviceCellStack">
                          <strong>{item.receiveDate || "--"}</strong>
                          <span>Hẹn: {item.expectedDate || "--"}</span>
                        </div>
                      </td>

                      <td>{item.technician || "--"}</td>

                      <td>{formatMoney(item.cost)}</td>

                      <td>
                        <div className="serviceStatusBox">
                          <span className={`serviceStatus ${statusClass(item.status)}`}>
                            {item.status}
                          </span>

                          <select
                            className="serviceMiniSelect"
                            value={item.status}
                            onChange={(e) =>
                              handleChangeStatus(
                                item.id,
                                e.target.value as ServiceStatus
                              )
                            }
                          >
                            <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
                            <option value="Đang kiểm tra">Đang kiểm tra</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Chờ bàn giao">Chờ bàn giao</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Đã hủy">Đã hủy</option>
                          </select>
                        </div>
                      </td>

                      <td>
                        <div className="serviceActions">
                          <button
                            className="serviceBtn serviceBtnEdit"
                            onClick={() => handleEdit(item)}
                          >
                            Sửa
                          </button>
                          <button
                            className="serviceBtn serviceBtnDelete"
                            onClick={() => handleDelete(item.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="serviceEmpty">
                      Không có dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function statusClass(status: ServiceStatus) {
  switch (status) {
    case "Chờ tiếp nhận":
      return "serviceStatusWaiting";
    case "Đang kiểm tra":
      return "serviceStatusChecking";
    case "Đang xử lý":
      return "serviceStatusProcessing";
    case "Chờ bàn giao":
      return "serviceStatusPendingDelivery";
    case "Hoàn thành":
      return "serviceStatusDone";
    case "Đã hủy":
      return "serviceStatusCancel";
    default:
      return "";
  }
}