import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getProducts,
  softDeleteProduct,
  toggleProductStatus,
} from "./productStorage";

export default function ProductPage() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "name", label: "Tên sản phẩm" },
    { key: "category", label: "Danh mục" },
    { key: "brand", label: "Thương hiệu" },
    { key: "price", label: "Giá gốc" },
    { key: "salePrice", label: "Giá khuyến mãi" },
    { key: "stock", label: "Số lượng" },
    { key: "type", label: "Kiểu" },
    { key: "realId", label: "ID" },
  ];

  const rows = getProducts()
    .filter((item) => !item.deleted)
    .map((item) => ({
      ...item,
      type: item.type || "",
    }));

  const handleToggleStatus = (id: number) => {
    toggleProductStatus(id);
    setRefresh((prev) => prev + 1);
  };

  const handleView = (id: number) => {
    navigate(`/admin/product/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/product/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if (!ok) return;
    softDeleteProduct(id);
    setRefresh((prev) => prev + 1);
  };

  return (
    <AdminPageShell
      title="Quản lý sản phẩm"
      breadcrumb="Sản phẩm"
      searchPlaceholder="Tìm kiếm sản phẩm..."
      filters={[
        { label: "Danh mục", options: ["Khai vị", "Món chính"] },
        { label: "Thương hiệu", options: ["Món Việt", "Món Âu"] },
      ]}
      addLink="/admin/product/create"
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