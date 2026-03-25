import { useEffect, useMemo, useState } from "react";
import "./warranty-repair.css";

type ServiceType = "Bảo quản" | "Sửa chữa" | "Bảo hành";

type ServiceStatus =
  | "Chờ tiếp nhận"
  | "Đang kiểm tra"
  | "Đang xử lý"
  | "Hoàn thành"
  | "Đã hủy";

type ServiceItem = {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  productName: string;
  machineModel: string;
  serialNumber: string;
  serviceType: ServiceType;
  issue: string;
  note: string;
  receiveDate: string;
  expectedDate: string;
  status: ServiceStatus;
  technician: string;
};

const STORAGE_KEY = "admin_warranty_repair";

const demoData: ServiceItem[] = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "vana@gmail.com",
    address: "Thủ Dầu Một, Bình Dương",
    productName: "Máy phát điện Honda 5KW",
    machineModel: "Honda HK-5000",
    serialNumber: "HD5000-001",
    serviceType: "Sửa chữa",
    issue: "Máy khó nổ, điện ra không ổn định",
    note: "Khách yêu cầu kiểm tra gấp",
    receiveDate: "2026-03-25",
    expectedDate: "2026-03-28",
    status: "Chờ tiếp nhận",
    technician: "Kỹ thuật 1",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    phone: "0988888888",
    email: "thib@gmail.com",
    address: "Dĩ An, Bình Dương",
    productName: "Máy phát điện Elemax 3KW",
    machineModel: "Elemax EM-3000",
    serialNumber: "EL3000-112",
    serviceType: "Bảo hành",
    issue: "Máy không khởi động được",
    note: "Còn thời hạn bảo hành",
    receiveDate: "2026-03-24",
    expectedDate: "2026-03-27",
    status: "Đang xử lý",
    technician: "Kỹ thuật 2",
  },
];

function getStoredData(): ServiceItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return demoData;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return demoData;
  }
}

function saveStoredData(data: ServiceItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const emptyForm = {
  customerName: "",
  phone: "",
  email: "",
  address: "",
  productName: "",
  machineModel: "",
  serialNumber: "",
  serviceType: "Sửa chữa" as ServiceType,
  issue: "",
  note: "",
  receiveDate: "",
  expectedDate: "",
  status: "Chờ tiếp nhận" as ServiceStatus,
  technician: "",
};

export default function WarrantyRepairPage() {
  const [rows, setRows] = useState<ServiceItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setRows(getStoredData());
  }, []);

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

      const matchType =
        filterType === "Tất cả" ? true : item.serviceType === filterType;

      const matchStatus =
        filterStatus === "Tất cả" ? true : item.status === filterStatus;

      return matchKeyword && matchType && matchStatus;
    });
  }, [rows, keyword, filterType, filterStatus]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      alert("Vui lòng nhập đầy đủ các thông tin bắt buộc");
      return;
    }

    if (editingId !== null) {
      const updated = rows.map((item) =>
        item.id === editingId ? { ...item, ...form } : item
      );
      setRows(updated);
      saveStoredData(updated);
      resetForm();
      return;
    }

    const newItem: ServiceItem = {
      id: Date.now(),
      ...form,
    };

    const updated = [newItem, ...rows];
    setRows(updated);
    saveStoredData(updated);
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
      status: item.status,
      technician: item.technician,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa phiếu này không?");
    if (!ok) return;

    const updated = rows.filter((item) => item.id !== id);
    setRows(updated);
    saveStoredData(updated);

    if (editingId === id) resetForm();
  };

  const handleStatusChange = (id: number, status: ServiceStatus) => {
    const updated = rows.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    setRows(updated);
    saveStoredData(updated);
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
          <h1>Quản lý bảo quản & sửa chữa</h1>
          <p>
            Quản lý phiếu bảo quản, bảo hành và sửa chữa máy phát điện cho khách
            hàng
          </p>
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
            <h2>{editingId !== null ? "Cập nhật phiếu" : "Tạo phiếu mới"}</h2>
            <p>Nhập thông tin bảo quản, bảo hành hoặc sửa chữa</p>
          </div>

          <form onSubmit={handleSubmit} className="serviceForm">
            <div className="serviceFormRow">
              <div className="serviceField">
                <label>Họ và tên *</label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Nhập họ tên khách hàng"
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
                  placeholder="Ví dụ: Máy phát điện Honda 5KW"
                />
              </div>
              <div className="serviceField">
                <label>Mẫu máy *</label>
                <input
                  name="machineModel"
                  value={form.machineModel}
                  onChange={handleChange}
                  placeholder="Ví dụ: Honda HK-5000"
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
                  placeholder="Nhập số serial"
                />
              </div>
              <div className="serviceField">
                <label>Loại yêu cầu</label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
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
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
                  <option value="Đang kiểm tra">Đang kiểm tra</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="serviceField">
                <label>Kỹ thuật phụ trách</label>
                <input
                  name="technician"
                  value={form.technician}
                  onChange={handleChange}
                  placeholder="Nhập tên kỹ thuật"
                />
              </div>
            </div>

            <div className="serviceField">
              <label>Mô tả tình trạng *</label>
              <textarea
                name="issue"
                value={form.issue}
                onChange={handleChange}
                rows={4}
                placeholder="Mô tả lỗi, tình trạng máy, yêu cầu bảo quản..."
              />
            </div>

            <div className="serviceField">
              <label>Ghi chú</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                placeholder="Nhập ghi chú thêm"
              />
            </div>

            <div className="serviceFormActions">
              <button type="submit" className="serviceBtn serviceBtnPrimary">
                {editingId !== null ? "Cập nhật phiếu" : "Thêm phiếu"}
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
            <p>Tìm kiếm, lọc, sửa, xóa và đổi trạng thái phiếu</p>
          </div>

          <div className="serviceToolbar">
            <input
              className="serviceSearch"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên khách, SĐT, sản phẩm, serial..."
            />

            <select
              className="serviceSelect"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>Tất cả</option>
              <option>Bảo quản</option>
              <option>Sửa chữa</option>
              <option>Bảo hành</option>
            </select>

            <select
              className="serviceSelect"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Tất cả</option>
              <option>Chờ tiếp nhận</option>
              <option>Đang kiểm tra</option>
              <option>Đang xử lý</option>
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
                  <th>Máy</th>
                  <th>Loại</th>
                  <th>Lỗi / yêu cầu</th>
                  <th>Ngày tiếp nhận</th>
                  <th>Trạng thái</th>
                  <th>Kỹ thuật</th>
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

                      <td className="serviceIssueCell">{item.issue}</td>

                      <td>
                        <div className="serviceCellStack">
                          <strong>{item.receiveDate || "--"}</strong>
                          <span>Hẹn trả: {item.expectedDate || "--"}</span>
                        </div>
                      </td>

                      <td>
                        <div className="serviceStatusBox">
                          <span
                            className={`serviceStatus serviceStatus-${slugStatus(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>

                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(
                                item.id,
                                e.target.value as ServiceStatus
                              )
                            }
                            className="serviceMiniSelect"
                          >
                            <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
                            <option value="Đang kiểm tra">Đang kiểm tra</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Đã hủy">Đã hủy</option>
                          </select>
                        </div>
                      </td>

                      <td>{item.technician || "--"}</td>

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
                    <td colSpan={9} className="serviceEmpty">
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

function slugStatus(status: string) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}