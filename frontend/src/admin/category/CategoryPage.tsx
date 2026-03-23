import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getCategories,
  softDeleteCategory,
  toggleCategoryStatus,
} from "./categoryStorage";

export default function CategoryPage() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "name", label: "Tên danh mục" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Mô tả" },
    { key: "realId", label: "ID" },
  ];

  const rows = getCategories().filter((item) => !item.deleted);

  const handleToggleStatus = (id: number) => {
    toggleCategoryStatus(id);
    setRefresh((prev) => prev + 1);
  };

  const handleView = (id: number) => {
    navigate(`/admin/category/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/category/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa danh mục này?");
    if (!ok) return;
    softDeleteCategory(id);
    setRefresh((prev) => prev + 1);
  };

  return (
    <AdminPageShell
      title="Quản lý danh mục"
      breadcrumb="Danh mục"
      searchPlaceholder="Tìm kiếm danh mục..."
      addLink="/admin/category/create"
      trashLink="/admin/category/trash"
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