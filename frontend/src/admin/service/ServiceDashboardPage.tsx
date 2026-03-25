import { Link } from "react-router-dom";
import { getAllServices, getDeletedServices } from "./serviceStorage";
import "./service-admin.css";

export default function ServiceDashboardPage() {
  const rows = getAllServices();
  const deletedRows = getDeletedServices();

  const maintenance = rows.filter((x) => x.serviceType === "Bảo quản");
  const repair = rows.filter((x) => x.serviceType === "Sửa chữa");
  const warranty = rows.filter((x) => x.serviceType === "Bảo hành");

  const completed = rows.filter((x) => x.status === "Hoàn thành").length;
  const processing = rows.filter(
    (x) => x.status === "Đang kiểm tra" || x.status === "Đang xử lý"
  ).length;

  return (
    <div className="serviceDashboardPage">
      <div className="serviceDashboardHero">
        <div>
          <h1>Trung tâm bảo quản, sửa chữa & bảo hành</h1>
          <p>Quản lý dịch vụ sau bán hàng theo từng nhóm chức năng riêng biệt</p>
        </div>
      </div>

      <div className="serviceOverviewGrid">
        <div className="serviceOverviewCard">
          <span>Tổng hồ sơ</span>
          <strong>{rows.length}</strong>
        </div>
        <div className="serviceOverviewCard">
          <span>Đang xử lý</span>
          <strong>{processing}</strong>
        </div>
        <div className="serviceOverviewCard">
          <span>Hoàn thành</span>
          <strong>{completed}</strong>
        </div>
        <div className="serviceOverviewCard">
          <span>Trong thùng rác</span>
          <strong>{deletedRows.length}</strong>
        </div>
      </div>

      <div className="serviceModuleGrid">
        <Link to="/admin/service/maintenance" className="serviceModuleCard">
          <h3>Bảo quản</h3>
          <p>Quản lý bảo dưỡng, thay nhớt, vệ sinh, kiểm tra định kỳ</p>
          <strong>{maintenance.length} phiếu</strong>
        </Link>

        <Link to="/admin/service/repair" className="serviceModuleCard">
          <h3>Sửa chữa</h3>
          <p>Quản lý lỗi máy, thay linh kiện, xử lý sự cố vận hành</p>
          <strong>{repair.length} phiếu</strong>
        </Link>

        <Link to="/admin/service/warranty" className="serviceModuleCard">
          <h3>Bảo hành</h3>
          <p>Quản lý sản phẩm còn hạn bảo hành và quy trình xác nhận</p>
          <strong>{warranty.length} phiếu</strong>
        </Link>

        <Link to="/admin/service/trash" className="serviceModuleCard serviceModuleCardTrash">
          <h3>Thùng rác</h3>
          <p>Xem phiếu đã xóa, khôi phục hoặc xóa vĩnh viễn</p>
          <strong>{deletedRows.length} phiếu</strong>
        </Link>
      </div>

      <div className="serviceQuickNote">
        <h3>Gợi ý sử dụng</h3>
        <p>
          Khi bấm xóa ở các trang quản lý, phiếu sẽ được chuyển vào thùng rác.
          Bạn có thể vào trang thùng rác để khôi phục lại.
        </p>
      </div>
    </div>
  );
}