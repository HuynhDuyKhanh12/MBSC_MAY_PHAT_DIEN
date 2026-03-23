import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getProducts,
  softDeleteProduct,
  toggleProductStatus,
  type ProductItem,
} from "./productStorage";

export default function ProductPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ProductItem[]>([]);

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

  const loadProducts = () => {
    const data = getProducts()
      .filter((item) => !item.deleted)
      .map((item) => ({
        ...item,
        type: item.type || "",
      }));

    setRows(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleStatus = (id: number) => {
    toggleProductStatus(id);
    loadProducts();
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
    loadProducts();
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
      trashLink="/admin/product/trash"
    >
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