import { useEffect, useMemo, useState } from "react";
import {
  clearDeletedServices,
  formatMoney,
  getDeletedServices,
  permanentlyDeleteService,
  restoreService,
  type ServiceItem,
} from "./serviceStorage";
import "./service-admin.css";

export default function ServiceTrashPage() {
  const [rows, setRows] = useState<ServiceItem[]>([]);
  const [keyword, setKeyword] = useState("");

  const loadData = () => {
    setRows(getDeletedServices());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(() => {
    const kw = keyword.toLowerCase().trim();

    return rows.filter((item) => {
      if (!kw) return true;

      return (
        item.customerName.toLowerCase().includes(kw) ||
        item.phone.toLowerCase().includes(kw) ||
        item.productName.toLowerCase().includes(kw) ||
        item.machineModel.toLowerCase().includes(kw) ||
        item.serialNumber.toLowerCase().includes(kw)
      );
    });
  }, [rows, keyword]);

  const handleRestore = (id: number) => {
    restoreService(id);
    loadData();
  };

  const handlePermanentDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn phiếu này không?");
    if (!ok) return;

    permanentlyDeleteService(id);
    loadData();
  };

  const handleClearTrash = () => {
    const ok = window.confirm("Bạn có chắc muốn xóa toàn bộ thùng rác không?");
    if (!ok) return;

    clearDeletedServices();
    loadData();
  };

  return (
    <div className="serviceAdminPage">
      <div className="serviceHero serviceHeroTrash">
        <div>
          <h1>Thùng rác phiếu dịch vụ</h1>
          <p>Khôi phục phiếu đã xóa hoặc xóa vĩnh viễn</p>
        </div>

        <div className="serviceStats">
          <div className="serviceStatCard">
            <span>Số phiếu trong rác</span>
            <strong>{rows.length}</strong>
          </div>
        </div>
      </div>

      <div className="serviceTableCard">
        <div className="serviceCardHeader serviceCardHeaderRow">
          <div>
            <h2>Danh sách đã xóa</h2>
            <p>Các phiếu được xóa mềm sẽ nằm ở đây</p>
          </div>

          <button
            type="button"
            className="serviceBtn serviceBtnDelete"
            onClick={handleClearTrash}
          >
            Xóa toàn bộ thùng rác
          </button>
        </div>

        <div className="serviceToolbar serviceToolbarSingle">
          <input
            className="serviceSearch"
            placeholder="Tìm trong thùng rác..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
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
                      <span className="serviceTypeBadge">{item.serviceType}</span>
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
                      <span className="serviceStatus serviceStatusTrash">
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className="serviceActions">
                        <button
                          className="serviceBtn serviceBtnRestore"
                          onClick={() => handleRestore(item.id)}
                        >
                          Khôi phục
                        </button>

                        <button
                          className="serviceBtn serviceBtnDelete"
                          onClick={() => handlePermanentDelete(item.id)}
                        >
                          Xóa hẳn
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="serviceEmpty">
                    Thùng rác đang trống
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}