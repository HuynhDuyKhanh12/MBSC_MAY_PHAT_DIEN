import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getCoupons,
  softDeleteCoupon,
  toggleCouponStatus,
  type CouponItem,
} from "./couponStorage";

export default function CouponPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<CouponItem[]>([]);

  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "code", label: "Code" },
    { key: "discountText", label: "Giảm giá" },
    { key: "couponStatus", label: "Trạng thái coupon" },
    { key: "realId", label: "ID" },
  ];

  const loadCoupons = () => {
    const data = getCoupons()
      .filter((item) => !item.deleted)
      .map((item) => ({
        ...item,
        discountText: `${item.discount}%`,
      }));

    setRows(data as any);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleView = (id: number) => {
    navigate(`/admin/coupon/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/coupon/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa coupon này?");
    if (!ok) return;
    softDeleteCoupon(id);
    loadCoupons();
  };

  const handleToggleStatus = (id: number) => {
    toggleCouponStatus(id);
    loadCoupons();
  };

  return (
    <AdminPageShell
      title="Quản lý mã giảm giá"
      breadcrumb="Coupon"
      searchPlaceholder="Tìm kiếm coupon..."
      addLink="/admin/coupon/create"
    >
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/coupon/trash")}>Thùng rác</button>
      </div>

      <AdminTable
        columns={columns}
        rows={rows}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </AdminPageShell>
  );
}