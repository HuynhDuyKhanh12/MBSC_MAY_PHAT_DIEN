import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getBrands,
  softDeleteBrand,
  toggleBrandStatus,
} from "./brandStorage";

export default function BrandPage() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "name", label: "Tên thương hiệu" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Mô tả" },
    { key: "realId", label: "ID" },
  ];

  const rows = getBrands().filter((item) => !item.deleted);

  const handleToggleStatus = (id: number) => {
    toggleBrandStatus(id);
    setRefresh((prev) => prev + 1);
  };

  const handleView = (id: number) => {
    navigate(`/admin/brand/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/brand/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa thương hiệu này?");
    if (!ok) return;
    softDeleteBrand(id);
    setRefresh((prev) => prev + 1);
  };

  return (
    <AdminPageShell
      title="Quản lý thương hiệu"
      breadcrumb="Thương hiệu"
      searchPlaceholder="Tìm kiếm thương hiệu..."
      addLink="/admin/brand/create"
      trashLink="/admin/brand/trash"
    >
      <AdminTable
        key={refresh}
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